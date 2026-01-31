/* api/indicadores.js */
import query from "./db.js";

export default async function handler(req, res) {
    // CORS Standards
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method === 'POST') {
        const { evaluacion_id, competencias, area } = req.body;
        // competencias es un array: ["Crea proyectos...", "Aprecia..."]

        try {
            // 1. Limpiar competencias previas (por si el usuario corrige y vuelve a guardar)
            await query('DELETE FROM indicadores_evaluacion WHERE evaluacion_id = $1', [evaluacion_id]);

            // 2. Insertar las nuevas
            // Nota: En un sistema real Premium, aquí buscaríamos en un "Banco de Estándares"
            // para llenar automáticamente la descripción del indicador.
            // Por ahora, insertamos la competencia genérica.

            for (const comp of competencias) {
                await query(`
          INSERT INTO indicadores_evaluacion 
          (evaluacion_id, competencia, descripcion_indicador, tipo_evidencia)
          VALUES ($1, $2, $3, $4)
        `, [evaluacion_id, comp, "Indicador pendiente de definir", "Por definir"]);
            }

            return res.status(200).json({ mensaje: "Competencias registradas" });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error guardando indicadores" });
        }
    }
}
