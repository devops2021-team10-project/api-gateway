const express = require('express');
const http = require('http');
const cors = require('cors');
require('dotenv').config();

const brokerConsumer = require('./msgBroker/consumer');
const brokerProducer = require('./msgBroker/producer');

const authRouter =  require('./routes/auth.route');
const userRouter = require('./routes/user.route');
const postRouter = require('./routes/post.route');
const followingRouter = require('./routes/following.route');

// Middleware
const { authenticateUser } = require('./middleware/authenticateUser.middleware');
const { authorizeRoles } = require('./middleware/authorizeRoles.middleware');
const { multerUploader } = require('./middleware/fileUpload');

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
app.get('/api/v1/user/public/byUsername/:username', authenticateUser({passTheError: true}), authorizeRoles([roleEnum.regular]), userRouter.findPublicUserByUsername);
app.get('/api/v1/user/public/byId/:userId', authenticateUser({passTheError: true}), authorizeRoles([roleEnum.regular]), userRouter.findPublicUserById);
app.get('/api/v1/user/public/searchByName/:name', userRouter.searchPublicUsersByName);
app.post('/api/v1/user', userRouter.registerRegularUser);
app.put('/api/v1/user/basicData', authenticateUser(), authorizeRoles([roleEnum.regular]), userRouter.updateRegularUser);
app.put('/api/v1/user/resetPassword', authenticateUser(), authorizeRoles([roleEnum.regular]), userRouter.resetPassword);
app.put('/api/v1/user/changeIsPrivate', authenticateUser(), authorizeRoles([roleEnum.regular]), userRouter.changeIsPrivate);
app.delete('/api/v1/user', authenticateUser(), authorizeRoles([roleEnum.regular]), userRouter.deleteRegularUser);

// POST API ROUTES
app.get('/api/v1/post/:postId', authenticateUser({passTheError: true}), authorizeRoles([roleEnum.regular]), postRouter.findPostById);
app.get('/api/v1/post/allByUser/:userId', authenticateUser({passTheError: true}), authorizeRoles([roleEnum.regular]), postRouter.findPostsByUserId);
app.get('/api/v1/post/:postId/image', authenticateUser({passTheError: true}), authorizeRoles([roleEnum.regular]), postRouter.findPostImageByPostId);
app.post('/api/v1/post', authenticateUser(), authorizeRoles([roleEnum.regular]), multerUploader.single('image'), postRouter.create);

// FOLLOWING API ROUTES
app.put('/api/v1/following/follow/:userId', authenticateUser(), authorizeRoles([roleEnum.regular]), followingRouter.follow);
app.put('/api/v1/following/unfollow/:userId', authenticateUser(), authorizeRoles([roleEnum.regular]), followingRouter.unfollow);
app.put('/api/v1/following/approve/:userId', authenticateUser(), authorizeRoles([roleEnum.regular]), followingRouter.approveFollowing);
app.put('/api/v1/following/mute/:userId', authenticateUser(), authorizeRoles([roleEnum.regular]), followingRouter.mute);
app.put('/api/v1/following/unmute/:userId', authenticateUser(), authorizeRoles([roleEnum.regular]), followingRouter.unmute);
app.put('/api/v1/following/block/:userId', authenticateUser(), authorizeRoles([roleEnum.regular]), followingRouter.block);
app.put('/api/v1/following/unblock/:userId', authenticateUser(), authorizeRoles([roleEnum.regular]), followingRouter.unblock);
app.put('/api/v1/following/delete/:userId', authenticateUser(), authorizeRoles([roleEnum.regular]), followingRouter.deleteFollowing);



// Get environment vars
const host = process.env.SERVER_HOST;
const port = process.env.SERVER_PORT;


// Connect to RabbitMQ broker and make channel
Promise.all([brokerConsumer.initReplyConsumer(), brokerProducer.producerInit()]).then(values => {
    // Start server
    const httpServer = http.createServer(app);
    httpServer.listen(port, host, function () {
        console.log('Server listening on port ' + port);
        console.log("API Gateway - Ready");
    });
});


