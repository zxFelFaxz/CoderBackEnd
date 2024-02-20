import express from "express"
import { engine } from "express-handlebars"
import session from "express-session"
import cors from "cors"
import MongoStore from "connect-mongo"
import { ConnectDB } from "./config/dbConnection.js"
import passport from "passport"
import { initializePassport } from "./config/passport.js"
import { config } from "./config/config.js"
import { Server } from "socket.io"
import path from "path"
import { __dirname } from "./utils.js"
import { ProductsService } from "./services/products.service.js"
import { viewsRouter } from "./routes/views.router.js"
import { sessionsRouter } from "./routes/sessions.router.js"
import { productsRouter } from "./routes/products.router.js"
import { cartsRouter } from "./routes/carts.router.js"
import { errorHandler } from "./middleware/errorHandler.js"
import { logger } from "./helpers/logger.js"

const port = config.server.port
const app = express()

const httpServer = app.listen(port, () => {
    console.log("Server running on port: ", port)
})

const socketServer = new Server(httpServer)

// Database connection
ConnectDB.getInstance()

// Configuration handlebars
app.engine(".hbs", engine({ extname: ".hbs" }))
app.set("view engine", ".hbs")
app.set("views", path.join(__dirname, "/views"))

// Session configuration
app.use(session ({
    store: MongoStore.create ({
        ttl: 10800000,
        mongoUrl: config.mongo.url
    }),
    secret: "Asteroide15",
    resave: true,
    saveUninitialized: true
}))

// Passport configuration
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

// Socket.io configuration
socketServer.on("connection", async (socket) => {
    logger.info("Client logged in: ", socket.id)

    // Get products
    const products = await ProductsService.getProductsNoFilter()
    socket.emit("productsArray", products)

    // Add customer socket product
    socket.on("addProduct", async (productInfo) => {
        try {
            const result = await ProductsService.addProduct(productInfo)
            const products = await ProductsService.getProductsNoFilter()
            socketServer.emit("productsArray", products)
        } catch (error) {
            logger.error(error)
        }
    })

    // Delete the product from the client socket
    socket.on("deleteProduct", async (productId) => {
        try {
            const result = await ProductsService.deleteProduct(productId)
            const products = await ProductsService.getProductsNoFilter()
            socketServer.emit("productsArray", products)
        } catch (error) {
            logger.error(error)
        }
    })
})

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "/public")))
app.use(cors())

// Rutas
app.use("/", viewsRouter)
app.use("/api/sessions", sessionsRouter)
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use(errorHandler)