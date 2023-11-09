import { Router } from "express"
import { cartManager, productManager } from "../persistence/index.js"

const router = Router()

// Create a cart (POST: http://localhost:8080/api/carts)
router.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.createCart()
        res.status(201).json({ data: newCart, message: "Cart created" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Get a cart by ID (GET: http://localhost:8080/api/carts/1)
router.get("/:cid", async (req, res) => {
    try {
        const cid = parseInt(req.params.cid)
        const cart = await cartManager.getCartById(cid)

        if (cart) {
            res.status(200).json({ data: cart })
        } else {
            res.status(404).json({ error: error.message })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Add a product to a cart (POST: http://localhost:8080/api/carts/1/product/1)
router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const cid = parseInt(req.params.cid)
        const pid = parseInt(req.params.pid)
        const quantity = parseInt(req.body.quantity || 1)
        
        await cartManager.addProductToCart(cid, pid, quantity)
        res.status(200).json({ message: `${quantity} of this product added to your cart` })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

export { router as cartsRouter }