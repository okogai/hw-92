import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import mongoDb from "./mongoDb";
import usersRouter from "./routers/users";

const app = express();

app.use(cors());

const port = 8000;

const router = express.Router();

app.use(express.json());

app.use('/users', usersRouter);

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