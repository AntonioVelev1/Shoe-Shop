const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types;

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: [4, 'Name should be at least 4 characters']
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    size: {
        type: Number,
        required: true,
        min: 35,
        max: 45
    },
    imageUrl: {
        String,
        required: true
    },
    description: {
        String,
    },
    userId: {
        type: ObjectId,
        ref: 'User'
    }
}, { timestamps: {createdAt: 'created_at' } });

module.exports = mongoose.model('product', productSchema);