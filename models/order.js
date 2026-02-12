const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    totalMRP: Number,
    totalDiscount: Number,
    platformFee: Number,
    shippingFee: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    shippingAddress: String,
    paymentMethod: {
        type: String,
        enum: ['cod', 'card', 'wallet'],
        default: 'cod'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    deliveryDate: Date
});

module.exports = mongoose.model('order', orderSchema);
