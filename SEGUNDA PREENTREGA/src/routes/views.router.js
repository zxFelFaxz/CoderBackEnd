import { Router } from "express";
import { noSessionMiddleware, sessionMiddleware } from "../middleware/sessionsViews.middleware.js";
import { ProductsService } from "../services/products.service.js";
import { CartsService } from "../services/carts.service.js";

const router = Router();

// Products on home page (Redirect to login if no active session)
router.get("/", noSessionMiddleware, async (req, res) => {
    try {
        const productsNoFilter = await ProductsService.getProductsNoFilter();
        res.render("home", { productsNoFilter, user: req.user, title: "title" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Products in real-time products page
router.get("/realtimeproducts", noSessionMiddleware, async (req, res) => {
    try {
        res.render("realTimeProducts", { user: req.user, title: "Menu" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// All products
router.get("/products", noSessionMiddleware, async (req, res) => {
    try {
        const { limit = 8, page = 1, sort, category, stock } = req.query;

        const query = {};
        const options = {
            limit,
            page,
            sort,
            lean: true
        };

        // Filter by category
        if (category) {
            query.category = category;
        }

        // Filter by stock
        if (stock) {
            query.stock = stock === "false" || stock == 0 ? 0 : stock;
        }

        // Sort by price
        if (sort) {
            if (sort === "asc") {
                options.sort = { price: 1 };
            } else if (sort === "desc") {
                options.sort = { price: -1 };
            }
        }

        const products = await ProductsService.getProducts(query, options);
        const baseUrl = req.protocol + "://" + req.get("host") + req.originalUrl;

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
            nextLink: products.hasNextPage ? (baseUrl.includes("page") ? baseUrl.replace(`page=${products.page}`, `page=${products.nextPage}`) : baseUrl.concat(`?page=${products.nextPage}`)) : null,
            title: "Menu"
        };
        res.render("productsPaginate", { dataProducts, user: req.user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Product detail
router.get("/products/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await ProductsService.getProductById(pid);

        product.title = product.title.toUpperCase();

        res.render("productDetail", { product, user: req.user, title: `${product.title} ` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Cart
router.get("/carts/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await CartsService.getCartById(cid);

        const totalPrice = cart.products.reduce((acc, prod) => acc + prod.quantity * prod.product.price, 0);

        res.render("cart", { cart, totalPrice, user: req.user, title: "Cart" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Signup
router.get("/signup", sessionMiddleware, async (req, res) => {
    try {
        res.render("signup", { title: "Sign Up" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login
router.get("/login", sessionMiddleware, async (req, res) => {
    try {
        res.render("login", { title: "Login" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Profile
router.get("/profile", noSessionMiddleware, async (req, res) => {
    try {
        res.render("profile", { user: req.user, title: "Profile" });
    } catch (error) {
        res.status(500).json({ error: "Error fetching profile" });
    }
});

export { router as viewsRouter };