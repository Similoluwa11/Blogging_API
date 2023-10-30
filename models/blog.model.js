const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {type: String,
    required: true,
    unique: true
},
  description: String,
  tags: [String],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  timestamp: { type: Date, default: Date.now },
  state: { type: String, enum: ['draft', 'published'], default: 'draft' },
  read_count: { type: Number, default: 0 },
  reading_time: Number,
  body: {type: String, required: true}
});

const BlogModel = mongoose.model('blogs', blogSchema);

module.exports = BlogModel;
