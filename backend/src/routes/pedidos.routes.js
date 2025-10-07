import { Router } from "express";
import { Pedidos } from "../models/index.js";

const router = Router();

router.get('/pedidos', async (req, res)=>{
    try {
        const pedidos = await Pedidos.findAll()
        res.status(200).json({
            success: true,
            pedidos: pedidos
        })
    } catch (error) {
        res.status(500).json({
            error: error
        })
    }
    
})

router.post('/pedidos', async (req, res)=>{
    const {clienteId, estado, total, fecha} = req.body

    try {
        const pedido = await Pedidos.create({
            clienteId: clienteId,
            estado: estado,
            total: total,
            fecha: fecha
        });
        res.status(201).json({
            success: true,
            pedido: pedido
        })
    } catch (error) {
        res.status(500).json({
            error: error
        })
    }
})

router.put('/pedidos', async (req, res) => {
    const { pedidoId, clienteId, estado, fecha, total } = req.body;

    try {
        const [cantidadActualizados] = await Pedidos.update(
            { clienteId: clienteId,estado: estado, fecha: fecha, total: total },
            { where: { id: pedidoId } }
        );

        if (cantidadActualizados === 0) {
        return res.status(404).json({
            success: false,
            message: "Pedido no encontrado o datos iguales"
        });
        }
        
        const pedidoActualizado = await Clientes.findByPk(clienteId);
        res.status(200).json({
            success: true,
            pedido: pedidoActualizado
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

router.delete('/pedidos/:pedidoId_string', async (req, res) => {
    const { pedidoId_string } = req.params;
    const pedidoId = parseInt(pedidoId_string)

    try {
        const cantidadEliminados = await Pedidos.destroy(
            { where: { id: pedidoId } }
        );

        if (cantidadEliminados === 0) {
        return res.status(404).json({
            success: false,
            message: "Pedido no encontrado"
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