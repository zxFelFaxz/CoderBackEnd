import { Router } from "express";
import { productManager } from "../dao/index.js";
import { cartManager } from "../dao/index.js";

const router = Router();

// Home page with products
router.get("/", async (req, res) => {
    try {
        const productsNoFilter = await productManager.getProductsNoFilter();
        res.render("home", { productsNoFilter, title: "Something" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Real-time products page
router.get("/realtimeproducts", async (req, res) => {
    try {
        res.render("realTimeProducts", { title: "Menu" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// All products page with pagination
router.get("/products", async (req, res) => {
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

        res.render("productsPaginate", dataProducts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Product detail page
router.get("/products/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productManager.getProductById(pid);

        product.title = product.title.toUpperCase();

        res.render("productDetail", { product, title: `${product.title} - something` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Cart page
router.get("/carts/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.getCartById(cid);
        res.render("cart", { cart, title: "Cart" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export { router as viewsRouter };