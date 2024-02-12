import { Errors } from "../enums/Errors.js";

export const errorHandler = (error, req, res, next) => {
    switch (error.code) {
        case Errors.DATABASE_ERROR:
            res.json({ status: "error", error: error.message + error.cause })
            break

        case Errors.INVALID_PARAM_ERROR:
            res.json({ status: "error", error: error.message + error.cause })
            break

        case Errors.INVALID_BODY_ERROR:
            res.json({ status: "error", error: error.message + error.cause })
            break

        default:
            res.json ({ status: "error", error: error.message })
            break
    }
}