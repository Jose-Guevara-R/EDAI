/* api/resultados.js */
import query from "./db.js";

export default async function handler(req, res) {
    // CORS Standards
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { evaluacion_id } = req.query; // Para GET

    try {
        // A. LISTAR LA MATRIZ DE EVALUACIÓN
        if (req.method === 'GET') {
            if (!evaluacion_id) return res.status(400).json({ error: "Falta evaluacion_id" });

            // 1. Obtener indicadores (Columnas de la tabla)
            const indicadores = await query(
                `SELECT id, descripcion_indicador FROM indicadores_evaluacion 
         WHERE evaluacion_id = $1 AND tipo_evidencia = 'item_final' 
         ORDER BY id ASC`,
                [evaluacion_id]
            );

            // 2. Obtener número de estudiantes (Filas de la tabla)
            const evaluacion = await query(
                'SELECT numero_estudiantes FROM evaluaciones WHERE id = $1',
                [evaluacion_id]
            );

            // 3. Obtener notas ya guardadas (si existen)
            const notas = await query(
                'SELECT estudiante_identificador, indicador_id, nivel_logro FROM resultados_estudiantes WHERE evaluacion_id = $1',
                [evaluacion_id]
            );

            return res.status(200).json({
                columnas: indicadores.rows,
                numEstudiantes: evaluacion.rows[0]?.numero_estudiantes || 0,
                datosPrevios: notas.rows
            });
        }

        // B. GUARDAR NOTAS MASIVAMENTE
        if (req.method === 'POST') {
            const { evaluacion_id, resultados } = req.body;
            // resultados = [{ estudiante: "1", indicador: 54, nota: 3 }, ...]

            // 1. Borrar notas anteriores de esta evaluación (Estrategia simple de reemplazo)
            await query('DELETE FROM resultados_estudiantes WHERE evaluacion_id = $1', [evaluacion_id]);

            // 2. Insertar nuevas notas
            // (En producción usaríamos una transacción o un multi-insert más eficiente, pero esto funciona)
            for (const r of resultados) {
                await query(`
          INSERT INTO resultados_estudiantes 
          (evaluacion_id, indicador_id, estudiante_identificador, nivel_logro)
          VALUES ($1, $2, $3, $4)
        `, [evaluacion_id, r.indicador, r.estudiante, r.nota]);
            }

            return res.status(200).json({ mensaje: "Resultados guardados" });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error en servidor de resultados" });
    }
}
