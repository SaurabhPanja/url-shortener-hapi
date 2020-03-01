const mongoose = require('mongoose');
const shortId = require('shortid')

let shortUrlSchema = new mongoose.Schema({
    fullUrl: {
        type: String,
        required: true,
    },
    shortUrl: {
        type: String,
        default: shortId.generate
    },
    count: {
        type: Number,
        default: 0,
    }
});

let ShortUrl = mongoose.model('ShortUrl', shortUrlSchema);

module.exports = ShortUrl