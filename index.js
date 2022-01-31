const express = require('express');
const http = require('http');
const cors = require('cors');
require('dotenv').config();

const brokerConsumer = require('./msgBroker/consumer');
const brokerProducer = require('./msgBroker/producer');

const authRouter =  require('./routes/auth.route');
const userRouter = require('./routes/user.route');


// Init express 
const app = express();

// Setup express
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// API routes
app.use('/api/v1/auth/', authRouter);
app.use('/api/v1/user/', userRouter);

// Get environment vars
const host = process.env.SERVER_HOST;
const port = process.env.SERVER_PORT;


// Connect to RabbitMQ broker and make channel
Promise.all([brokerConsumer.initReplyConsumer(), brokerProducer.producerInit()]).then(values => {
    // Start server
    const httpServer = http.createServer(app);
    httpServer.listen(port, host, function () {
        console.log('Server listening on port ' + port);
        console.log("Ready");
    });
});


