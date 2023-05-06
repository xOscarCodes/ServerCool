# Generate Dummy Data
---
This directory includes the files to generated dummy data for testing.

## Changing 'COM Port' and 'Baud Rate'
---
#### Cloning the repo
```bash 
git clone https://github.com/xOscarCodes/IoT-Application-Development.git
```

#### Open two terminals and Change to the directory to 'Dummy Data Generation' directory 
```bash
cd .\IoT-Application-Development\
```

#### Command in Terminal 2
```bash
cd .\arduino\
```

#### Open any code editor 
```bash
code .
```

#### Make changes to the code
Change `path`  and `baudeRate` value to change `COM PORT` and `Baud Rate`  
```javascript
const port = new SerialPort({
    path: 'COM4',   // Change the COM port as required 
    baudRate: 9600  // Change the Baude Rate as required
})
```

Make sure that the bade rate matches with the baud rate from the Arduino code
```c++
	Serial.begin(9600);
```

## Run Locally
---

#### Open two terminals and Change to the directory to 'Dummy Data Generation' directory 
```bash
cd .\IoT-Application-Development\
```

```bash
cd '.\Dummy Data Generation\'
```
 
##### Command in Terminal 1
```bash
cd .\MQTT-API\
```

###### Start the server
```bash 
npm start
```

##### Command in Terminal 2
```bash
cd .\arduino\
```

###### Start the server
```bash
npm start
```
