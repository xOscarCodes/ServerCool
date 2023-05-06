## Hosting instructions:

Onto integrated terminals:
1. Terminal 1: 
a. Change to web directory using 
```bash
  cd web
```
b. Run the script using 
```bash
  npm start
```
2. Terminal 2: 
a. Change to web directory using 
```bash
  cd mqtt
```
b. Run the script using 
```bash
  npm start
```
3. Terminal 3: 
a. Change to web directory using 
```bash
  cd api
```
b. Run the script using 
```bash
  npm start
```

Note: *Keep all these terminals active to keep this working*
Visit the website on port `3000`. (`API: 5000` and `MQTT: 5001`)
## Environment Variables

To run this project, you will need to add the following environment variables to your .env or config/keys.js file

`MONGO_URI` `MONGO_USER` `MONGO_PASS`
`MQTT_URI` `MQTT_USERNAME``MQTT_PASSWORD``MQTT_PORT`


## Features

- Light/dark mode toggle
- Live previews
- Fullscreen mode
- Cross platform


## Tech Stack

**Frontend:** HTML, CSS, EJS, SCSS, Highcharts, Bootstrap

**Backend:** Node, Express, Passport, Axios, Bycrpt


## License

[MIT](https://choosealicense.com/licenses/mit/)

