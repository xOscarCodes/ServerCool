const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const port = 5000;

const config = require('./config/keys');
const url = config.MongoURI;

const options = {
    authSource: 'admin',
    user: config.user,
    pass: config.pass,
    useNewUrlParser: true,
    useUnifiedTopology: true
};
mongoose.connect(url, options)
    .then(() => {
        console.log('Connected successfully to server');
    })
    .catch((error) => {
        console.log(error);
    });

app.use(cors());
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Enable CORS for all requests
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

const Nodes = require('./models/nodes.js');
const NodeData = require('./models/nodedata.js');
const Audits = require('./models/audit.js');

/**
 * @api {get} /api/test Test API
 * @apiName TestAPI
 * @apiGroup General
 *
 * @apiSuccessExample Success Response:
 *     HTTP/1.1 200 OK
 *     "The API is working!"
 */
app.get('/api/test', (req, res) => {
    res.send('The API is working!');
});
/**
 * @api {get} /api/nodes Get all nodes
 * @apiName GetNodes
 * @apiGroup Nodes
 *
 * @apiSuccess {Object[]} nodes List of all nodes
 * @apiSuccess {Number} nodes.nodeId Node ID
 * @apiSuccess {String} nodes.location Node location
 * @apiSuccess {Number} nodes.actemp Node AC temperature
 * @apiSuccess {String} nodes.fanSpeed Node fan speed
 * @apiSuccess {Number} nodes.roomtemp Node room temperature
 * @apiSuccess {String} nodes.mode Node mode
 * @apiSuccess {Boolean} nodes.status Node status
 * @apiSuccess {String} nodes.lastUpdated Timestamp of last update
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "nodeId": 1,
 *         "location": "Room 1",
 *         "actemp": 22,
 *         "fanSpeed": "medium",
 *         "roomtemp": 24,
 *         "mode": "cool",
 *         "status": true,
 *         "lastUpdated": "2023-05-05T12:34:56Z"
 *       },
 *       {
 *         "nodeId": 2,
 *         "location": "Room 2",
 *         "actemp": 23,
 *         "fanSpeed": "low",
 *         "roomtemp": 25,
 *         "mode": "heat",
 *         "status": false,
 *         "lastUpdated": "2023-05-04T23:45:01Z"
 *       }
 *     ]
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "Internal server error"
 *     }
 */
app.get('/api/nodes', async (req, res) => {
    const doc = await Nodes.find({});
    res.send(doc);
});

/**
 * @api {get} /api/nodeData/:id Get sensor data for a node
 * @apiName GetNodeData
 * @apiGroup NodeData
 *
 * @apiParam {Number} id ID of the node to retrieve sensor data for
 *
 * @apiSuccess {Number} sensorId ID of the node
 * @apiSuccess {String} location Location of the node
 * @apiSuccess {Array} tempSensorData Array of temperature sensor data
 * @apiSuccess {Array} unixTime Array of Unix timestamps corresponding to the temperature sensor data
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "sensorId": 1,
 *       "location": "Room 101",
 *       "tempSensorData": [22.5, 23, 22.8, 22.2],
 *       "unixTime": [1620225020000, 1620225030000, 1620225040000, 1620225050000]
 *     }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Node data not found"
 *     }
 */

app.get('/api/nodeData/:id', async (req, res) => {
    try {
        const doc = await NodeData.find({ sensorId: req.params.id })
        console.log(doc);
        res.status(200).send(doc);

    } catch (error) {
    }
});
/**
 * @api {get} /api/nodes/:id Get data for a specific node
 * @apiName GetNode
 * @apiGroup Nodes
 *
 * @apiParam {String} id ID of the node to retrieve data for
 *
 * @apiSuccess {Object[]} nodes List of all data for the specified node
 * @apiSuccess {String} nodes.sensorId Sensor ID
 * @apiSuccess {Number} nodes.temperature Temperature reading from the sensor
 * @apiSuccess {Number} nodes.humidity Humidity reading from the sensor
 * @apiSuccess {String} nodes.timestamp Timestamp of the reading
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "sensorId": "abc123",
 *         "temperature": 25.3,
 *         "humidity": 48.2,
 *         "timestamp": "2023-05-05T12:34:56Z"
 *       },
 *       {
 *         "sensorId": "abc123",
 *         "temperature": 25.4,
 *         "humidity": 47.9,
 *         "timestamp": "2023-05-05T12:35:01Z"
 *       }
 *     ]
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Node not found"
 *     }
 */
app.get('/api/nodes/:id', async (req, res) => {
    const doc = await Nodes.find({ nodeId: req.params.id });
    res.send(doc);
});
/**
 * @api {get} /api/node/test Request all nodes from mock data
 * @apiName GetNodesExample
 * @apiGroup Nodes
 *
 * @apiSuccess {Object[]} Node List of all nodes.
 * @apiSuccess {String} Node._id Unique ID of the node.
 * @apiSuccess {String} Node.location Location of the node.
 * @apiSuccess {String} Node.acTemp Temperature of the node's AC.
 * @apiSuccess {String} Node.roomTemp Temperature of the node's room.
 * @apiSuccess {Boolean} lights.status Status of the node's AC.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
    "nodes": [
        {
            "_id": 1,
            "location": "Edison",
            "acTemp": 17,
            "roomTemp": 23,
            "status": true
        },
        {
            "_id": 2,
            "location": "Turing",
            "acTemp": 19,
            "roomTemp": 21,
            "status": false
        },
        {
            "_id": 3,
            "location": "Picasso",
            "acTemp": 23,
            "roomTemp": 21,
            "status": true
        }
    ]
}
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "Error message"
 *     }
 */
app.get('/api/node/test', (req, res) => {
    res.sendFile(__dirname + "/mock/nodes.json")
});
/**
 * @api {get} /api/audits Get all audit records
 * @apiName GetAudits
 * @apiGroup Audits
 *
 * @apiSuccess {Object[]} audits List of all audit records
 * @apiSuccess {String} audits.userName Name of the user who performed the action
 * @apiSuccess {String} audits.userId ID of the user who performed the action
 * @apiSuccess {String} audits.message Description of the action performed
 * @apiSuccess {String} audits.time Timestamp of when the action was performed
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "userName": "Alice",
 *         "userId": "1234",
 *         "message": "Created new user",
 *         "time": "2023-05-05T12:34:56Z"
 *       },
 *       {
 *         "userName": "Bob",
 *         "userId": "5678",
 *         "message": "Updated user information",
 *         "time": "2023-05-05T12:35:01Z"
 *       }
 *     ]
 *  
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "Could not retrieve audit records"
 *     }
 */
app.get('/api/audits', async (req, res) => {
    const doc = await Audits.find({});
    res.send(doc);
});
/**
 * @api {post} /api/audit Add an audit entry
 * @apiName AddAudit
 * @apiGroup Audit
 *
 * @apiParam {String} userName Name of the user who triggered the audit event
 * @apiParam {String} userId ID of the user who triggered the audit event
 * @apiParam {String} message Details of the audit event
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "Failed to save audit entry"
 *     }
 */
app.post('/api/audit', async (req, res) => {
    const { userName, userId, message } = req.body;
    const time = Date.now();
    const newEntry = new Audits({
        userName,
        userId,
        message,
        time
    });
    newEntry.save();
});
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});