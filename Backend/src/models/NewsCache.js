const mongoose = require('mongoose');

const NewsCacheSchema = new mongoose.Schema({
  key: { type: String, unique: true },
  data: Object,
  timestamp: { type: Date, default: Date.now },
});

// Optional: TTL index to auto-remove old cache after 1 day
// NewsCacheSchema.index({ timestamp: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model('NewsCache', NewsCacheSchema); 