**Git clone the entire repository**

```bash
git clone https://github.com/xOscarCodes/ServerCool.git
```

**Change directory**

```bash
cd /Automation/Final\ File\ Setup/
```

**Change `audit_deletion.py` and `server_room_auto.py`**
Change `connection_string`
```python
connection_string = "mongodb://<USERNAME>:<PASSWORD>@<IP>:<PORT>/?authSource=admin"
```

Replace `<USERNAME>` and `<PASSWORD>` with correct MongoDB credentials

Change MQTT credentials
```python
username = "<MQTT-USERNAME>"
password = "<MQTT-PASSWORD>"
```

Replace `<MQTT-USERNAME>` and `<MQTT-PASSWORD>` with correct MQTT credentials