import mongoose from "mongoose"
import { config } from "./config.js"


export class ConnectDB {
    static #instance

    static #connectMongo() {
        const connection = mongoose.connect(config.mongo.url)
        console.log("Database successfully connected")
        return connection
    }
    static getInstance() {
        if(this.#instance) {
            console.log("Database already connected")
            return this.#instance
        } else {
            this.#instance = this.#connectMongo()
            return this.#instance
        }
    }
}