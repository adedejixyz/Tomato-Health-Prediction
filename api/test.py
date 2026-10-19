import tensorflow as tf

MODEL = tf.keras.models.load_model("../model/1.keras")

print("Model loaded successfully!")
print(MODEL.input_shape)
print(MODEL.output_shape)