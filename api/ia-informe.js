/* api/ia-informe.js */
import query from "./db.js";

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    // DIAGNÓSTICO: Si me llaman sin datos, devuelvo estado de keys
    if (!req.body || !req.body.evaluacion_id) {
        return res.json({
            hasGeminiKey: !!process.env.GEMINI_API_KEY,
            hasGoogleKey: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY
        });
    }

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
        // PRIORIDAD: Google Key (la que el usuario tiene validada)
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
        console.log("IA Key Status:", apiKey ? "OK (Hidden)" : "Missing");

        let textoIA = "Nota: Para generar conclusiones automáticas reales, configura la variable GEMINI_API_KEY en tu proyecto.\n\n(Simulación)\nDe acuerdo con los resultados, se evidencia que la mayoría de estudiantes requiere acompañamiento en la identificación de elementos explícitos. Se sugiere implementar estrategias de andamiaje...";

        if (apiKey) {
            // Actualizado para modelos 2026 detectados
            const modelos = ['gemini-3-flash-preview', 'gemini-3-pro-preview', 'gemini-2.5-flash-preview-09-2025'];
            let respuestaExitosa = false;

            for (const modelo of modelos) {
                console.log(`Intentando conectar con modelo: ${modelo}...`);

                try {
                    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent?key=${apiKey}`;

                    const geminiReq = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: promptContext }] }]
                        })
                    });

                    const geminiRes = await geminiReq.json();

                    if (geminiRes.candidates && geminiRes.candidates.length > 0) {
                        textoIA = geminiRes.candidates[0].content.parts[0].text;
                        respuestaExitosa = true;
                        console.log(`¡Éxito con ${modelo}!`);
                        break; // Salir del bucle si funcionó
                    } else if (geminiRes.error) {
                        console.warn(`Fallo con ${modelo}:`, geminiRes.error.message);
                    }
                } catch (errInt) {
                    console.error(`Error de red con ${modelo}`, errInt);
                }
            }

            if (!respuestaExitosa) {
                textoIA = "No se pudo conectar. Revisando modelos disponibles para esta llave (ver consola)...";

                // MODO DIAGNÓSTICO: Listar modelos reales
                try {
                    console.log("--- INICIANDO ESCANEO DE MODELOS DISPONIBLES ---");
                    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
                    const listReq = await fetch(listUrl);
                    const listData = await listReq.json();

                    if (listData.models) {
                        console.log("Modelos permitidos para tu API Key:");
                        listData.models.forEach(m => {
                            if (m.name.includes("gemini")) console.log(` - ${m.name}`);
                        });
                        textoIA += " (Revisa la terminal para ver los modelos soportados)";
                    } else {
                        console.error("ERROR LISTANDO MODELOS:", JSON.stringify(listData));
                        textoIA += ` Error: ${listData.error?.message || "Desconocido"}`;
                    }
                } catch (e) {
                    console.error("Fallo total al conectar con Google:", e);
                }
            }

        } else {
            console.log("No se encontró API Key válida en el flujo principal.");
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
