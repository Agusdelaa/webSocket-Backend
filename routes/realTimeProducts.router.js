import express from 'express'
import productManager from "../controllers/productManager.js"

const router = express.Router()

router.get('/', async (req, res) => {
    const products =  await productManager.getProducts();
    res.render('realTimeProducts', {
        products
    });
});

export default router