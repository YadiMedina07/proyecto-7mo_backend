import { Router } from 'express';
import * as pedidoController from '../controllers/Pedido.controller.js';
import { isAuthenticated, isAdmin } from '../middleware/auth.js';

const router = Router();

router.post('/crear', isAuthenticated, pedidoController.crearPedido);
router.get('/obtener',        isAuthenticated, isAdmin, pedidoController.obtenerPedidosAdmin);
router.get('/obtener/:email',        pedidoController.obtenerPedidosPorEmail);
router.put('/:id/status',     isAuthenticated, isAdmin, pedidoController.actualizarEstadoPedido);

export default router;
