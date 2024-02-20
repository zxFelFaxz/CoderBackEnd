import mongoose from "mongoose"
import { config } from "./config.js"
import { logger } from "../helpers/logger.js"

export class ConnectDB {
    static #instance

    static #connectMongo() {
        const connection = mongoose.connect(config.mongo.url)
        logger.info("Database successfully connected")
        return connection
    }
    static getInstance() {
        if(this.#instance) {
            logger.info("Database already connected")
            return this.#instance
        } else {
            this.#instance = this.#connectMongo()
            return this.#instance
        }
    }
}