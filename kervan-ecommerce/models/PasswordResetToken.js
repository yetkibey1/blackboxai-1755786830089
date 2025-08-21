const mongoose = require('mongoose');
const crypto = require('crypto');

const passwordResetTokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  used: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Generate secure random token
passwordResetTokenSchema.statics.generateToken = function() {
  return crypto.randomBytes(32).toString('hex');
};

// Create new password reset token
passwordResetTokenSchema.statics.createToken = async function(userId) {
  const token = this.generateToken();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
  
  return this.create({
    user: userId,
    token,
    expiresAt
  });
};

// Find valid token
passwordResetTokenSchema.statics.findValidToken = async function(token) {
  return this.findOne({
    token,
    expiresAt: { $gt: new Date() },
    used: false
  }).populate('user');
};

// Mark token as used
passwordResetTokenSchema.methods.markAsUsed = async function() {
  this.used = true;
  return this.save();
};

// Clean up expired tokens
passwordResetTokenSchema.statics.cleanupExpiredTokens = async function() {
  return this.deleteMany({
    $or: [
      { expiresAt: { $lt: new Date() } },
      { used: true }
    ]
  });
};

module.exports = mongoose.model('PasswordResetToken', passwordResetTokenSchema);
