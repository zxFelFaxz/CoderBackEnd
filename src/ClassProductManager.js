import fs from "fs";

export class ProductManager {
  constructor(path) {
    this.path = './src/Products.json';
    this.products = [];
  }

  #getId() {
    let maxId = 0;
    this.products.forEach((product) => {
      if (product.id > maxId) {
        maxId = product.id;
      }
    });
    return maxId + 1;
  }

  async loadProducts() {
    try {
        console.log(`Reading data from file: ${this.path}`);
        const productsJSON = await fs.promises.readFile(this.path, 'utf-8');
        this.products = JSON.parse(productsJSON);
    } catch (error) {
        console.error(`Error reading data: ${error}`);
        this.products = [];
    }
  }

  async saveProducts() {
    await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
  }

  async getProducts() {
    await this.loadProducts();
    return this.products;
  }

  async addProduct(title, description, thumbnail, price, code, stock) {
    if (!title || !description || !thumbnail || !price || !code || stock === undefined) {
      return console.log(`Error, all fields are required. Try Again.`);
    }
    if (this.products.find((product) => product.code === code)) {
      return console.log(`The code ${code} already exists.`);
    } else {
      const product = {
        title,
        description,
        thumbnail,
        price,
        code,
        stock,
        id: this.#getId(),
      };
      this.products.push(product);
      await this.saveProducts();
    }
  }

  async updateProduct(id, title, description, thumbnail, price, code, stock) {
    if (!id || !title || !description || !thumbnail || !price || !code || stock === undefined) {
      return console.log("Error, all fields to be updated are required. Try Again.");
    } else {
      const index = this.products.findIndex((product) => product.id === id);
      if (index !== -1) {
        this.products[index] = {
          ...this.products[index],
          title,
          description,
          thumbnail,
          price,
          code,
          stock,
        };
        await this.saveProducts();
        console.log("The product has been updated.");
      } else {
        console.log("Error updating the product.");
      }
    }
  }

  async deleteProduct(id) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
      await this.saveProducts();
    }
  }

  getProductsById = async (id) => {
    await this.loadProducts();
    const product = this.products.find((product) => product.id === id);
    return product || `Error, product with ID ${id} not found, try again.`;
  }
}

const productManager = new ProductManager();

// async function testProductManager() {
//   try {
//     // Cargar productos al inicio de la prueba
//     await productManager.loadProducts();

//     // Pruebas de funciones aquí
//     const products = await productManager.getProducts();
//     console.log("Products:", products);

//     // Prueba de agregar un producto
//     await productManager.addProduct("P7", "Producto 7", "no image", 750, "fgh123", 35);
//     await productManager.addProduct("P25", "Producto 25", "no image ever", 700, "fgh123456", 65);
//     console.log("Product added.");
//     console.log("Products:", products);

//     // Prueba de actualizar un producto
//     await productManager.updateProduct(2, "P5", "Producto 5", "new image", 200, "abc123", 50);
//     console.log("Product updated.");
//     console.log("Products:", products);

//     // Prueba de eliminar un producto
//     await productManager.deleteProduct(2);
//     console.log("Product deleted.");

//     // Prueba de obtener un producto por ID
//     const product = await productManager.getProductsById(1);
//     console.log("Product by ID:", product);
//   } catch (error) {
//     console.error(error.message);
//   }
// }

// testProductManager();


