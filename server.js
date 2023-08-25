require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const socketio = require('socket.io');
const io = socketio(server);
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');



//////google authenticatin.////////////
const passport = require('passport');
require('./config/passport-setup');
const userRoute = require('./routes/user');
const profRoute = require('./routes/profile');

const mongoose = require('mongoose');
// const cookieSession = require('cookie-session');
const session = require('express-session')



const connectionString = process.env.MONGO_URI;

// Connect using promises
mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
    // Additional logic after successful connection
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  // cookie: { secure: true }
}));


app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', userRoute);
app.use('/profile', profRoute);


app.get('/', (req, res) => {
  console.log('app started');
  res.render('home', { user: req.user });
});


app.get('/newMeeting', (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app.get('/:room', (req, res) => { 
  res.render('room', { roomId: req.params.room, user: req.user });
});

io.on('connection', socket => {
  console.log('A user connected:', socket.id);

  socket.on('join-room', (roomId, userId) => {
    console.log('User', userId, 'is joining room', roomId);

    socket.join(roomId);
    socket.on('ready',()=>{
        socket.to(roomId).emit('user-connected', userId);
        });
    socket.on('message', (message, user) => {
        io.to(roomId).emit('createMessage', message, user);
    });    

    socket.on('disconnect', () => {
      console.log('User', userId, 'disconnected from room', roomId);
      socket.to(roomId).emit('user-disconnected', userId);
    });
  });
});

io.on("connect_error", (err) => {
  console.log(`Connection error: ${err.message}`);
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});



app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true}))
var nodemailer = require('nodemailer');


const client = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: "lolobrahma2001@gmail.com",
      pass: process.env.PASSKEY,
  }
});

app.post('/invite', async(req, res) => {
  var mailOptions = {
      from: 'lolobrahma2001@gmail.com',
      to: req.body.xyz,
      subject: 'Sending Email using Node.js',
      text: 'https://localhost:3000/abc/zxy-ght',
      body: 'Join the meet!'
  };
  client.sendMail(mailOptions, function(error, info) {
      if (error) {
          console.log(error);
      } else {
          console.log('Email sent: ' + info.response);
      }
  });
  res.redirect('/newMeeting');

})