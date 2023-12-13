import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

export const connectDB = async () => {
    try {
        await mongoose.connect(
            "mongodb+srv://zxfabyxz:Asteroide15@cluster0.kpxierz.mongodb.net/?retryWrites=true&w=majority"
            //process.env.MONGODB_URI
        )
        console.log("Database successfully connected")
    } catch {
        console.log("Error connecting the database: ", error.message)
    }
}