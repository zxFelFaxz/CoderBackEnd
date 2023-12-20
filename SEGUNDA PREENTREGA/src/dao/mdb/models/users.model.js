import mongoose from "mongoose"

const usersCollection = "users"

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: [true, "The name is mandatory"]
    },
    last_name: {
        type: String,
        required: [true, "The surname is compulsory"]
    },
    email: {
        type: String,
        required: [true, "The email is compulsory"],
        unique: [true, "The entered email address is already registered"]
    },
    age: {
        type: Number,
        required: [true, "Age is mandatory"]
    },
    password: {
        type: String,
        required: [true, "Password is mandatory"]
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
})

export const usersModel = mongoose.model(usersCollection, userSchema)