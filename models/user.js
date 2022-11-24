import mongoose from 'mongoose';
import validator from 'validator';
import connections from './connections.js';

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        validate: [validator.isEmail, "Please enter a email"],
        unique: {
            args: true,
            msg: 'Email address already in use!'
        }
    },
    phone: {
        type: String,
        required: [true, "Please enter your Phone Number"],
        validate: [validator.isMobilePhone, "Please enter a phone"],
        unique: {
            args: true,
            msg: 'phone already in use!'
        }
    },
    password: String,
    confirmPassword:String,
    photourl: String,
    username: {
        type: String,
        unique: {
            args: true,
            msg: 'Username already in use!'
        }
    },
    connections: [connections],
    followers: Number,
});

userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcryptjs.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('Incorrect password');
    }
    throw Error("Incorrect email");
};

export default mongoose.model('User', userSchema);