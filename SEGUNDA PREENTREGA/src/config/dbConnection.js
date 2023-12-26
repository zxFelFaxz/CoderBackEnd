import mongoose from "mongoose"
import dotenv from "dotenv"
import { config } from "./config.js"

dotenv.config()

export const connectDB = async () => {
    try {
        await mongoose.connect(config.mongo.url,{           
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        )
        console.log("Database successfully connected")
    } catch {
        console.log("Error connecting the database: ", error.message)
    }
}