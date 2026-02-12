const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    image: mongoose.Schema.Types.Mixed,  // Can be Buffer or String (URL)
    imageType: {
        type: String,
        enum: ['upload', 'url'],
        default: 'upload'
    },
    name: String,
    price: Number,
    discount:{
        type:Number,
        default:0
    },
    bgcolor: String,
    panecolor: String,
    textcolor: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Product', productSchema);