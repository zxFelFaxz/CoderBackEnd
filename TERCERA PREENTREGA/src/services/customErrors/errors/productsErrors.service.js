export const addProductError = (product) => {
    return `        
        All fields are required:

        - Title: must be text. Received: '${product.title}'
        - Description: must be a list. Received: '${product.description}'
        - Code: must be unique and alphanumeric text. Received: '${product.code}'
        - Price: must be a number greater than or equal to 0. Received: '${product.price}'
        - Stock: must be a number greater than or equal to 0. Received: '${product.stock}'
        - Category: must be text, options are 'vegan' or 'vegetarian'. Received: '${product.category}'
    `;
}

export const updateProductError = (product) => {
    return `
        The fields to update must be valid:

        - Title: must be text. Received: "${product.title}"
        - Description: must be a list. Received: "${product.description}"
        - Code: must be unique and alphanumeric text. Received: "${product.code}"
        - Price: must be a number greater than or equal to 0. Received: "${product.price}"
        - Stock: must be a number greater than or equal to 0. Received: "${product.stock}"
        - Category: must be text, options are "vegan" or "vegetarian". Received: "${product.category}"
    `;
}

export const mockingProductsError = () => {
    return `An error occurred while creating the products with faker`;
}