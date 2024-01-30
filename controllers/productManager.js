import fs from "fs";

class ProductManager {

    constructor() {
        this.path = "./data/products.json"
        this.products = []
    }

    async getProducts() {
        try {
            const response = await fs.promises.readFile(this.path, "utf8")
            const products = JSON.parse(response)

            return products
        } catch (error) {
            throw error
        }
    }

    async getProductsById(id) {
        try {
            console.log("aca entro  pero")
            const response = await this.getProducts()

            const findedProduct = response.find(p => p.id == id)
            if (!findedProduct) {
                throw new Error( `No se encontro el producto con id ${id}`)
            }

            return findedProduct
        } catch (error) {
            throw error
        }
    }

    async addProduct(product) {
        try {
            this.products = await this.getProducts()
            const idAuto = this.getLastId()

            if (!product.title || !product.description || !product.code || !product.price || !product.status || !product.stock || !product.category || !product.status) {
                throw new Error("Debe llenar todos los campos")
            }

            let newProduct = {
                id: idAuto,
                ...product
            }

            this.products.push(newProduct)

            await fs.promises.writeFile(this.path, JSON.stringify(this.products))

            return newProduct
        } catch (error) {
            throw error
        }


    }

    async updateProduct(id, product) {
        try {
            const products = await this.getProducts()
            const indexProduct = products.findIndex(prod => prod.id === id)
            if (indexProduct !== -1) {
                products[indexProduct] = { id, ...product }
            } else {
                throw new Error(`Producto no encontrado con ese id ${id}`)
            }
            await fs.promises.writeFile(this.path, JSON.stringify(products))
            console.log("Producto Modificado")
            return products[indexProduct]
        } catch (error) {
            throw new Error("Ocurrio un eror al modificar el Producto")
        }
    }

    async deleteProduct(id) {
        const products = await this.getProducts()
        const indexProduct = products.findIndex(prod => prod.id === id)
        if (indexProduct !== -1) {
            products.splice(indexProduct, 1)
            try {
                await fs.promises.writeFile(this.path, JSON.stringify(products))
                console.log("Producto eliminado Correctamente!")
            } catch (error) {
                throw new Error("Error al eliminar Producto");
            }
        } else {
            throw new Error (`Producto no encontrado con ese id ${id}`)
        }

    }

    getLastId() {
        if (this.products.length === 0) return 1
        const idGenerator = this.products[this.products.length - 1].id
        return idGenerator + 1
    }


}

const productManager = new ProductManager()

export default productManager

