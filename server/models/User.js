const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre('save', async function (next) {
  // Check if the password has been modified
  if (!this.isModified('password')) return next();

  // Hash password with strength of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Remove the password confirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.comparePasswords = async function (
  candidatePassword,
  hashedPassword
) {
  return await bcrypt.compare(candidatePassword, hashedPassword);
};

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
// module.exports = mongoose.model("user", userSchema);
