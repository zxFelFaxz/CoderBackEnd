import fs from "fs";

export class ProductManagerFS {
    constructor(filePath) {
        this.filePath = filePath;
    }

    fileExists() {
        return fs.existsSync(this.filePath);
    }

    // Get all products
    async getProducts() {
        try {
            if (this.fileExists()) {
                const content = await fs.promises.readFile(this.filePath, "utf-8");
                const products = JSON.parse(content);
                return products;
            } else {
                return [];
            }
        } catch (error) {
            throw new Error("Error retrieving products from the file");
        }
    }

    // Add a product
    async addProduct(productInfo) {
        try {
            if (this.fileExists()) {
                const products = await this.getProducts();

                // Check if all fields are filled and have valid values
                if (
                    !productInfo.title || typeof productInfo.title !== "string" ||
                    !productInfo.description || (!Array.isArray(productInfo.description) || !productInfo.description.every((item) => typeof item === "string")) ||
                    !productInfo.code || typeof productInfo.code !== "string" ||
                    !productInfo.price || productInfo.price < 0 || typeof productInfo.price !== "number" ||
                    (productInfo.status && typeof productInfo.status !== "boolean") ||
                    !productInfo.stock || productInfo.stock < 0 || typeof productInfo.stock !== "number" ||
                    !productInfo.category || (typeof productInfo.category !== "string") || (productInfo.category !== "vegano" && productInfo.category !== "vegetariano") ||
                    (productInfo.thumbnail && (typeof productInfo.thumbnail !== "string"))
                ) {
                    throw new Error("Error adding the product: all fields are mandatory and must have valid values");
                }

                // Set status to true by default
                if (productInfo.status === "" || productInfo.status === null || productInfo.status === undefined) {
                    productInfo.status = true;
                }

                // Check if the product already exists
                if (products.some((product) => product.code === productInfo.code)) {
                    throw new Error(`Error adding the product: product with code ${productInfo.code} already exists`);
                }

                // Auto-generate ID
                const newProductId = products.reduce((maxId, product) => Math.max(maxId, product.id), 0);
                const newProduct = { ...productInfo, id: newProductId + 1 };

                // Add the product
                products.push(newProduct);
                await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, "\t"));
            } else {
                throw new Error("Error adding the product: error retrieving products from the file");
            }
        } catch (error) {
            throw error;
        }
    }

    // Get a product by ID
    async getProductById(id) {
        try {
            if (this.fileExists()) {
                const products = await this.getProducts();
                const product = products.find((product) => product.id === id);

                if (product) {
                    return product;
                } else {
                    throw new Error(`Error searching for the product: product with ID ${id} does not exist`);
                }
            } else {
                throw new Error("Error searching for the product: error retrieving products from the file");
            }
        } catch (error) {
            throw error;
        }
    }

    // Update a product
    async updateProduct(id, updateFields) {
        try {
            if (this.fileExists()) {
                const products = await this.getProducts();

                // Find the position of the product with the id
                const productIndex = products.findIndex((product) => product.id === id);

                if (productIndex !== -1) {
                    // Do not allow modification of the id
                    if ("id" in updateFields) {
                        delete updateFields.id;
                    }

                    // Check if all fields have valid values
                    if (
                        updateFields.title && (typeof updateFields.title !== "string") ||
                        updateFields.description && (!Array.isArray(updateFields.description) || !updateFields.description.every((item) => typeof item === "string")) ||
                        updateFields.code && (typeof updateFields.code !== "string") ||
                        updateFields.price && (updateFields.price < 0 || typeof updateFields.price !== "number") ||
                        (updateFields.status && typeof updateFields.status !== "boolean") ||
                        updateFields.stock && (updateFields.stock < 0 || typeof updateFields.stock !== "number") ||
                        updateFields.category && ((typeof updateFields.category !== "string") || (updateFields.category !== "vegano" && updateFields.category !== "vegetariano")) ||
                        (updateFields.thumbnail && (typeof updateFields.thumbnail !== "string"))
                    ) {
                        throw new Error("Error updating the product: some fields are not valid");
                    }

                    products[productIndex] = { ...products[productIndex], ...updateFields };
                    await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, "\t"));
                } else {
                    throw new Error(`Error updating the product: product with ID ${id} does not exist`);
                }
            } else {
                throw new Error("Error updating the product: error retrieving products from the file");
            }
        } catch (error) {
            throw error;
        }
    }

    // Delete a product
    async deleteProduct(id) {
        try {
            if (this.fileExists()) {
                const products = await this.getProducts();
                const updatedProducts = products.filter((product) => product.id !== id);

                // Update the file with the deleted product
                if (products.length !== updatedProducts.length) {
                    await fs.promises.writeFile(this.filePath, JSON.stringify(updatedProducts, null, "\t"));
                } else {
                    throw new Error(`Error deleting the product: product with ID ${id} does not exist`);
                }
            } else {
                throw new Error("Error deleting the product: error retrieving products from the file");
            }
        } catch (error) {
            throw error;
        }
    }
}