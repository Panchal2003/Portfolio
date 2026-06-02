const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    title: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    location: { type: String },
    bio: { type: String },
    profileImage: { type: String },
    socialLinks: {
      github: { type: String },
      linkedin: { type: String },
      twitter: { type: String },
      instagram: { type: String },
    },
    resumeUrl: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);
