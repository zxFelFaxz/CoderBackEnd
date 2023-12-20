import express from "express"
import { engine } from "express-handlebars"
import session from "express-session"
import MongoStore from "connect-mongo"
import { Server } from "socket.io"
import dotenv from "dotenv"
import path from "path"
import { __dirname } from "./utils.js"
import { connectDB } from "./config/dbConnection.js"
import { productManager } from "./dao/index.js"
import { viewsRouter } from "./routes/views.router.js"
import { sessionsRouter } from "./routes/sessions.router.js"
import { productsRouter } from "./routes/products.router.js"
import { cartsRouter } from "./routes/carts.router.js"

dotenv.config()

const port = process.env.PORT || 8080
const app = express()

const httpServer = app.listen(port, () => {
    console.log("Server running on the port: ", port)
})

const socketServer = new Server(httpServer)

// Database connection
connectDB()

// Config handlebars
app.engine(".hbs", engine({extname: ".hbs"}))
app.set("view engine", ".hbs")
app.set("views", path.join(__dirname, "/views"))

//Session configuration
app.use(session ({
    store: MongoStore.create ({
        mongoUrl: "mongodb+srv://zxfabyxz:Asteroide15@cluster0.kpxierz.mongodb.net/?retryWrites=true&w=majority",
        ttl: 3000,
    }),
    secret: "Asteroide15",
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,}
}))

// Config socket.io
socketServer.on("connection", async (socket) => {
    console.log("Client logged in: ", socket.id)

    // Obtain products
    const products = await productManager.getProductsNoFilter()
    socket.emit("productsArray", products)

    // Add customer socket product
    socket.on("addProduct", async (productsData) => {
        try {
            const result = await productManager.addProduct(productsData)
            const products = await productManager.getProductsNoFilter()
            socketServer.emit("productsArray", products)
        } catch (error) {
            console.error(error.message)
        }
    })

    // Remove the product from the client socket
    socket.on("deleteProduct", async (productId) => {
        try {
            const result = await productManager.deleteProduct(productId)
            const products = await productManager.getProducts()
            socketServer.emit("productsArray", products)
        } catch (error) {
            console.error(error.message)
        }
    })
})

// Middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, "/public")))

// Rutas
app.use("/", viewsRouter)
app.use("/api/sessions", sessionsRouter)
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)