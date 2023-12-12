import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Database successfully connected")
    } catch {
        console.log("Error connecting the database: ", error.message)
    }
}