import { conn } from '../db.js'
import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
    const [result] = await conn.query("SELECT titulo, descripcion, puesto, marca FROM comunicados_tabla")
    res.json(result)
})

export default router