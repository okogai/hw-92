import express from 'express';
import { Error } from 'mongoose';
import auth, {RequestWithUser} from "../middleware/auth";
import User from "../models/User";

const usersRouter = express.Router();

usersRouter.post('/register',  async (req, res, next) => {
    const {username, password, displayName} = req.body;
    try {
        const user = new User({username, password, displayName});

        user.generateToken();

        await user.save();
        res.send({message: 'Successfully registered', user});
    } catch (error) {
        if (error instanceof Error.ValidationError) {
            res.status(400).send(error);
        }
        next(error);
    }
});

usersRouter.post('/sessions', async (req, res, next) => {
    try {
        const user = await User.findOne({username: req.body.username});
        if (!user) {
            res.status(400).send({error: 'User not found'});
            return;
        }

        const isMatch = await user.checkPassword(req.body.password);

        user.generateToken();
        await user.save();

        if (!isMatch) {
            res.status(400).send({error: 'Password is wrong'});
            return;
        }
        res.send({message: 'Username and password is correct', user});
    } catch (error) {
        if (error instanceof Error.ValidationError) {
            res.status(400).send(error);
        }
        next(error);
    }
});

usersRouter.delete('/sessions', auth, async (req, res, next) => {
    let reqWithAuth = req as RequestWithUser;
    const userFromAuth = reqWithAuth.user;

    if (!userFromAuth){
        res.status(401).send({error: 'Token not provided!'});
        return;
    }

    try {
        const user = await User.findOne({_id: userFromAuth._id});
        if (user) {
            user.generateToken();
            await user.save();
            res.send({message: 'Success logout'})
        }
    } catch (e){
        next(e);
    }
});

export default usersRouter;