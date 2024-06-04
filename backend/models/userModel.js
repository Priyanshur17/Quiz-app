import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    password: { type: String, required: true, trim: true },
    isVerified: { type: Boolean, default: false },
}, {
    timestamps: true,
});

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
        next();
    }
    try {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        this.password = await bcrypt.hash(this.password, salt);
    } 
    catch (error) {
        console.log(error);
    }
});

userSchema.pre('findOneAndUpdate', async function(next) {
    if (this._update.password !== undefined) {
        try {
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            this._update.password = await bcrypt.hash(this._update.password, salt);
        } catch (error) {
            console.log(error);
        }
    }
    next();
});

const User = mongoose.model('User', userSchema);

export default User;