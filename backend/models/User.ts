import mongoose, {HydratedDocument, Model} from 'mongoose';
import bcrypt from 'bcrypt';
import {randomUUID} from "node:crypto";

interface UserFields {
    username: string;
    password: string;
    token: string;
    displayName: string;
}

type UserModel = Model<UserFields, {}, UserMethods>;

interface UserMethods {
    checkPassword(password: string): Promise<boolean>;
    generateToken(): void;
}

const Schema = mongoose.Schema;

const SALT_WORK_FACTOR = 10;

const UserSchema = new Schema<HydratedDocument<UserFields>, UserModel, UserMethods>({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        validate: {
            validator: async function (this: HydratedDocument<UserFields>, username: string): Promise<boolean> {
                if (!this.isModified('username')) return true;
                const user: UserFields | null = await User.findOne({username});
                return !user;
            },
            message: 'This user is already registered',
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    token: {
        type: String,
        required: [true, 'Token is required'],
    },
    displayName: String
});

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.checkPassword = function (password: string) {
    return bcrypt.compare(password, this.password);
};
UserSchema.methods.generateToken = function () {
    this.token = randomUUID();
};

UserSchema.set('toJSON', {
    transform: (_doc, ret) => {
        delete ret.password;
        return ret;
    }
});

const User = mongoose.model('User', UserSchema);
export default User;