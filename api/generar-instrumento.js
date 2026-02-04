/* api/generar-instrumento.js */
import query from "./db.js";

export default async function handler(req, res) {
    // CORS Simple
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).end();

    const { evaluacion_id, evidencias_texto } = req.body;
    // evidencias_texto: array de strings que son los ítems finales

    let evidenciasArray = [];
    if (Array.isArray(evidencias_texto)) {
        evidenciasArray = evidencias_texto;
    } else if (typeof evidencias_texto === 'string') {
        // Si llega como string, lo dividimos por saltos de línea
        evidenciasArray = evidencias_texto.split('\n');
    }

    // Filtramos vacíos y LIMPIAMOS prefijos heredados de la gamificación
    evidenciasArray = evidenciasArray
        .map(t => {
            // Elimina prefijos como "Misión 1:", "Misión 2 (En base a:", "Evidencia:"
            let limpio = t.replace(/^Misión\s+\d+.*?\(\s*En\s*base\s*a\s*:\s*/i, '') // Quita "Misión 1 (En base a: "
                .replace(/^Misión\s+\d+\s*:\s*/i, '') // Quita "Misión 1:"
                .replace(/\)\s*$/, '') // Quita paréntesis final si quedó
                .replace(/^-\s*/, '') // Quita guiones iniciales
                .trim();
            // Si el regex falló o no coincide, devuelve el original pero trimmeado
            return limpio || t.trim();
        })
        .filter(t => t.length > 0);

    try {
        // 1. Obtener datos básicos
        const evalData = await query('SELECT numero_estudiantes FROM evaluaciones WHERE id = $1', [evaluacion_id]);
        if (evalData.rows.length === 0) return res.status(404).json({ error: "Evaluación no encontrada" });

        // 2. Insertar los ítems
        await query(`DELETE FROM indicadores_evaluacion WHERE evaluacion_id = $1 AND tipo_evidencia = 'item_final'`, [evaluacion_id]);

        for (const texto of evidenciasArray) {
            await query(`
          INSERT INTO indicadores_evaluacion 
          (evaluacion_id, competencia, descripcion_indicador, tipo_evidencia)
          VALUES ($1, $2, $3, 'item_final')
        `, [evaluacion_id, "General", texto]); // Asignamos competencia "General" por simplificación temporal
        }

        // 3. Confirmar éxito (El frontend usará esto para habilitar el módulo de notas en el futuro)
        return res.status(200).json({
            mensaje: "Instrumento sincronizado",
            items_registrados: evidenciasArray.length
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error generando instrumento en nube" });
    }
}
