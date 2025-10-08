import { Router } from "express";
import { Pedido_Items } from "../models/index.js";

const router = Router();

router.get('/pedidoItems', async (req, res)=>{
    try {
        const pedidos_items = await Pedido_Items.findAll()
        res.status(200).json({
            success: true,
            pedidos_items: pedidos_items
        })
    } catch (error) {
        res.status(500).json({
            error: error
        })
    }
    
})

router.post('/pedidoItems', async (req, res)=>{
    const {pedidoId, productoId, cantidad, precioUnitario, subtotal} = req.body

    try {
        const pedidoItem = await Pedido_Items.create({
            pedidoId: pedidoId,
            productoId: productoId,
            cantidad: cantidad,
            precioUnitario: precioUnitario,
            subtotal: subtotal
        });
        res.status(201).json({
            success: true,
            pedidoItem: pedidoItem
        })
    } catch (error) {
        res.status(500).json({
            error: error
        })
    }
})

router.post('/pedidoItems/many-products', async (req, res) => {
    const { pedidoId, productos } = req.body;
    try {
        // Validamos que productos sea un array
        if (!Array.isArray(productos) || productos.length === 0) {
            return res.status(400).json({ error: "Debes enviar un array de productos." });
        }

        // Creamos todos los items en paralelo
        const pedidoItems = await Promise.all(
            productos.map((producto) =>
                Pedido_Items.create({
                    pedidoId: pedidoId,
                    productoId: producto.productoId,
                    cantidad: producto.cantidad,
                    precioUnitario: producto.precioUnitario,
                    subtotal: producto.subtotal,
                })
            )
        );

        res.status(201).json({
            success: true,
            pedidoItems,
        });
    } catch (error) {
        console.error("Error al crear pedido items:", error);
        res.status(500).json({
            
        });
    }
});

router.put('/pedidoItems', async (req, res) => {
    const { pedidoItemId, pedidoId, productoId, cantidad, precioUnitario, subtotal } = req.body;

    try {
        const [cantidadActualizados] = await Pedido_Items.update(
            { 
                pedidoId: pedidoId, 
                productoId: productoId, 
                cantidad: cantidad, 
                precioUnitario: precioUnitario,
                subtotal: subtotal
            },
            { where: { id: pedidoItemId } }
        );

        if (cantidadActualizados === 0) {
        return res.status(404).json({
            success: false,
            message: "Relacion no encontrada o datos iguales"
        });
        }
        
        const pedidoItemActualizado = await Pedido_Items.findByPk(pedidoItemId);
        res.status(200).json({
            success: true,
            producto: pedidoItemActualizado
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

router.delete('/pedidoItems/:pedidoItemsId_string', async (req, res) => {
    const { pedidoItemsId_string } = req.params;
    const pedidoItemsId = parseInt(pedidoItemsId_string)

    try {
        const cantidadEliminados = await Pedido_Items.destroy(
            { where: { id: pedidoItemsId } }
        );

        if (cantidadEliminados === 0) {
        return res.status(404).json({
            success: false,
            message: "Relacion de pedido e item no encontrada"
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