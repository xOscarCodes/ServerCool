from keras.layers import Dense
from keras.models import Sequential
from sklearn.preprocessing import StandardScaler
import pandas as pd

# Load the data
data = pd.read_csv('server_room_data.csv')

# Separate the features and target
X = data[['temperature']].values
y = data[['ac_temperature', 'fan_speed']].values

# Scale the features
scaler = StandardScaler()
X = scaler.fit_transform(X)

# Define the neural network architecture
model = Sequential()
model.add(Dense(64, input_dim=2, activation='relu'))
model.add(Dense(64, activation='relu'))
model.add(Dense(2, activation='linear'))

# Compile the model
model.compile(loss='mse', optimizer='adam')

# Train the model
model.fit(X, y, epochs=100, batch_size=32)

# Get the current temperature and humidity
current_temp = 25.5


# Preprocess the input data
input_data = scaler.transform([[current_temp]])

# Make a prediction
predicted_output = model.predict(input_data)

# Set the AC temperature and fan speed
ac_temperature = predicted_output[0][0]
fan_speed = predicted_output[0][1]
