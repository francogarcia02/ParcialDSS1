import { Router } from "express";
import { Clientes } from "../models/index.js";

const router = Router();

router.get('/clientes', async (req, res)=>{
    try {
        const clientes = await Clientes.findAll()
        res.status(200).json({
            success: true,
            clientes: clientes
        })
    } catch (error) {
        res.status(500).json({
            error: error
        })
    }
    
})

router.post('/clientes', async (req, res)=>{
    const {nombre, email} = req.body

    try {
        const cliente = await Clientes.create({
            nombre: nombre,
            email: email
        });
        res.status(201).json({
            success: true,
            cliente: cliente
        })
    } catch (error) {
        res.status(500).json({
            error: error
        })
    }
})

router.put('/clientes', async (req, res) => {
    const { clienteId, nombre, email } = req.body;

    try {
        const [cantidadActualizados] = await Clientes.update(
            { nombre: nombre, email: email },
            { where: { id: clienteId } }
        );

        if (cantidadActualizados === 0) {
        return res.status(404).json({
            success: false,
            message: "Cliente no encontrado o datos iguales"
        });
        }
        
        const clienteActualizado = await Clientes.findByPk(clienteId);
        res.status(200).json({
            success: true,
            cliente: clienteActualizado
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

router.delete('/clientes/:clienteId_string', async (req, res) => {
    const { clienteId_string } = req.params;
    const clienteId = parseInt(clienteId_string)

    try {
        const cantidadEliminados = await Clientes.destroy(
            { where: { id: clienteId } }
        );

        if (cantidadEliminados === 0) {
        return res.status(404).json({
            success: false,
            message: "Cliente no encontrado"
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