const { Schema, model } = require("mongoose");

const announcementSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: 'title is required'
    },
    content: {
        type: String,
        trim: true,
        required: 'content is required'
    },
    receipient: [{
        type: Schema.ObjectId, ref: 'Group',
        required: 'recipient is required'
    }],
    verification: {
        type: Schema.ObjectId, ref: 'User',
    }
}, { timestamps: true })

module.exports = model('Announcement', announcementSchema)