import fs from "fs";
import path from "path";

export default class ProductManager {
    constructor() {
      
        this.path = path.join("src", "data", "products.json");
    }

    async _readFile() {
        try {
            const data = await fs.promises.readFile(this.path, "utf-8");
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async _writeFile(data) {
        await fs.promises.writeFile(this.path, JSON.stringify(data, null, 2));
    }

   
    async getProducts() {
        return await this._readFile();
    }

    async getProductById(id) {
        const products = await this._readFile();
        return products.find((p) => p.id == id) || null;
    }

    async addProduct(product) {
        const requiredFields = ["title", "description", "price", "code", "stock", "category"];

        
        for (const field of requiredFields) {
            if (!product[field]) {
                throw new Error(`Falta el campo obligatorio: ${field}`);
            }
        }

        const products = await this._readFile();

       
        const codeExists = products.some((p) => p.code === product.code);
        if (codeExists) {
            throw new Error("El codigo del producto ya existe");
        }

        
        const newProduct = {
            id: products.length === 0 ? 1 : products[products.length - 1].id + 1,
            status: true,
            ...product
        };

        products.push(newProduct);
        await this._writeFile(products);

        return newProduct;
    }

    async updateProduct(id, updates) {
        const products = await this._readFile();
        const index = products.findIndex((p) => p.id == id);

        if (index === -1) return null;

        
        delete updates.id;

        const updatedProduct = { ...products[index], ...updates };
        products[index] = updatedProduct;

        await this._writeFile(products);
        return updatedProduct;
    }
    
    async deleteProduct(id) {
        const products = await this._readFile();
        const filtered = products.filter((p) => p.id != id);

        if (filtered.length === products.length) {
            return false; 
        }

        await this._writeFile(filtered);
        return true;
    }
}