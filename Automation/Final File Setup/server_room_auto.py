from keras.layers import Dense
from keras.models import Sequential
from sklearn.preprocessing import StandardScaler
import pandas as pd
import pymongo
import time
import paho.mqtt.client as mqtt

scaler = StandardScaler()
model = Sequential()

ac_temp = ""
ac_fan = ""

username = "<USERNAME>"
password = "<PASSWORD>"

def train():
    print("training")
    data = pd.read_csv('data_format_final.csv')
    X = data[['temperature']].values
    y = data[[' ac_temp', 'fan_speed']].values

    # feature scaling
    X = scaler.fit_transform(X)

    # modify input_shape
    model.add(Dense(64, activation='relu', input_shape=(1,)))
    model.add(Dense(64, activation='linear'))
    model.add(Dense(64, activation='linear'))
    model.add(Dense(2))

    model.compile(loss='mse', optimizer='adam')

    new_X = X.reshape(-1, 1)
    model.fit(new_X, y, epochs=500, batch_size=32, verbose=0)
    print("training done")
    print("------------------------------------------------------")


def autoChange(current_temp):

    input_data = scaler.transform([[current_temp]])
    predicted_output = model.predict(input_data)

    ac_temperature = predicted_output[0][0]
    fan_speed = predicted_output[0][1]

    ac_temp = round(ac_temperature, 0)
    ac_fan = round(fan_speed, 0)

    if ac_temp < 17:
        ac_temp = 17
    elif ac_temp > 25:
        ac_temp = 25

    if ac_fan < 0:
        ac_fan = 0
    elif ac_fan > 2:
        ac_fan = 2

    ac_temp = int(ac_temp)
    ac_fan = int(ac_fan)

    # print(ac_temp) # publish this
    # print(ac_fan)

    if ac_fan == 0:
        message = str(ac_temp) + "l"
    elif ac_fan == 1:
        message = str(ac_temp) + "m"
    elif ac_fan == 2:
        message = str(ac_temp) + "h"

    # client_mqtt.publish(topic, message)
    return message


train()


while (True):

    start_time = time.time()
    while (True):
        # message_test = autoChange(22)
        # print(message_test)
        
        connection_string = "mongodb://<USERNAME>:<PASSWORD>@<IP>:<PORT>/?authSource=admin"
        
        client = pymongo.MongoClient(connection_string)
        
        db = client.serverCool
        collection = db.nodes

        data = {}

        for doc in collection.find():
            data[doc['nodeId']] = {
                'roomtemp': doc['roomtemp'], 'mode': doc['mode']}

        # print(data)

        client_mqtt = mqtt.Client()
        
        client_mqtt.username_pw_set(username, password)
        
        broker="172.16.20.56"
        client_mqtt.connect(broker)

        for node_id in data.keys():
            if data[node_id]["mode"] == "Automatic":
                predicted_temp = autoChange(data[node_id]["roomtemp"])
                print(str(predicted_temp))
                topic = "/nodes/" + str(node_id)
                print(topic)
                client_mqtt.publish(topic, str(predicted_temp))
                print("automatic node: "+str(node_id))
                print("----------------------------")
                print()
            else:
                print("node: " + str(node_id) + " is set to manual")
                print("----------------------------")
                print()

        if (time.time() - start_time) >= 86400:
            train()
            break

        time.sleep(600)
