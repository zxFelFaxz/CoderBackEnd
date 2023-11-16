import { Router} from "express"
import { uploader } from "../utils.js"
import { productManager } from "../persistence/index.js"

const router = Router()

router.get("/", async (req, res) => {
    try {
        const products = await productManager.getProducts()
        res.render("home", { products })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.get("/realtimeproducts", async (req, res) => {
    try {
        res.render("realTimeProducts")
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Upload images
router.post("/realtimeproducts", uploader.single("thumbnail"), (req, res) => {    
    res.render("realTimeProducts")
})

export { router as viewsRouter }