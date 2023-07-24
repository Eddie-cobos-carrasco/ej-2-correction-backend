const fs = require("fs");

class ProductManager {
    constructor(filePath) {
        this.filePath = filePath;
        this.products = this.loadProductsFromFile() || [];
    }

    loadProductsFromFile() {
        try {
            const data = fs.readFileSync(this.filePath, "utf8");
            return JSON.parse(data);
        } catch (error) {
            return null;
        }
    }

    saveProductsToFile() {
        const data = JSON.stringify(this.products, null, 2);
        fs.writeFileSync(this.filePath, data, "utf8");
    }

    getProducts() {
        return this.products;
    }

    addProduct(product) {
        const newProduct = {
            id: this.generateUniqueId(),
            ...product,
        };
        this.products.push(newProduct);
        this.saveProductsToFile();
        return newProduct;
    }

    getProductById(id) {
        const product = this.products.find((p) => p.id === id);
        if (!product) {
            throw new Error("Producto no encontrado");
        }
        return product;
    }

    updateProduct(id, updatedFields) {
        const productIndex = this.products.findIndex((p) => p.id === id);
        if (productIndex === -1) {
            throw new Error("Producto no encontrado");
        }
        this.products[productIndex] = {
            ...this.products[productIndex],
            ...updatedFields,
            id,
        };
        this.saveProductsToFile();
        return this.products[productIndex];
    }

    deleteProduct(id) {
        const productIndex = this.products.findIndex((p) => p.id === id);
        if (productIndex === -1) {
            throw new Error("Producto no encontrado");
        }
        this.products.splice(productIndex, 1);
        this.saveProductsToFile();
    }

    generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }
}


const filePath = "products.json";


const productManager = new ProductManager(filePath);


const newProduct = productManager.addProduct({
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25,
});

console.log("Producto agregado:", newProduct);


const products = productManager.getProducts();
console.log("Lista de productos:", products);


const productId = newProduct.id;
const productById = productManager.getProductById(productId);
console.log("Producto por ID:", productById);


const updatedFields = { title: "Producto Actualizado", price: 250 };
const updatedProduct = productManager.updateProduct(productId, updatedFields);
console.log("Producto actualizado:", updatedProduct);


productManager.deleteProduct(productId);
console.log("Producto eliminado con ID:", productId);

try {
    const deletedProduct = productManager.getProductById(productId);
    console.log("Producto eliminado por ID (esto no debería imprimirse):", deletedProduct);
} catch (error) {
    console.error("Error al obtener el producto eliminado:", error.message);
}

