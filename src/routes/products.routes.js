import { Router} from "express"
import { productManager } from "../persistence/index.js"

const router = Router()

// Get product list (GET: http://localhost:8080/api/products || http://localhost:8080/api/products?limit=2)
router.get("/", async (req, res) => {
    try {
        const limit = req.query.limit
        const products = await productManager.getProducts()

        if (limit) {
            const productsLimit = products.slice(0, parseInt(limit))
            res.status(200).json({ data: productsLimit })
        } else {
            res.status(200).json({ data: products })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Get a product by its ID (GET: http://localhost:8080/api/products/1)
router.get("/:pid", async (req, res) => {
    try {
        const pid = parseInt(req.params.pid)
        const product = await productManager.getProductById(pid)
        
        if (product) {
            res.status(200).json({ data: product })
        } else {
            res.status(404).json({ error: error.message })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Add a new product (POST: http://localhost:8080/api/products)
router.post("/", async (req, res) => {
    try {
        const productInfo = req.body

        await productManager.addProduct(productInfo)
        res.status(201).json({ message: "Producto agregado" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Update a product by its ID (PUT: http://localhost:8080/api/products/1)
router.put("/:pid", async (req, res) => {
    try {
        const pid = parseInt(req.params.pid)
        const updateFields = req.body

        await productManager.updateProduct(pid, updateFields)
        res.status(200).json({ message: `Producto con ID ${pid} actualizado` })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Delete a product by its ID (DELETE: http://localhost:8080/api/products/2)
router.delete("/:pid", async (req, res) => {
    try {
        const pid = parseInt(req.params.pid)
        
        await productManager.deleteProduct(pid)
        res.status(200).json({ message: `Producto con ID ${pid} eliminado` })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

export { router as productsRouter }