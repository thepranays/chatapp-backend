const express = require('express');
const mongoose = require('mongoose');
const Http = require("http");
const { Server } = require("socket.io");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const freshUserRoutes = require('./routes/fresh-user-routes.js');
const loggedUserRoutes = require('./routes/logged-user-routes');
const Message = require('./models/Message');
const Session = require('./models/session');
const HttpError = require("./models/http-error");
const { callbackify } = require('util');
const app = express();
const connectDbUrl = "";
const httpServer = Http.createServer(app);
const io = new Server(httpServer);
app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Headers',
//         'Origin,X-Requested-With,Content-Type,Accept,Authorization');
// });
app.get("/", (req, res, next) => {
    res.send("yo");
});
app.use("/api/chatv1/", freshUserRoutes);
app.use("/api/chatv1/data/", loggedUserRoutes);
// app.use("/api/chatv1/session/", loggedUserRoutes);
app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    res.json(error);
});


// io.path("/anppi/chatv1/session/");
io.use((socket, next) => {
    //FOR TOKEN VERIFCIATION`   
    if (!socket.handshake.query || !socket.handshake.query.auth) {

        const err = new Error("403 Unauthorized");

        return next(err);
    }

    let token = socket.handshake.query.auth;
    jwt.verify(token, "secret_temp_key", function (err, decoded) {
        if (err) {
            return next(new Error("Authorization error"));
        } else {
            socket.data.decoded = decoded;
            next();
        }
    });

}).on("connection", (socket) => {
    console.log(socket.id);
    
    socket.on('join-session',(sessionId)=>{
        try{
        socket.join(sessionId);
        console.log(`Joined ${sessionId}`);
        }catch(err){
            // callBack({statusCode:403});
        }
        // callBack({statusCode:200});
    });
    socket.on("send-message",async (data)=> {        
        if(data.isSession){
            const metaData = {
                payload:data.message,
                sessionId:data.sessionId,
                sender:data.sender
            };
            console.log(data.sessionId);
            io.to(data.sessionId).emit("new-message",metaData);
            console.log(metaData);

        }else{
            const metaData = {
                payload:data.message,
                sessionId:data.sender,
                sender:data.sender

            };
            io.to(meta.sessionId).emit("new-message",metaData);
            console.log(metaData);
        }
        const receivedMessage= data.message;
        const newMessage = new Message({
            email:receivedMessage.email,
            name: receivedMessage.name,
            content:receivedMessage.content,
            atTime: receivedMessage.atTime,
            sessionId:receivedMessage.sessionId,
        });
        let session;
        try{
            session = await Session.findOneAndUpdate({metaData:data.sessionId},{},{
                upsert:true,
                new:true,
                setDefaultsOnInsert:true,
            });
           
            const ss = await mongoose.startSession();
            ss.startTransaction();
            await newMessage.save({session:ss});
            session.messages.push(newMessage);
            await session.save({session:ss});
            await ss.commitTransaction();
            
        }catch(err){
            console.log(err);
        }
      
    });
    socket.on("leave-session",(sessionId)=>{
        try{
            socket.leave(sessionId);
            console.log(`Left ${sessionId}`);
            }catch(err){
                // callBack({statusCode:403});
            }
    });
    

  

    // socket.on("metadata", (mData) => {
    //         console.log(mData);
    //         socket.on(mData.sessionName,(data)=> {
    //             const rMessage = new Message({
    //                 email:data.message.email,
    //                 content:data.message.content,
    //                 atTime:data.message.atTime,
    //                 name:data.message.name,
                           
    //              });
    //              const session = new Session({
    //                 message:rMessage,
    //                 metaData:mData.sessionName,
    //              })
    //             session.save().then((val)=>{
    //                 console.log(val);
    //             }).catch((err)=>{
    //                 console.log(err);
    //             });
    //             io.to(mData.sessionName).emit("message", data);
    //             console.log(data);
    //     });
     // });


});



mongoose.connect(connectDbUrl)
    .then(() => {
        httpServer.listen(app.get('port'), function () {
            console.log("Started Chat Backend Server"+app.get('port'));
        });
    })
    .catch((err) => {
        console.log(err);
    });



    // .on("connection", (socket) => {
    //     console.log(socket.id);
    //     socket.on("message", (data) => {
    //         io.emit("message", data);
    //         console.log(data);
    
    //     });
    
    
    // });



