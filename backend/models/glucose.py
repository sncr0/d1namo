import pandas as pd
import os


def load_glucose_sample():
    print(os.getcwd())
    glucose_sample_path = '../data/glucose.csv'  # maybe need to update
    glucose_sample_df = pd.read_csv(glucose_sample_path, memory_map=True)
    data = glucose_sample_df[glucose_sample_df['type'] == "cgm"]
    return data
