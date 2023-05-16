![Logo](./Images/logo.png)
# Server Cool
<p align="justify">The ServerCool interface offers a wide range of functionalities to users, who must authenticate themselves on the login page to gain access. Unauthorized use restricted from accessing information or controlling any features. One notable feature is the ability to monitor real-time temperature readings of both the server rooms and air conditioners on a single page, promoting transparency.</p>
<p align="justify">The platform also provides statistical analysis capabilities, offering line, bar, and area charts for analyzing past data. Furthermore, users can export the data in their desired format. All user actions are logged in the Audit logs, ensuring accountability and tracking.</p>
<p align="justify">A notable feature is the software's capability to switch between manual and automatic configuration. This is achieved through the utilization of neural networks for system automation. Specifically, a feedforward fully connected neural network, also known as a multi-layer perceptron (MLP), is trained to predict air conditioner temperature and fan speed based on the current room temperature. The predictions are updated every 10 minutes and published on MQTT to the designated node. Additionally, the neural network is retrained every 24 hours.</p>
<p align="justify">The MLP consists of four layers: three hidden layers and one output layer. The hidden layers employ the rectified linear unit (ReLU) as the activation function, while the output layer utilizes linear activation. The network is trained using mean squared error (MSE) loss and the Adam optimizer. This type of neural network is powerful and versatile, capable of learning complex non-linear relationships between input and output data.</p>
<p align="justify">To ensure data privacy, the audit logs, which contain the login information of users, are automatically removed from the database and the interface on the 21st of every month.</p>
<p align="justify">Another feature allows users to decode infrared (IR) signals from an air conditioner remote using an IR receiver and store the dataset in the Node. These stored signals can then be transmitted to the air conditioner's IR receiver, enabling users to activate specific commands. The transmission frequency can be adjusted to accommodate various appliances. This functionality provides a convenient and efficient method for remotely controlling the air conditioning system and managing the server room's temperature.</p>

#### Deployment Documentation: [Deployment](./Documentation/Documentation.md)

## Tech Stack
### Front-end
- HTML
- CSS
- EJS
- SCSS
- Highcharts
- Bootstrap

### Back-end
- Node js
- Express
- MongoDB

### Hardware
- ESP32
- DS18B20 Waterproof Digital Thermometer Sensor Probe
- Hi-Link 5V 0.6A AC-DC Power Converter
- Hi-Link 12V 5W Power Module
- Original JHD 20Ã—4 character LCD Display with Blue Backlight
- 12V Police Siren
- TSOP 1838B small
- IR Blaster
- ENC28J60 Ethernet LAN Module
- 5 Volt Relay 
- BC547 Transistor 
- LEDs - RED and GREEN

### Automation
- Python

### Other
- Docker
- Mosquito MQTT

## License
[MIT](https://choosealicense.com/licenses/mit/)

## Authors
- [@xOscarCodes](https://github.com/xOscarCodes)
- [@Aadi3333](https://github.com/Aadi3333)
- [@harshdeep-s](https://github.com/harshdeep-s)
- [@ishaan2307](https://github.com/ishaan2307)
- [@kanishkjain0263](https://github.com/kanishkjain0263)
- [@XQuestCode](https://github.com/XQuestCode)
- [@Yohjit-2910](https://github.com/Yohjit-2910)