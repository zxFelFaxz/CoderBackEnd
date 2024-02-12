import { ProductsService } from "../services/products.service.js";
import { CartsService } from "../services/carts.service.js";
import { GetUserInfoDto } from "../dao/dto/getUserInfo.dto.js";
import { CustomError } from "../services/customErrors/customError.service.js";
import { Errors } from "../enums/Errors.js";
import { dataBaseGetError, paramError } from "../services/customErrors/errors/generalErrors.service.js";

export class ViewsController {
    static renderHome = async (req, res, next) => {
        try {
            const productsNoFilter = await ProductsService.getProductsNoFilter()

            //Custom error
            if (!productsNoFilter) {
                CustomError.createError ({
                    name: "get products error",
                    cause: dataBaseGetError(),
                    message: "Error getting products",
                    errorCode: Errors.DATABASE_ERROR
                })
            }
            const userInfoDto = new GetUserInfoDto(req.user)
            res.render("home", { productsNoFilter, userInfoDto, title: "Home" })
        } catch (error) {
            next(error)
        }
    }
    static renderRealTimeProducts = async (req, res) => {
        try {
            res.render("realTimeProducts", { title: "Menu" })
        } catch (error) {
            res.json({ status: "error", error: error.message })
        }
    }

    static renderProducts = async (req, res, next) => {
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
    
            // Custom Error
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
                title: "Menu"
            }
    
            const userInfoDto = new GetUserInfoDto(req.user)
            res.render("productsPaginate", { dataProducts, userInfoDto })
        } catch (error) {    
            next(error)
        }
    }

    static renderProductDetail = async (req, res, next) => {
        try {
            const { pid } = req.params
            const product = await ProductsService.getProductById(pid)
    
            // Custom Error
            if (!product) {
                CustomError.createError ({
                    name: "get product by id error",
                    cause: paramError(pid),
                    message: "Error getting produt",
                    errorCode: Errors.INVALID_PARAM_ERROR
                })
            }

            product.title = product.title.toUpperCase()
            
            const userInfoDto = new GetUserInfoDto(req.user)
            res.render("productDetail", { product, userInfoDto, title: `${product.title}` })
        } catch (error) {
            next(error)
        }
    }

    static renderCart = async (req, res, next) => {
        try {
            const { cid } = req.params
            const cart = await CartsService.getCartById(cid)
    
            // Custom Error
            if (!cart) {
                CustomError.createError ({
                    name: "get cart by id error",
                    cause: paramError(cid),
                    message: "Error getting cart",
                    errorCode: Errors.INVALID_PARAM_ERROR
                })
            }

            // Total Price
            const totalPrice = cart.products.reduce((acc, prod) => acc + prod.quantity * prod.product.price, 0)
    
            // Subtotal
            cart.products.forEach((prod) => {
                prod.subtotalPrice = prod.quantity * prod.product.price
            })
    
            const userInfoDto = new GetUserInfoDto(req.user)
            res.render("cart", { cart, totalPrice, userInfoDto, title: "Cart" })
        } catch (error) {
            next(error)
        }
    }

    static renderSignup = async (req, res) => {
        try {
            res.render("signup", { title: "Register" })
        } catch (error) {
            res.json({ status: "error", error: error.message})
        }
    }

    static renderLogin = async (req, res) => {
        try {
            res.render("login", { title: "Log in" })
        } catch (error) {
            res.json({ status: "error", error: error.message })
        }
    }

    static renderProfile = async (req, res) => {
        try {
            const userInfoDto = new GetUserInfoDto(req.user)
            res.render("profile", { userInfoDto, title: "Profile" })   
        } catch (error) {
            res.json({ status: "error", error: "Error getting profile" })
        }
    }
}