import { Router} from "express"
import { noSessionMiddleware, sessionMiddleware, checkRoleMiddleware } from "../middleware/auth.js"
import { ProductsService } from "../services/products.service.js"
import { CartsService } from "../services/carts.service.js"
import { GetUserInfoDto } from "../dao/dto/getUserInfo.dto.js"

const router = Router()

// Products in home (If there is no active session redirect to login)
router.get("/", noSessionMiddleware, async (req, res) => {
    try {
        const productsNoFilter = await ProductsService.getProductsNoFilter()
        
        const userInfoDto = new GetUserInfoDto(req.user)
        res.render("home", { productsNoFilter, userInfoDto, title: "No Title" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Real time products
router.get("/realtimeproducts", noSessionMiddleware, checkRoleMiddleware(["admin"]), async (req, res) => {
    try {
        res.render("realTimeProducts", { title: "Menu" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// All products
router.get("/products", noSessionMiddleware, async (req, res) => {
    try {
        const { limit = 8, page = 1, sort, category, stock } = req.query

        const query = {}

        const options = {
            limit,
            page,
            sort,
            lean: true
        }

        // Filter by category
        if (category) {
            query.category = category
        }

        // Filter by stock
        if (stock) {
            if (stock === "false" || stock == 0) {
                query.stock = 0
            } else {
                query.stock = stock
            }
        }

        // Order by price
        if (sort) {
            if (sort === "asc") {
                options.sort = { price: 1 }
            } else if (sort === "desc") {
                options.sort = { price: -1 }
            }
        }

        const products = await ProductsService.getProducts(query, options)

        const baseUrl = req.protocol + "://" + req.get("host") + req.originalUrl
        
        const dataProducts = {
            status: "success",
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `${baseUrl.replace(`page=${products.page}`, `page=${products.prevPage}`)}` : null,
            nextLink: products.hasNextPage ? baseUrl.includes("page") ? baseUrl.replace(`page=${products.page}`, `page=${products.nextPage}`) : baseUrl.concat(`?page=${products.nextPage}`) : null,
            title: "Menu"
        }

        const userInfoDto = new GetUserInfoDto(req.user)
        res.render("productsPaginate", { dataProducts, userInfoDto })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Product detail
router.get("/products/:pid", noSessionMiddleware, async (req, res) => {
    try {
        const { pid } = req.params
        const product = await ProductsService.getProductById(pid)

        product.title = product.title.toUpperCase()
        
        const userInfoDto = new GetUserInfoDto(req.user)
        res.render("productDetail", { product, userInfoDto, title: `${product.title} ` })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Cart
router.get("/carts/:cid", noSessionMiddleware, checkRoleMiddleware(["user"]), async (req, res) => {
    try {
        const { cid } = req.params
        const cart = await CartsService.getCartById(cid)

        // Total
        const totalPrice = cart.products.reduce((acc, prod) => acc + prod.quantity * prod.product.price, 0)

        // Subtotal
        cart.products.forEach((prod) => {
            prod.subtotalPrice = prod.quantity * prod.product.price
        })

        const userInfoDto = new GetUserInfoDto(req.user)
        res.render("cart", { cart, totalPrice, userInfoDto, title: "Cart" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Signup
router.get("/signup", sessionMiddleware, async (req, res) => {
    try {
        res.render("signup", { title: "Register" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Login
router.get("/login", sessionMiddleware, async (req, res) => {
    try {
        res.render("login", { title: "Log in" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Profile
router.get("/profile", noSessionMiddleware, async (req, res) => {
    try {
        const userInfoDto = new GetUserInfoDto(req.user)
        res.render("profile", { userInfoDto, title: "Profile" })   
    } catch (error) {
        res.status(500).json({ error: "Error getting profile" })
    }
})

export { router as viewsRouter }