import pymongo

connection_string = f"mongodb+srv://yohjit:2910@khfm2a1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

client = pymongo.MongoClient(connection_string)

db = client["mydatabase"]

col = db["mycollection"]

mydata = {"name": "John", "age": 30}
col.insert_one(mydata)

result = col.find({"name": "John"})
for document in result:
    print(document)
