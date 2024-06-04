import mongoose, { Schema } from 'mongoose';

const quizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User" },
    questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
    duration: { type: Number, default: 180 }, // Duration in minutes
    isLocked: { type: Boolean, default: false },
}, {
    timestamps: true
});

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;