import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsCollection = "products";

const productSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    
    title: {
        type: String,
        required: [true, "The title is mandatory"],
    },
    description: {
        type: Array,
        required: [true, "The description is mandatory"],
    },
    code: {
        type: String,
        required: [true, "The code is mandatory"],
        unique: [true, "The entered code already exists"],
    },
    price: {
        type: Number,
        required: [true, "The price is mandatory"],
        min: [0, "The price must be greater than or equal to 0"],
    },
    stock: {
        type: Number,
        required: [true, "The stock is mandatory"],
        min: [0, "The stock must be greater than or equal to 0"],
    },
    category: {
        type: String,
        required: [true, "The category is mandatory"],
        enum: {
            values: ["vegan", "vegetarian"],
            message: "The category must be 'vegan' or 'vegetarian'",
        },
    },
    thumbnail: {
        type: String,
    },
});

productSchema.plugin(mongoosePaginate);

export const productsModel = mongoose.model(productsCollection, productSchema);