import { productsModel } from "../models/products.model.js";

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
            console.log("getProductsNoFilter: ", error.message);
            throw new Error("Error retrieving products");
        }
    }

    // Get all products with filters and pagination (products paginate)
    async getProducts(query, options) {
        try {
            const result = await this.model.paginate(query, options);
            return result;
        } catch (error) {
            console.log("getProducts: ", error.message);
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
            console.log("getProductById: ", error.message);
            throw new Error("Error retrieving the product");
        }
    }

    // Add a product
    async addProduct(productInfo) {
        try {
            const result = await this.model.create(productInfo);
            return result;
        } catch (error) {
            console.log("addProduct: ", error.message);
            throw error;
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
            console.log("updateProduct: ", error.message);
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
            console.log("deleteProduct: ", error.message);
            throw new Error("Error deleting the product");
        }
    }
}