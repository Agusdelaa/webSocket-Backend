import express from "express"
import handlebars from "express-handlebars"
import { fileURLToPath } from "url"
import { dirname } from "path"
import { Server } from "socket.io"
import  productManager  from  "./controllers/productManager.js"
import viewsRouter from "./routes/views.router.js"
import realTimeRouter from "./routes/realTimeProducts.router.js"


const app = express()
const PORT = 8080

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)


//Middlewars
app.use(express.json())
app.use(express.urlencoded({ extended : true }))
app.use(express.static(__dirname + "/public"))


//Configuracion para HandleBars
app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars")


app.use("/" ,viewsRouter)
app.use("/realTimeProducts" , realTimeRouter)

const httpServer = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
})

const socketServer = new Server(httpServer) 

socketServer.on("connection" , async (socket) => {
    console.log("Nueva Conexion")
    
    try {
        const products = await productManager.getProducts()
        socketServer.emit("products", products)
    } catch (error) {
        socketServer.emit('response', { status: 'error', message: error.message });
    }

    // "Señales"
    socket.on("new-Product", async (newProduct) => {
        try {
            const objectProductNew = {
                    title: newProduct.title,
                    description: newProduct.description,
                    code: newProduct.code,
                    price: newProduct.price,
                    status: newProduct.statu,
                    stock: newProduct.stock,
                    category: newProduct.category,
                    thumbnail: newProduct.thumbnail,
    
            }
            const pushedProduct = await productManager.addProduct(objectProductNew)
            const updatedListProd = await productManager.getProducts()
            socketServer.emit("products", updatedListProd)
            socketServer.emit('response', { status: 'success' , message: pushedProduct});

        } catch (error) {
            socketServer.emit('response', { status: 'error', message: error.message });
        }
    })

    socket.on("delete-product", async(id) => {
        try {
            const numberID = parseInt(id)
            await productManager.deleteProduct(numberID)
            const updatedListProd = await productManager.getProducts()
            socketServer.emit("products", updatedListProd)
            socketServer.emit('response', { status: 'success' , message: "successful delete "});
        } catch (error) {
            socketServer.emit('response', { status: 'error', message: error.message });
        }
    } )

})