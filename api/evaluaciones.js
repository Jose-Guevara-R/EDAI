/* api/evaluaciones.js */
import query from "./db.js";

export default async function handler(req, res) {
    // Configurar CORS para permitir peticiones desde tu web
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        // 1. SI ES POST: GUARDAR NUEVA EVALUACIÓN
        if (req.method === 'POST') {
            const { institucion, area, grado, ciclo, estudiantes } = req.body;

            const sql = `
        INSERT INTO evaluaciones (institucion, area, grado, ciclo, numero_estudiantes)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id;
      `;

            const result = await query(sql, [institucion, area, grado, ciclo, estudiantes]);
            return res.status(200).json({ id: result.rows[0].id, mensaje: "Guardado en Neon correctamente" });
        }

        // 2. SI ES GET: LISTAR EVALUACIONES
        if (req.method === 'GET') {
            const result = await query('SELECT * FROM evaluaciones ORDER BY fecha_creacion DESC');
            return res.status(200).json(result.rows);
        }

        // 3. SI ES PUT: ACTUALIZAR EVALUACIÓN (Para guardar contexto)
        if (req.method === 'PUT') {
            const { id, contexto_socioeconomico, contexto_sociocultural, contexto_comprension_lectora, contexto_clima_aula } = req.body;

            const sql = `
        UPDATE evaluaciones
        SET 
          contexto_socioeconomico = $1,
          contexto_sociocultural = $2,
          contexto_comprension_lectora = $3,
          contexto_clima_aula = $4,
          fecha_modificacion = NOW()
        WHERE id = $5
      `;

            await query(sql, [
                JSON.stringify(contexto_socioeconomico),
                contexto_sociocultural,
                contexto_comprension_lectora,
                contexto_clima_aula,
                id
            ]);

            return res.status(200).json({ mensaje: "Contexto actualizado correctamente" });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}