import { Router } from "express";
import { Productos } from "../models/index.js";

const router = Router();

router.get('/productos', async (req, res)=>{
    try {
        const productos = await Productos.findAll()
        res.status(200).json({
            success: true,
            productos: productos
        })
    } catch (error) {
        res.status(500).json({
            error: error
        })
    }
    
})

router.post('/productos', async (req, res)=>{
    const {nombre, precio, stock, estado} = req.body

    try {
        const producto = await Productos.create({
            nombre: nombre,
            estado: estado,
            precio: precio,
            stock: stock
        });
        res.status(201).json({
            success: true,
            producto: producto
        })
    } catch (error) {
        res.status(500).json({
            error: error
        })
    }
})

router.put('/productos', async (req, res) => {
    const { productoId, nombre, precio, stock, estado } = req.body;

    try {
        const [cantidadActualizados] = await Productos.update(
            { nombre: nombre, precio: precio, stock: stock, estado: estado },
            { where: { id: productoId } }
        );

        if (cantidadActualizados === 0) {
        return res.status(404).json({
            success: false,
            message: "Producto no encontrado o datos iguales"
        });
        }
        
        const productoActualizado = await Productos.findByPk(productoId);
        res.status(200).json({
            success: true,
            producto: productoActualizado
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

router.delete('/productos/:productoId_string', async (req, res) => {
    const { productoId_string } = req.params;
    const productoId = parseInt(productoId_string)

    try {
        const cantidadEliminados = await Productos.destroy(
            { where: { id: productoId } }
        );

        if (cantidadEliminados === 0) {
        return res.status(404).json({
            success: false,
            message: "Producto no encontrado"
        });
        }
    
        res.status(200).json({
            success: true
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

export default router;