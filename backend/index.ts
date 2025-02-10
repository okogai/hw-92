import express from 'express';
import expressWs from 'express-ws';
import mongoose from 'mongoose';
import cors from 'cors';
import { WebSocket } from 'ws';
import mongoDb from "./mongoDb";
import usersRouter from "./routers/users";

const app = express();
expressWs(app);

app.use(cors());

const port = 8000;

const router = express.Router();

app.use(express.json());

app.use('/users', usersRouter);

const activeConnections: WebSocket[] = [];

app.use(router);

router.ws('/chat', (ws: WebSocket) => {
    activeConnections.forEach((connection) => {
        connection.send(JSON.stringify({ type: 'draw' }));
    })
});


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