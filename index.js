import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Server from 'socket.io';

import userRoutes from './routes/user.js';
import profileRoutes from './routes/profile.js';
import postRoutes from './routes/posts.js';
import storiesRoutes from './routes/stories.js';
import competitionsRoutes from './routes/competition.js';
import conversationRoutes from './routes/conversation.js';
import adminRoutes from './routes/admin.js';
import usersRoutes from './routes/users.js'

import roomsModel from './models/rooms.js';

const app = express();

dotenv.config();

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

const CONNECTION_URL = process.env.CONNECTION_URL;
const PORT = process.env.PORT || 3000;

app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/conversations', conversationRoutes);
app.use('/posts', postRoutes);
app.use('/profile', profileRoutes);
app.use('/stories', storiesRoutes);
app.use('/competitions', competitionsRoutes);
app.use('/users',usersRoutes)

app.get('/', (req, res) => {
    res.send("Welcome to SocioClub Application!");
});

// async function inititRoom()

// console.log(CONNECTION_URL);

mongoose.connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false
}).then(() => {
    const server = app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
    const io = new Server(server, { cookie: false });

    const socketToRoom = {};

    io.on('connection', socket => {
        socket.on("join-room", async (roomID) => {
            let room = await roomsModel.findOne({ roomID: roomID });
            if (room) {
                room.users.push(socket.id);
            } else {
                room = await new roomsModel({
                    roomId: roomID,
                    users: [socket.id],
                });
            }
            await room.save();
            const otherUser = await room.users.find(id => { id !== socket.id });
            if (otherUser) {
                socket.emit("other user", otherUser);
                socket.to(otherUser).emit("user joined", socket.id);
            }
            socketToRoom[socket.id] = roomID;
            socket.join(roomID);
            const usersInThisRoom = await room.users.filter(id => { id !== socket.id });
            socket.emit("all users", usersInThisRoom);
        });

        socket.on("offer", payload => {
            io.to(payload.target).emit("offer", payload);
        });

        socket.on("answer", payload => {
            io.to(payload.target).emit("answer", payload);
        });

        socket.on("ice-candidate", incoming => {
            io.to(incoming.target).emit("ice-candidate", incoming.candidate);
        });

        socket.on('chat-message', (finalMessage) => {
            socket.broadcast.to(socketToRoom[socket.id]).emit('chat-message', finalMessage);
        });

        socket.on('screen-share', (finalMessage) => {
            socket.broadcast.to(socketToRoom[socket.id]).emit('screen-share', finalMessage);
        });

        socket.on('share', (finalMessage) => {
            socket.broadcast.to(socketToRoom[socket.id]).emit('share', finalMessage);
        });

        socket.on('leave', async() => {
            const roomID = socketToRoom[socket.id];
            let room = await roomsModel.findOne({ roomID: roomID });
            if (room) {
                room = room.users.filter(id => id !== socket.id);
                await room.save();
            }
            socket.broadcast.emit('user left', socket.id);
        });
    });
}).catch((error) => console.log(error.message));

mongoose.connection.on("connected", () => {
    console.log("Mongodb bridge connected");
});

mongoose.connection.on("error", (err) => {
    console.log(`Mongoose connection ERROR: ${err}`);
});

mongoose.connection.on("disconnected", () => {
    console.log("Mongoose connection disconnected");
});