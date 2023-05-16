# Necessary Changes before deployment
## Front-End and Back-End
- [Web-API](./Changes/Web-API.md)
- [Mqtt-API](./Changes/Mqtt-API.md)
- [Web-App](./Changes/Web-App.md)

## Automation
- [Automation](./Changes/Automation.md)

## Hardware
- [Hardware](./Changes/Hardware.md)

# Deployment 
## Install Dependencies 
### Install Node.js
**Update the package index files on the system**
```bash 
sudo apt-get update
```

**Downloads and installs the most recent packages**
```bash 
sudo apt-get upgrade
```

**Install Node.js**
```bash
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
```

```bash
sudo apt-get install -y nodejs
```

### Install Docker 
**Install Docker**
```bash
sudo apt-get install docker.io
```

**Start Docker**
```bash
sudo systemctl start docker
```

**Enable Docker**
```bash
sudo systemctl enable docker
```

### Install Python dependencies 
```bash 
pip install paho-mqtt pymongo pandas scikit-learn keras
```

### Install MQTT Locally
- Refer to this tutorial by digital ocean: [Link](https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-the-mosquitto-mqtt-messaging-broker-on-ubuntu-16-04)

### Install and Configure MongoDB locally
- Refer to this official documentation by MongoDB to install on Ubuntu: [Link](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/)
- Refer to this official documentation by MongoDB to install on any other operating system: [Link](https://www.mongodb.com/docs/manual/administration/install-community/)
- Refer to this documentation by Baeldung to enable authentication and remote connection: [Link](https://www.baeldung.com/linux/mongodb-remote-connections)

## Deployment
### API Deployment 
**Change directory**
```bash
cd /website/api/
```

**Remove `node_modules` folder**
```bash
rm -r node_modules
```

**Install dependencies**
```bash
npm i
```

**Create a `Dockerfile` file using any text editor**
```bash 
nano Dockerfile
```

Contents in the file 
```Dockerfile
FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD [ "npm", "start" ]
```

**Create docker image of the API**
```bash
sudo docker build -t web-api .
```

**Run the docker image**
```bash
sudo docker run -p 5000:5000 web-api
```

**Run the docker image in the background**
```bash
sudo docker run -d -p 5000:5000 web-api
```

### MQTT API Deployment 
**Change directory**
```bash
cd /website/mqtt/
```

**Remove `node_modules` folder**
```bash
rm -r node_modules
```

**Install dependencies**
```bash
npm i
```

**Create a `Dockerfile` file using any text editor**
```bash 
nano Dockerfile
```

Contents in the file 
```Dockerfile
FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5001

CMD [ "npm", "start" ]
```

**Create docker image of the API**
```bash
sudo docker build -t mqtt-api .
```

**Run the docker image**
```bash
sudo docker run -p 5001:5001 mqtt-api
```

**Run the docker image in the background**
```bash
sudo docker run -d -p 5001:5001 mqtt-api
```

### Web App Deployment 
**Change directory**
```bash
cd /website/web/
```

**Remove `node_modules` folder**
```bash
rm -r node_modules
```

**Install dependencies**
```bash
npm i
```

**Create a `Dockerfile` file using any text editor**
```bash 
nano Dockerfile
```

Contents in the file 
```Dockerfile
FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
```

**Create docker image of the API**
```bash
sudo docker build -t web-app .
```

**Run the docker image**
```bash
sudo docker run -p 3000:3000 web-app
```

**Run the docker image in the background**
```bash
sudo docker run -d -p 3000:3000 web-app
```

### Node Deployment 
Install dependencies in the Arduino IDE
- UIPEthernet 
	- Version: 2.0.12
- OneWire
	- Version: 2.3.7
- DallasTemperature
	- Version: 3.11.0
- PubSubClient
	- Version: 2.8
- IRremoteESP8266
	- Version: 2.8.4
- LiquidCrystal_I2C
	- Version: 1.1.4

Can directly import the dependencies from the following folder
```bash 
cd /ESP/ServerProject/.pio/libdeps/esp32doit-devkit-v1
```

If you are using PlatformIO, you can directly import `ServerProject` folder, it contained all the require libraries and the source code of the node.

**What is [PlatformIO](https://platformio.org/)?**
- Refer to this [link](https://docs.platformio.org/en/latest/what-is-platformio.html).

**How to install PlatformIO**
- Refer to this [link](https://platformio.org/install/ide?install=vscode).