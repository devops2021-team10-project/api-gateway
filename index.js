const express = require('express');
const http = require('http');
const cors = require('cors');
require('dotenv').config();

const brokerConsumer = require('./msgBroker/consumer');
const brokerProducer = require('./msgBroker/producer');

const authRouter =  require('./routes/auth.route');
const userRouter = require('./routes/user.route');

// Middleware
const { authenticateUser } = require('./middleware/authenticateUser.middleware');
const { authorizeRoles } = require('./middleware/authorizeRoles.middleware');
const { authorizeFollowing } = require('./middleware/authorizeFollowing.middleware');

// Enum
const roleEnum = require("./utils/userRoleEnum");


// Init express 
const app = express();

// Setup express
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());


// AUTH API ROUTES
app.post('/api/v1/auth/public/regularUserLogin', authRouter.regularUserLogin);
app.get('/api/v1/auth/findByJWTHeader', authenticateUser(), authRouter.findByJWTHeader);
app.post('/api/v1/auth/public/findByJWTValue', authRouter.findByJWTValue);

// USER API ROUTES
app.get('/api/v1/user/public/byUsername/:username', userRouter.findPublicUserByUsername);
app.get('/api/v1/user/public/byId/:userId', userRouter.findPublicUserById);
app.get('/api/v1/user/public/searchByName/:name', userRouter.searchPublicUsersByName);
app.post('/api/v1/user', userRouter.registerRegularUser);
app.put('/api/v1/user/basicData', authenticateUser(), authorizeRoles([roleEnum.regular]), userRouter.updateRegularUser);
app.put('/api/v1/user/resetPassword', authenticateUser(), authorizeRoles([roleEnum.regular]), userRouter.resetPassword);
app.put('/api/v1/user/changeIsPrivate', authenticateUser(), authorizeRoles([roleEnum.regular]), userRouter.changeIsPrivate);
app.put('/api/v1/user/changeIsTaggable', authenticateUser(), authorizeRoles([roleEnum.regular]), userRouter.changeIsTaggable);
app.put('/api/v1/user/changeMutedProfile', authenticateUser(), authorizeRoles([roleEnum.regular]), userRouter.changeMutedProfile);
app.put('/api/v1/user/changeBlockedProfile', authenticateUser(), authorizeRoles([roleEnum.regular]), userRouter.changeBlockedProfile);
app.delete('/api/v1/user', authenticateUser(), authorizeRoles([roleEnum.regular]), userRouter.deleteRegularUser);



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


