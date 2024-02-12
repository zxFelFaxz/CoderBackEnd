export const createCartError = () => {
    return `An error occurred while creating the cart in the database`;
}

export const addProductToCartError = (quantity) => {
    return `The quantity must be a number greater than 0. Received: '${quantity}'`;
}

export const updateProductsInCartError = (product) => {
    return `
        - The quantity must be a number greater than 0. Received: '${product.quantity}'
        - The product ID must exist. Received: '${product.product}'
    `;
}

export const updateProductQuantityInCartError = (quantity) => {
    return `The quantity must be a number greater than 0. Received: '${quantity}'`;
}