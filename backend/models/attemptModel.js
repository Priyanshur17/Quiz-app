import mongoose, { Schema } from 'mongoose';

const attemptSchema = new mongoose.Schema({
    quizId: { type: Schema.Types.ObjectId, ref: "Quiz" },
    playerId: { type: Schema.Types.ObjectId, ref: "User" },
    questions: [{
        questionId: { type: Schema.Types.ObjectId, ref: "Question" },
        answers: [{ type: Number }],
        isCorrect: { type: String, default: "false" },
        score: { type: Number, default: 0 } 
    }],
    totalScore: { type: Number, default: 0 },
    feedbackId: { type: Schema.Types.ObjectId, ref: "Feedback" },
}, {
    timestamps: true
});

const Attempt = mongoose.model("Attempt", attemptSchema);

export default Attempt;