const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ['Frontend', 'Backend', 'Database', 'Tools', 'Languages'],
      required: true,
    },
    proficiency: { type: Number, min: 0, max: 100, required: true },
    icon: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Skill', skillSchema);
