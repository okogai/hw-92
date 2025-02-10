import express from 'express';
import expressWs from 'express-ws';
import mongoose from 'mongoose';
import cors from 'cors';
import { WebSocket } from 'ws';
import mongoDb from "./mongoDb";
import usersRouter from "./routers/users";
import User from "./models/User";
import Message from "./models/Message";

const app = express();
expressWs(app);

app.use(cors());

const port = 8000;

const router = express.Router();

app.use(express.json());

app.use('/users', usersRouter);

let activeConnections = new Map<WebSocket, string>();

router.ws('/chat', (ws) => {
    ws.on('message', async (message) => {
        const { type, payload } = JSON.parse(message.toString());

        if (type === 'LOGIN') {
            try {
                const token = payload.token;

                const user = await User.findOne({ token });

                if (!user) {
                    ws.send(JSON.stringify({ type: 'ERROR', message: 'No such user!' }));
                    return;
                }

                activeConnections.set(ws, user.username);

                activeConnections.forEach((_, client) => {
                    client.send(JSON.stringify({ type: 'USER_LIST', users: Array.from(activeConnections.values()) }));
                });

                const messages = await Message.find().sort({ timestamp: -1 }).limit(30);
                ws.send(JSON.stringify({ type: 'MESSAGES', payload: messages }));

            } catch (error) {
                ws.send(JSON.stringify({ type: 'ERROR', message: 'Invalid token' }));
            }
        }

        if (type === 'MESSAGE') {
            const message = new Message({
                username: payload.username,
                message: payload.message,
            });
            await message.save();

            Object.values(activeConnections).forEach(client => {
                client.send(JSON.stringify({ type: 'NEW_MESSAGE', payload: message }));
            });
        }
    });

    ws.on('close', () => {
        const username = activeConnections.get(ws);

        if (username) {
            activeConnections.delete(ws);

            activeConnections.forEach((_, client) => {
                client.send(JSON.stringify({ type: 'USER_LIST', users: Array.from(activeConnections.values()) }));
            });
        }
    });
});

app.use(router);

const run = async () => {
    mongoose.set('strictQuery', false);
    await mongoose.connect('mongodb://localhost/chat');

    app.listen(port, () => {
        console.log(`Server started on ${port} port!`);
    });

    process.on('exit', () => {
        mongoDb.disconnect();
    });
};

run().catch(err => console.log(err));