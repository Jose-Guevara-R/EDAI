/* api/ia-informe.js */
import query from "./db.js";

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { evaluacion_id } = req.body;

    try {
        // 1. Calcular Estadísticas desde DB (Agrupadas por indicador)
        const sql = `
      SELECT 
        i.descripcion_indicador as indicador,
        COUNT(CASE WHEN r.nivel_logro = 1 THEN 1 END) as inicio,
        COUNT(CASE WHEN r.nivel_logro = 2 THEN 1 END) as proceso,
        COUNT(CASE WHEN r.nivel_logro = 3 THEN 1 END) as logro,
        COUNT(CASE WHEN r.nivel_logro = 4 THEN 1 END) as destacado,
        COUNT(*) as total
      FROM resultados_estudiantes r
      JOIN indicadores_evaluacion i ON r.indicador_id = i.id
      WHERE r.evaluacion_id = $1
      GROUP BY i.descripcion_indicador
    `;

        const stats = await query(sql, [evaluacion_id]);

        // 2. Generar Prompt para la IA
        let promptContext = "Eres un especialista pedagógico del MINEDU Perú. Analiza los siguientes resultados cuantitativos de una evaluación diagnóstica de secundaria y redacta 'Conclusiones Descriptivas' (máximo 150 palabras). Enfócate en las necesidades de aprendizaje identificadas. Usa terminología pedagógica formal (CNEB).\n\nResultados por Indicador:\n";

        stats.rows.forEach(row => {
            // Calcular porcentajes simples para darle contexto a la IA
            const pInicio = Math.round((row.inicio / row.total) * 100);
            promptContext += `- En el indicador "${row.indicador}": El ${pInicio}% está en Inicio (dificultad alta).\n`;
        });

        // 3. Llamar a Gemini API (Google)
        // Se intenta usar la API real si existe la clave, sino devuelve un texto simulado.
        const apiKey = process.env.GEMINI_API_KEY;
        let textoIA = "Nota: Para generar conclusiones automáticas reales, configura la variable GEMINI_API_KEY en tu proyecto.\n\n(Simulación)\nDe acuerdo con los resultados, se evidencia que la mayoría de estudiantes requiere acompañamiento en la identificación de elementos explícitos. Se sugiere implementar estrategias de andamiaje...";

        if (apiKey) {
            try {
                const geminiReq = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: promptContext }] }]
                    })
                });
                const geminiRes = await geminiReq.json();
                if (geminiRes.candidates && geminiRes.candidates.length > 0) {
                    textoIA = geminiRes.candidates[0].content.parts[0].text;
                }
            } catch (e) {
                console.error("Error llamando a Gemini:", e);
                textoIA += "\n(Error de conexión con IA)";
            }
        }

        return res.status(200).json({
            estadisticas: stats.rows,
            conclusiones: textoIA
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error generando informe" });
    }
}
