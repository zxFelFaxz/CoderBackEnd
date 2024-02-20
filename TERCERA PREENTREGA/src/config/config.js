import dotenv from "dotenv";
import { Command } from "commander"
import path from "path"
import { __dirname } from "../utils.js"

const program = new Command()

program
.option("--mode <mode>", "working environment", "development")

program.parse()
const args = program.opts()

const envMode = args.mode

const pathEnv = envMode === "production" ? path.join(__dirname, "../.env.production") : path.join(__dirname, "../.env.development")

dotenv.config({
    path: pathEnv
})

export const config = {
    server: {
        envMode: envMode,
        port: process.env.PORT,
        secretSession: process.env.SECRET_SESSION,
    },
    mongo: {
        url: process.env.MONGO_URL
    },
    github: {
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackUrl: process.env.GITHUB_CALLBACK_URL,
    },
    adminInfo: {
        adminEmail: process.env.ADMIN_EMAIL,
        adminPassword: process.env.ADMIN_PASSWORD
    }
};