import express from "express"
import { engine } from "express-handlebars"
import { Server } from "socket.io"
import path from "path"
import { __dirname } from "./utils.js"
import { viewsRouter } from "./routes/views.routes.js"
import { productsRouter } from "./routes/products.routes.js"
import { cartsRouter } from "./routes/carts.routes.js"
import { productManager } from "./persistence/index.js"

const port = 8080
const app = express()

const httpServer = app.listen(port, () => {
    console.log("Server running on port: ", port)
})

const socketServer = new Server(httpServer)

// Configuration handlebars
app.engine(".hbs", engine({extname: ".hbs"}))
app.set("view engine", ".hbs")
app.set("views", path.join(__dirname, "/views"))

// Configuration socket.io
socketServer.on("connection", async (socket) => {
    console.log("Cliente conectado: ", socket.id)

    // Get products
    const products = await productManager.getProducts()
    socket.emit("productsArray", products)

    // Add the product from the client socket
    socket.on("addProduct", async (productsData) => {
        try {
            const result = await productManager.addProduct(productsData)
            const products = await productManager.getProducts()
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
app.use(express.static(path.join(__dirname, "/public")))

// Routes
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use("/", viewsRouter)