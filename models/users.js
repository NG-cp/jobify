import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        minlength: 3,
        maxlength: 20,
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        validate: {
            validator: validator.isEmail,
            message: 'Please provide a valid email',
        },
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        trim: true,
        minlength: 6,
        select: false,
    },
    lastName: {
        type: String,
        maxlength: 20,
        trim: true,
        default: 'lastName',
    },
    location: {
        type: String,
        maxlength: 20,
        trim: true,
        default: 'my city',
    },
});

userSchema.pre("save", async function() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

userSchema.methods.createJWT = function() {
    return jwt.sign({userId:this._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME});
}

export default mongoose.model('users', userSchema);