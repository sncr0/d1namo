import os
import torch
import pandas as pd
import torch.nn as nn
import torch.optim as optim
import matplotlib.pyplot as plt
from torch.utils.data import Dataset, DataLoader, random_split


################################################################################
#   D A T A S E T   D E F I N I T I O N
################################################################################
class MemoryMappedGlucoseDataset(Dataset):
    def __init__(self, root_dir):
        """
        Args:
            root_dir (str): Path to the root folder containing patient folders.
        """
        self.root_dir = root_dir
        self.patient_folders = sorted([
            f for f in os.listdir(root_dir) if os.path.isdir(os.path.join(root_dir, f))
        ])

    def __len__(self):
        return len(self.patient_folders)

    def __getitem__(self, idx):
        """
        Loads a patient's glucose.csv file using memory mapping.
        Returns:
            X: Torch tensor of glucose readings.
            y: Corresponding target labels (e.g., next glucose value).
        """
        patient_folder = self.patient_folders[idx]
        patient_glucose_path = os.path.join(self.root_dir, patient_folder, 'glucose.csv')

        if not os.path.exists(patient_glucose_path):
            raise FileNotFoundError(f"Missing file: {patient_glucose_path}")

        # Load glucose data with memory mapping
        glucose_df = pd.read_csv(patient_glucose_path, memory_map=True)

        # Convert to NumPy (assuming glucose values are in a column named 'glucose')
        X = glucose_df['glucose'].iloc[0:100].values  # First 100 glucose readings
        y = glucose_df['glucose'].iloc[101:102].values   # Next glucose value as target

        # Convert to PyTorch tensors
        X_tensor = torch.tensor(X, dtype=torch.float32)
        y_tensor = torch.tensor(y, dtype=torch.float32)

        return X_tensor, y_tensor


################################################################################
#   M O D E L   D E F I N I T I O N
################################################################################
class GlucoseLSTM(nn.Module):
    def __init__(self, input_dim=1, hidden_dim=128, num_layers=2):
        super(GlucoseLSTM, self).__init__()
        self.hidden_dim = hidden_dim
        self.num_layers = num_layers

        self.lstm = nn.LSTM(input_dim, hidden_dim, num_layers, batch_first=True)
        self.fc = nn.Linear(hidden_dim, 1)  # Predicts 1 step at a time

    def forward(self, x):
        batch_size = x.size(0)
        h = torch.zeros(self.num_layers, batch_size, self.hidden_dim).to(x.device)
        c = torch.zeros(self.num_layers, batch_size, self.hidden_dim).to(x.device)

        lstm_out, (h, c) = self.lstm(x, (h, c))  # Process input sequence
        next_value = self.fc(lstm_out[:, -1, :])  # Predict next step
        return next_value


################################################################################
#   D A T A    L O A D I N G
################################################################################
def prepare_data(root_dir, batch_size=1):
    dataset = MemoryMappedGlucoseDataset(root_dir)
    train_size = int(0.8 * len(dataset))
    test_size = len(dataset) - train_size
    train_dataset, test_dataset = random_split(dataset, [train_size, test_size])

    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True, num_workers=0)
    test_loader = DataLoader(test_dataset, batch_size=batch_size, shuffle=False, num_workers=0)
    return train_loader, test_loader


################################################################################
#   T R A I N I N G   F U N C T I O N S
################################################################################
def train_model(model, train_loader, num_epochs=50, learning_rate=0.001, save_path="ml/glucose_model.pth"):
    criterion = nn.MSELoss()
    optimizer = optim.Adam(model.parameters(), lr=learning_rate)

    for epoch in range(num_epochs):
        model.train()
        total_loss = 0

        for X_batch, y_batch in train_loader:
            X_batch = X_batch.unsqueeze(-1)  # Ensures shape: (batch_size, 100, 1)

            optimizer.zero_grad()
            y_pred = model(X_batch)
            loss = criterion(y_pred, y_batch)
            loss.backward()
            optimizer.step()
            total_loss += loss.item()

        print(f"Epoch {epoch+1}/{num_epochs}, Loss: {total_loss / len(train_loader):.4f}")

    # Save the trained model
    torch.save(model.state_dict(), save_path)
    print(f"Model saved to {save_path}")


################################################################################
#   E V A L U A T I O N   F U N C T I O N S
################################################################################
def evaluate_model(model, test_loader, save_path="glucose_model.pth"):
    model.load_state_dict(torch.load(save_path))
    model.eval()

    all_true_y = []
    all_pred_y = []

    with torch.no_grad():
        for X_batch, y_batch in test_loader:
            X_batch = X_batch.unsqueeze(-1)  # Ensure shape: (batch_size, 100, 1)
            y_pred = model(X_batch)

            # plt.plot(X_batch.detach().numpy()[0, :, 0], label='Glucose Readings')
            # plt.scatter(100, y_batch.detach().numpy(), label='True Next Value', color='green')
            # plt.scatter(100, y_pred.detach().numpy(), label='Predicted Value', color='red')
            # plt.legend()
            # plt.show()

            all_true_y.extend(y_batch.tolist())
            all_pred_y.extend(y_pred.tolist())

    # Print final predictions
    for i, (true_vals, pred_vals) in enumerate(zip(all_true_y, all_pred_y)):
        print(f"Sample {i+1}: True y: {true_vals}, Predicted y: {pred_vals}")


################################################################################
#   M A I N   F U N C T I O N
################################################################################
if __name__ == "__main__":
    diabetes_dir = "/home/sncr0/data/d1namo/diabetes_subset_pictures-glucose-food-insulin/diabetes_subset_pictures-glucose-food-insulin"  # noqa

    print("Preparing data...")
    train_loader, test_loader = prepare_data(diabetes_dir)

    print(f"Train samples: {len(train_loader.dataset)}")
    print(f"Test samples: {len(test_loader.dataset)}")

    # Initialize model
    model = GlucoseLSTM()

    print("Training model...")
    train_model(model, train_loader)

    print("Evaluating model...")
    evaluate_model(model, test_loader)
