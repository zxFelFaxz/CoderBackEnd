import fs from "fs"

export class ProductManager {
    constructor(filePath) {
        this.filePath = filePath
    }

    fileExist(){
        return fs.existsSync(this.filePath)
    }

    // Get all products
    async getProducts() {
        try {
            if (this.fileExist()) {
                const content = await fs.promises.readFile(this.filePath, "utf-8")
                const products = JSON.parse(content)
                return products
            } else {
                return []
            }
        } catch (error) {
            throw new Error("Error getting products from file")
        }
    }

    // Add a product
    async addProduct(productData) {
        try {
            if(this.fileExist()){
                const products = await this.getProducts()
            
                // Check if all fields are complete and have valid values
                if (
                    !productData.title || typeof productData.title !== "string" ||
                    !productData.description || (!Array.isArray(productData.description) || !productData.description.every(item => typeof item === "string")) ||
                    !productData.code || typeof productData.code !== "string" ||
                    !productData.price || productData.price < 0 || typeof productData.price !== "number" ||
                    (productData.status && typeof productData.status !== "boolean") ||
                    !productData.stock || productData.stock < 0 || typeof productData.stock !== "number" ||
                    !productData.category || typeof productData.category !== "string" ||
                    (productData.thumbnails && (!Array.isArray(productData.thumbnails) || !productData.thumbnails.every(item => typeof item === "string")))

                ) {
                    throw new Error("Error adding product: all fields are required and must have valid values")
                }

                // Set status to true by default
                if (!productData.status) {
                    productData.status = true
                }

                // Check if the product already exists
                if (products.some((product) => product.code === productData.code)) {
                    throw new Error(`Error adding product: product with code ${productData.code} already exists`)
                }

                // Autogenerate ID
                const newProductId = products.reduce((maxId, product) => Math.max(maxId, product.id), 0)
                const newProduct = { ...productData, id: newProductId + 1 }

                // Add the product
                products.push(newProduct)
                await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, "\t"))
            } else {
                throw new Error("Error when adding product: error when getting products from file")
            }
        } catch (error) {
            throw error
        }
    }

    // Get a product by ID
    async getProductById(id) {
        try {
            if(this.fileExist()){
                const products = await this.getProducts()
                const product = products.find((product) => product.id === id)

                if (product) {
                    return product
                } else {
                    throw new Error(`Error searching for product: product with ID ${id} does not exist`)
                }
            } else {
                throw new Error("Error searching for product: error getting products from file")
            }
        } catch (error) {
            throw error
        }
    }

    // Upgrading a product
    async updateProduct(id, updateFields) {
        try {
            if (this.fileExist()) {
                const products = await this.getProducts()

                // Search for product position with product ID
                const productIndex = products.findIndex((product) => product.id === id)

                if (productIndex !== -1) {
                    // Do not allow modification of the ID
                    if ("id" in updateFields) {
                        delete updateFields.id
                    }

                    products[productIndex] = { ...products[productIndex], ...updateFields }
                    await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, "\t"))
                } else {
                    throw new Error(`Error updating product: product with ID ${id} does not exist`)
                }
            } else {
                throw new Error("Error updating the product: error getting the products from the file")
            }
        } catch (error) {
            throw error
        }
    }

    // Delete a product
    async deleteProduct(id) {
        try {
            if (this.fileExist()) {
                const products = await this.getProducts()
                const updateProducts = products.filter((product) => product.id !== id)

                // Update the file with the deleted product
                if (products.length !== updateProducts.length) {
                    await fs.promises.writeFile(this.filePath, JSON.stringify(updateProducts, null, "\t"))
                } else {
                    throw new Error(`Error when deleting product: product with ID ${id} does not exist`)
                }
            } else {
                throw new Error("Error when deleting product: error when getting products from file")
            }
        } catch (error) {
            throw error
        }
    }
}