import mongoose from "mongoose"
import { CartsService } from "../../../services/carts.service.js"

const usersCollection = "users"

const userSchema = new mongoose.Schema({
    full_name: {
        type: String
    },
    first_name: {
        type: String,
        required: function() {
            return !this.github_user
        }
    },
    last_name: {
        type: String,
        required: function() {
            return !this.github_user
        }
    },
    email: {
        type: String,
        unique: [true, "The entered email already has an account"],
        required: function() {
            return !this.github_user
        }
    },
    age: {
        type: Number,
        required: function() {
            return !this.github_user
        }
    },
    password: {
        type: String,
        required: function() {
            return !this.github_user
        }
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts"
    },
    github_user: {
        type: Boolean,
        default: false
    },
    github_name: {
        type: String
    },
    github_username: {
        type: String,
        unique: [true, "The logged in GitHub user is already registered."]
    }
})

// Assign cart to new user
userSchema.pre("save", async function(next) {
    try {
        const newCartUser = await CartsService.createCart()
        this.cart = newCartUser._id
    } catch (error) {
        next(error)
    }
})

export const usersModel = mongoose.model(usersCollection, userSchema)