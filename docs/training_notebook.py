"""
EfficientNetB0 NDT Defect Detection Training Script
====================================================
This script is designed to run in Google Colab.
It trains an EfficientNetB0 model on NDT surface defect datasets
(NEU, DAGM, or Roboflow Steel Defect).

The trained model can be deployed as a REST API to replace the
Lovable AI-based analysis in supabase/functions/analyze-defect/index.ts

Datasets supported:
- NEU Surface Defect Database (Kaggle)
- DAGM 2007 Competition Dataset (Kaggle)
- Steel Defect (Roboflow)

Usage:
1. Open in Google Colab
2. Upload kaggle.json for Kaggle datasets
3. Run all cells
4. Download the trained model (.h5)
5. Deploy as a Flask/FastAPI endpoint
"""

# !pip install kaggle roboflow

dataset_choice = "neu"

# === Dataset Download ===

if dataset_choice == "neu":
    # from google.colab import files
    # files.upload()   # upload kaggle.json
    # !mkdir -p ~/.kaggle
    # !cp kaggle.json ~/.kaggle/
    # !chmod 600 ~/.kaggle/kaggle.json
    # !kaggle datasets download -d kaustubhdikshit/neu-surface-defect-database --force
    # !unzip -o neu-surface-defect-database.zip -d /content/dataset
    import os
    dataset_dir = "/content/dataset/NEU-DET/train/images"

if dataset_choice == "dagm":
    import os
    dataset_dir = "/content/dataset/Dataset 1/train"

if dataset_choice == "steel":
    # from roboflow import Roboflow
    # rf = Roboflow(api_key="YOUR_ROBOFLOW_API_KEY")
    # project = rf.workspace("gowshi").project("steel-defect-8m2yr-b7kor")
    # dataset = project.version(1).download("folder")
    # dataset_dir = dataset.location + "/train"
    pass

# === Model Training ===

import tensorflow as tf
import numpy as np
import matplotlib.pyplot as plt
from tensorflow.keras.applications import EfficientNetB0
from tensorflow.keras.layers import GlobalAveragePooling2D, Dropout, Dense
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau

img_size = (128, 128)
batch_size = 32

train_ds_raw = tf.keras.utils.image_dataset_from_directory(
    dataset_dir, validation_split=0.2, subset="training",
    seed=42, image_size=img_size, batch_size=batch_size
)
val_ds_raw = tf.keras.utils.image_dataset_from_directory(
    dataset_dir, validation_split=0.2, subset="validation",
    seed=42, image_size=img_size, batch_size=batch_size
)

class_names = train_ds_raw.class_names
num_classes = len(class_names)

AUTOTUNE = tf.data.AUTOTUNE
train_ds = train_ds_raw.cache().shuffle(1000).prefetch(AUTOTUNE)
val_ds = val_ds_raw.cache().prefetch(AUTOTUNE)

data_augmentation = tf.keras.Sequential([
    tf.keras.layers.RandomFlip("horizontal_and_vertical"),
    tf.keras.layers.RandomRotation(0.2),
    tf.keras.layers.RandomZoom(0.2),
    tf.keras.layers.RandomContrast(0.2),
])

base_model = EfficientNetB0(weights='imagenet', include_top=False, input_shape=(*img_size, 3))
base_model.trainable = False

model = tf.keras.Sequential([
    data_augmentation, base_model, GlobalAveragePooling2D(),
    Dropout(0.5), Dense(256, activation='relu', kernel_regularizer=tf.keras.regularizers.l2(1e-4)),
    Dropout(0.3), Dense(num_classes, activation='softmax')
])

model.compile(optimizer=Adam(learning_rate=1e-3), loss='sparse_categorical_crossentropy', metrics=['accuracy'])

callbacks = [
    EarlyStopping(patience=7, restore_best_weights=True, monitor='val_accuracy'),
    ReduceLROnPlateau(factor=0.5, patience=3, min_lr=1e-7, monitor='val_loss')
]

# Phase 1: Train top layers
history1 = model.fit(train_ds, epochs=10, validation_data=val_ds, callbacks=callbacks)

# Phase 2: Fine-tune
base_model.trainable = True
for layer in base_model.layers[:100]:
    layer.trainable = False

model.compile(optimizer=Adam(learning_rate=1e-4), loss='sparse_categorical_crossentropy', metrics=['accuracy'])
history2 = model.fit(train_ds, epochs=10, validation_data=val_ds, callbacks=callbacks)

final_loss, final_acc = model.evaluate(val_ds)
print(f"Final Validation Accuracy: {final_acc:.4f}")
model.save('/content/efficientnetb0_defects.h5')
