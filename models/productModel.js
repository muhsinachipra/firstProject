const mongoose = require('mongoose')


const productSchema = mongoose.Schema({

    productName: {
        type: String,
        required: true
    },
    productDescription: {
        type: String,
        required: true
    },
    productBrand: {
        type: String,
        required: true
    },
    productCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    productStock: {
        type: Number,
        required: true
    },
    productPrice: {
        type: Number,
        required: true
    },
    productImage: {
        type: Array,
        required: true,
    },
    isListed: {
        type: Boolean,
        default: true
    },
    productOfferPercentage: {
        type: Number,
        default: 0,
    },
    discountedPrice: {
        type: Number,
        default: 0,
    },
});

// Define a pre-save middleware to calculate the discountedPrice
productSchema.pre(['save', 'updateOne', 'updateMany'], async function (next) {
    try {
        // Fetch the corresponding category
        
        const Category = mongoose.model('Category');
        const category = await Category.findById(this.productCategory);
        console.log('in PRODUCT model ', category)

        // Calculate the discounted price based on the higher percentage
        const highestPercentage = Math.max(
            category.categoryOfferPercentage,
            this.productOfferPercentage
        );

        // Apply the discount to the product price
        const discountMultiplier = 1 - highestPercentage / 100;
        this.discountedPrice = this.productPrice * discountMultiplier;

        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Product', productSchema);