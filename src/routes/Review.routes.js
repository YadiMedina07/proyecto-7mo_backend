import { Router } from "express";
import * as reviewController from "../controllers/Review.controller.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = Router();

// Productos que el usuario puede reseñar
router.get("/elegibles", isAuthenticated, reviewController.obtenerElegiblesParaResena);
// Crear reseña
router.post("/crear", isAuthenticated, reviewController.crearResena);

export default router;

