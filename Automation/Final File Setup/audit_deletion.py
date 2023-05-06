import pandas as pd
import pymongo
import time
import datetime

# choose one day of month for data deletion

username = "<USERNAME>"
password = "<PASSWORD>"

date_of_deletion = 21

connection_string = "mongodb://<USERNAME>:<PASSWORD>@<IP>:<PORT>/?authSource=admin"

client = pymongo.MongoClient(connection_string)


db = client.serverCool
collection_nodes = db.nodes
collection_nodeData = db.nodeData
collection_audits = db.audits

done_once = False

while True:

    # Get current date
    today = datetime.date.today()

    if today.day == date_of_deletion and not done_once:
        collection_nodes.delete_many({})
        collection_nodeData.delete_many({})
        collection_audits.delete_many({})
        done_once = True
        print("done")

    elif today.day != date_of_deletion:
        done_once = False
