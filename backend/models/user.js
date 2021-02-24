import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profilePicture: { type: String, required: false, default: null },
    password: { type: String, required: true, minlength: 6 },
    emailConfirmed: { type: Boolean, required: true, default: false },
    emailCode: { type: mongoose.Types.ObjectId, required: true },
    projectsThemes: { type: Object, required: false, default: {} },
    projectsJoined: [
      { type: mongoose.Types.ObjectId, required: false, ref: 'Project' },
    ],
    projectsCreated: [
      { type: mongoose.Types.ObjectId, required: false, ref: 'Project' },
    ],
  },
  { timestamps: true, minimize: false }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export default mongoose.model('User', userSchema);
