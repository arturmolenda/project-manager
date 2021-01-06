import mongoose from 'mongoose';

const emailSecretSchema = mongoose.Schema(
  {
    email: { type: String, required: true },
    code: { type: mongoose.Types.ObjectId, required: true },
    dateCreated: { type: Date, default: Date.now(), expires: 1800 },
  },
  { timestamps: true }
);

export default mongoose.model('EmailSecret', emailSecretSchema);
