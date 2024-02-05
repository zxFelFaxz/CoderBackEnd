import mongoose from "mongoose"

const ticketsCollection = "tickets"

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, "The code is mandatory"],
        unique: [true, "The code already exists"]
    },
    purchase_datetime: {
        type: String,
        default: Date.now
    },
    amount: {
        type: Number,
        required: [true, "The total purchase price is mandatory"]
    },
    purchaser: {
        type: String,
        required: [true, "Buyer's details are mandatory"]
    },
    purchase_products: {
        type: Object,
        required: [true, "There must be products to buy"]
    }
})

export const ticketsModel = mongoose.model(ticketsCollection, ticketSchema)