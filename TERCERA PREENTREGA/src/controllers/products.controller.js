import { ProductsService } from "../services/products.service.js";
import { CustomError } from "../services/customErrors/customError.service.js";
import { Errors } from "../enums/Errors.js";
import { dataBaseGetError, paramError } from "../services/customErrors/errors/generalErrors.service.js";
import { addProductError, updateProductError, mockingProductsError } from "../services/customErrors/errors/productsErrors.service.js";
import { productsModel } from "../dao/mdb/models/products.model.js";
import { generateProductMock } from "../helpers/mock.js";

export class ProductsController {
    static getProducts = async (req, res,  next) => {
        try {
            const { limit = 8, page = 1, sort, category, stock } = req.query
    
            const query = {}    
            const options = {
                limit,
                page,
                sort,
                lean: true
            }
    
            // Filter by category (http://localhost:8080/api/products?category=vegan)
            if (category) {
                query.category = category
            }
    
            // Filter by stock (http://localhost:8080/api/products?stock=0 || http://localhost:8080/api/products?stock=20)
            if (stock) {
                if (stock === "false" || stock == 0) {
                    query.stock = 0
                } else {
                    query.stock = stock
                }
            }
    
            // Sort by price (http://localhost:8080/api/products?sort=desc || http://localhost:8080/api/products?sort=asc)
            if (sort) {
                if (sort === "asc") {
                    options.sort = { price: 1 }
                } else if (sort === "desc") {
                    options.sort = { price: -1 }
                }
            }
    
            const products = await ProductsService.getProducts(query, options)

            // Custom error
            if (!products) {
                CustomError.createError ({
                    name: "get products error",
                    cause: dataBaseGetError(),
                    message: "Error getting products",
                    errorCode: Errors.DATABASE_ERROR
                })
            }
            
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
            }
    
            res.json({ status: "success", data: dataProducts })
        } catch (error) {
            next(error)
        }
    }

    static getProductById = async (req, res) => {
        try {
            const { pid } = req.params
            const product = await ProductsService.getProductById(pid)
            
            // Custom error
            if (!product) {
                CustomError.createError ({
                    name: "get product by id error",
                    cause: paramError(pid),
                    message: "Error getting the product",
                    errorCode: Errors.INVALID_PARAM_ERROR
                })
            }

            res.json({ status: "success", data: product })
        } catch (error) {
           next(error)
        }
    }

    static addProduct = async (req, res, next) => { 
        try {
            const productInfo = req.body
            const thumbnailFile = req.file ? req.file.filename : undefined

            // Custom error
            const newProduct = new productsModel(productInfo)

            try {
                await newProduct.validate()
            } catch {
                CustomError.createError ({
                    name: "add product error",
                    cause: addProductError(productInfo),
                    message: "Error validating data",
                    errorCode: Errors.INVALID_BODY_ERROR
                })
            }
        
            newProduct.thumbnail = thumbnailFile

            const addedProduct = await ProductsService.addProduct(productInfo)
            res.json({ status: "success", message: "Product created", data: addedProduct })
        } catch (error) {
            next(error)
        }
    }

    static updateProduct = async (req, res, next) => {
        try {
            const { pid } = req.params
            const updateFields = req.body
            const thumbnailFile = req.file ? req.file.filename : undefined
    
            // Custom error
            const { title, description, code, price, stock, category } = updateFields

            if (
                title && typeof title !== "string" ||
                description && !Array.isArray(description) ||
                code && typeof code !== "string" ||
                price && typeof price !== "number" ||
                stock && typeof stock !== "number" ||
                category && (typeof category !== "string" || (category !== "vegan" && category !== "vegetarian")) ||
                price < 0 ||
                stock < 0
            ) {
                CustomError.createError({
                    name: "update product error",
                    cause: updateProductError(updateFields),
                    message: "Error validating data",
                    errorCode: Errors.INVALID_BODY_ERROR
                })
            }
    
            updateFields.thumbnail = thumbnailFile

            const updatedProduct = await ProductsService.updateProduct(pid, updateFields)
            res.json({ status: "success", message: "Product updated", data: updatedProduct })
        } catch (error) {
            next(error)
        }
    }

    static deleteProduct = async (req, res, next) => {
        try {
            const { pid } = req.params
            const deletedProduct = await ProductsService.deleteProduct(pid)

            // Custom error
            if (!deletedProduct) {
                CustomError.createError ({
                    name: "delete product error",
                    cause: paramError(pid),
                    message: "Error getting the product to delete",
                    errorCode: Errors.INVALID_PARAM_ERROR
                })
            }

            res.json({ status: "success", message: "Product deleted", data: deletedProduct })
        } catch (error) {
            next(error)
        }
    }

    static mockingProducts = async (req, res, next) => {
        try {
            const quantity = parseInt(req.query.quantity) || 100
            let products = []

            for (let i = 0; i < quantity; i++) {
                const newProduct = generateProductMock()

                // Custom error
                if (!newProduct) {
                    CustomError.createError ({
                        name: "mocking products error",
                        cause: mockingProductsError(),
                        message: "Error creating products",
                        errorCode: Errors.DATABASE_ERROR
                    })
                }

                products.push(newProduct)
            }

            res.json({ status: "success", data: { payload: products }})
        } catch (error) {
            next(error)
        }
    }
}