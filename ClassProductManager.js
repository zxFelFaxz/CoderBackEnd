class ProductManager{
    constructor(){
        this.products=[];
    }

    #getId(){
        let maxId = 0;
        this.products.map((product)=>{
            if(product.id > maxId) maxId = product.id;
        })
            return maxId+1
    }

    addProducts(title, description, thumbnail, price, code, stock){
        if (!title || !description || !thumbnail|| !price || !code || stock === undefined){
            return console.log(`Error, all fields are required. Try Again.`);
        }
        if (this.products.find((product) => product.code === code)){
            return console.log(`The code ${code} already exists.`);
        }else{
            const product = { 
                title, 
                description, 
                thumbnail, 
                price, 
                code, 
                stock, 
                id: this.#getId()
            }
            this.products.push(product);
        }
    }

    getProductsById(productId){
        const product = this.products.find(product => product.id === productId);
        return product || `Error, product ${productId} not found, try again.`;        
    }

    getProducts() {
        if (!this.products.length) {
            return `The products requested were ${this.products.length}.`;
        } else {
            return this.products;
        }
    }
}

const productManager = new ProductManager();
try {
    console.log(productManager.getProducts());
    productManager.addProducts('P1', 'Product 1', 'no image', 100, 'jfk1900', 20);
    productManager.addProducts('P2', 'Product 2', 'I am an image', 150, 'jfk1900', 21); // Code exists
    productManager.addProducts('P3', 'Product 3', 'no image',200, 30); // Uncompleted
    productManager.addProducts('P4', 'Product 4', 'I am an image',250, 'asd321', 70);
    console.log(productManager.getProducts());
    console.log("----------------------------------------")
    console.log(productManager.getProductsById(1));
    console.log(productManager.getProductsById(2));
    console.log(productManager.getProductsById(3));
} catch (error) {
    console.error(error.message);
}