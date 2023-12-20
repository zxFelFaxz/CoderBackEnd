import { Router } from "express";
import { uploader } from "../utils.js";
import { productManager } from "../dao/index.js";

const router = Router();

// Get all products
router.get("/", async (req, res) => {
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
        };

        res.status(201).json({ data: dataProducts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a product by ID
router.get("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productManager.getProductById(pid);
        
        res.status(201).json({ data: product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a product
router.post("/", uploader.single("thumbnail"), async (req, res) => {
    try {
        const productInfo = req.body;
        const thumbnailFile = req.file ? req.file.filename : undefined;

        productInfo.thumbnail = thumbnailFile;

        const addedProduct = await productManager.addProduct(productInfo);
        res.status(201).json({ data: addedProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a product
router.put("/:pid", uploader.single("thumbnail"), async (req, res) => {
    try {
        const { pid } = req.params;
        const updateFields = req.body;
        const thumbnailFile = req.file ? req.file.filename : undefined;

        updateFields.thumbnail = thumbnailFile;

        const updatedProduct = await productManager.updateProduct(pid, updateFields);
        res.status(201).json({ data: updatedProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a product
router.delete("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const deletedProduct = await productManager.deleteProduct(pid);
        res.status(200).json({ data: deletedProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export { router as productsRouter };