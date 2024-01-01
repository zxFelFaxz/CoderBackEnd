import { Router } from "express";
import { productManager, cartManager } from "../dao/index.js";

const router = Router();

// If there is no active session
const noSessionMiddleware = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/login");
    }
    next();
};

// If there is an active session
const sessionMiddleware = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect("/profile");
    }
    next();
};

// Products on the home page (Redirect to login if there is no active session)
router.get("/", noSessionMiddleware, async (req, res) => {
    try {
        const productsNoFilter = await productManager.getProductsNoFilter();
        res.render("home", { productsNoFilter, title: "title" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Real-time products
router.get("/realtimeproducts", async (req, res) => {
    try {
        res.render("realTimeProducts", { title: "Menu" });
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
            lean: true,
        };

        // Filter by category
        if (category) {
            query.category = category;
        }

        // Filter by stock
        if (stock) {
            if (stock === "false" || stock == 0) {
                query.stock = 0;
            } else {
                query.stock = stock;
            }
        }

        // Sort by price
        if (sort) {
            if (sort === "asc") {
                options.sort = { price: 1 };
            } else if (sort === "desc") {
                options.sort = { price: -1 };
            }
        }

        const products = await productManager.getProducts(query, options);

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
            nextLink: products.hasNextPage ? baseUrl.includes("page") ? baseUrl.replace(`page=${products.page}`, `page=${products.nextPage}`) : baseUrl.concat(`?page=${products.nextPage}`) : null,
            title: "Menu",
        };

        res.render("productsPaginate", {
            dataProducts,
            userFirstName: req.user?.first_name,
            userLastName: req.user?.last_name,
            userRole: req.user?.role,
            userGitHubName: req.user?.githubName,
            userGitHubUsername: req.user?.githubUsername,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Product detail
router.get("/products/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productManager.getProductById(pid);

        product.title = product.title.toUpperCase();

        res.render("productDetail", { product, title: `${product.title}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Cart
router.get("/carts/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.getCartById(cid);
        res.render("cart", { cart, title: "Cart" });
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
        res.render("login", { title: "Log In" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Profile
router.get("/profile", noSessionMiddleware, async (req, res) => {
    try {
        res.render("profile", {
            userFirstName: req.user?.first_name,
            userLastName: req.user?.last_name,
            userEmail: req.user?.email,
            userAge: req.user?.age,
            userRole: req.user?.role,
            userGitHubName: req.user?.githubName,
            userGitHubUsername: req.user?.githubUsername,
            title: "Profile",
        });
    } catch (error) {
        res.status(500).json({ error: "Error getting the profile" });
    }
});

export { router as viewsRouter };