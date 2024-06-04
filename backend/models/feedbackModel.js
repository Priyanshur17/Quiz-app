import mongoose, { Schema } from 'mongoose';

const feedbackSchema = new mongoose.Schema({
    attemptId: { type: Schema.Types.ObjectId, ref: "Attempt" },
    rating: { type: Number, required: true },
    message: { type: String, default: "" }
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;