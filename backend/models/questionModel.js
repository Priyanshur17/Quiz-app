import mongoose, { Schema } from "mongoose";

const questionSchema = new mongoose.Schema({
    quizId: { type: Schema.Types.ObjectId, ref: "Quiz" },
    authorId: { type: Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    options: [{ type: String, required: true }],
    answers: [{ type: Number, required: true }],
}, {
    timestamps: true
});

const Question = mongoose.model("Question", questionSchema);

export default Question;