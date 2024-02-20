import { productsModel } from "../models/products.model.js";
import { logger } from "../../../helpers/logger.js";

export class ProductManagerMDB {
    constructor() {
        this.model = productsModel;
    }

    // Get all products without filters (home)
    async getProductsNoFilter() {
        try {
            const result = await this.model.find().lean();
            return result;
        } catch (error) {
            logger.error("get products no filter: Error getting products");
            throw new Error("Error retrieving products");
        }
    }

    // Get all products with filters and pagination (products paginate)
    async getProducts(query, options) {
        try {
            const result = await this.model.paginate(query, options);
            return result;
        } catch (error) {
            logger.error("get products: Error retrieving products");
            throw new Error("Error retrieving products");
        }
    }

    // Get a product by ID
    async getProductById(productId) {
        try {
            const result = await this.model.findById(productId).lean();

            if (!result) {
                throw new Error("Product not found");
            }

            return result;
        } catch (error) {
            logger.error("get product by id: Error getting the product");
            throw new Error("Error retrieving the product");
        }
    }

    // Add a product
    async addProduct(productInfo) {
        try {
            const result = await this.model.create(productInfo);
            return result;
        } catch (error) {
            logger.error("add product: Error adding the product");
            throw new Error("Error adding the product");
        }
    }

    // Update a product
    async updateProduct(productId, updateFields) {
        try {
            const result = await this.model.findByIdAndUpdate(productId, updateFields, { new: true });

            if (!result) {
                throw new Error("Product to update not found");
            }

            return result;
        } catch (error) {
            logger.error("update product: Error updating the product");
            throw new Error("Error updating the product");
        }
    }

    // Delete a product
    async deleteProduct(productId) {
        try {
            const result = await this.model.findByIdAndDelete(productId);

            if (!result) {
                throw new Error("Product to delete not found");
            }

            return result;
        } catch (error) {
            logger.error("delete product: Error deleting the product");
            throw new Error("Error deleting the product");
        }
    }
}