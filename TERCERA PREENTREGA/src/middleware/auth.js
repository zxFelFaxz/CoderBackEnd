import { GetUserInfoDto }  from "../dao/dto/getUserInfo.dto.js";

// If there is no active session
export const noSessionMiddleware = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/login")
    }
    next()
}

// If there is an active session
export const sessionMiddleware = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect("/profile")
    }
    next()
}

// According to the user's role
export const checkRoleMiddleware = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            const userInfoDto = new GetUserInfoDto(req.user)
            res.render("productsPaginate", { userInfoDto, error: "We are sorry! You do not have access to this page." })
        } else {
            next()
        }
    }
}