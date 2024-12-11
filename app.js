import express from 'express'
import cors from 'cors'
import {db, initializeDb, dbQuery, dbRun} from './database.js'

const PORT = 3000
const app = express()
app.use(cors())
app.use(express.json())

app.get("/products", async (req, res) => {
    const products = dbQuery("SELECT * FROM products")
    res.status(200).json(products)
})

app.get("/products/:id", async (req, res) => {
    const products = await dbQuery("SELECT * FROM products WHERE id= ?", [req.params.id])
    if (products.length == 0) return res.status(404).json({message: "products not foud"})
    res.status(200).json(products[0])
})

app.post("/products", async (req, res) => {
    if (!req.body.name || !req.body.price) {
        return res.status(400).json({message: "Missing data"})
    }
    await dbRun("INSERT INTO products (name, price) VALUES (?, ?)", [req.body.name, req.body.price])
    res.status(200).json({message: "Product created"})
})

app.put("/products/:id", async (req, res) => {
    if (!req.body.name || !req.body.price) return res.status(400).json({message: "Missing data"})
    const products = await dbQuery("SELECT * FROM products WHERE id= ?", [req.params.id])
    if (products.length == 0) return res.status(404).json({message: "products not foud"})
    await dbRun("UPDATE products SET name = ?, price = ? WHERE id =?; "[req.body.name, req.body.price, req.params.id])
    res.status(201).json({message: "Updated"})
    
})

app.delete("/products/:id", async (req, res) => {
    await dbRun("DELETE FROM products WHERE id = ? ", [req.params.id])
    res.status(200).json({message: "Deleted"})
})

app.use((err, req, res, next) => {
    if (err){
        res.status(500).json({message: `Server error ${err}`})
    }
})

async function start(){
    await initializeDb()
    app.listen(PORT, () => console.log(`Server is running on ${PORT} port`))

}

start()