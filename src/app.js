import express from 'express';
import { ProductManager } from './ClassProductManager.js';

const app = express();
const PORT = 8080;
const productJson = './src/Products.json';

// Create an instance of ProductManager to manage products
const productManager = new ProductManager(productJson);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

// Middleware for parsing URL-encoded and JSON data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Start route that returns a welcome message
app.get('/', (req, res) => {
    res.send(`
    <center> Welcome! Please try the following links to speed up your evaluation :)
    <p>
    <br><a href="http://localhost:8080/products">http://localhost:8080/products</a>
    <br>
    <br><a href="http://localhost:8080/products?limit=3">http://localhost:8080/products?limit=3</a>
    <br>
    <br><a href="http://localhost:8080/products/7">http://localhost:8080/products/7</a>
    <br>
    <br><a href="http://localhost:8080/products/1989">http://localhost:8080/products/1989</a>
    <br>
    </p></center>`);
});

// Route to get a list of products
app.get('/Products', async (req, res) => {
    let data = await productManager.getProducts();

    if (!data || data.length === 0) {
        return res.status(404).send('No products found.');
    } else {
        const limit = parseInt(req.query.limit); // Obtener el límite de la consulta
        if (isNaN(limit)) {
            // Si el límite no es un número válido, mostrar todos los productos
            return res.status(200).send(data);
        } else {
            // Limitar la cantidad de productos basados en el parámetro "limit"
            const limitedData = data.slice(0, limit);
            return res.status(200).send(limitedData);
        }
    }
});

// Route to get a product by its ID
app.get('/Products/:pid', async (req, res) => {
    try {
        let pid = req.params.pid;
        let data = await productManager.getProducts();
        if (!data) {
            throw Error('Error reading the file');
        } else {
            // Find the product by its ID
            let result = data.find((item) => item.id == pid); // Change "===" to "=="
            if (!result) {
                throw Error('The product does not exist. <a href="/">Home</a>');
            } else {
                return res.status(200).send(result);
            }
        }
    } catch (error) {
        return res.status(500).send(error.message);
    }
});
