/* api/ia-rubrica.js */
export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { area, grado, criterios } = req.body;
    // criterios: array de strings (indicadores)

    if (!criterios || !Array.isArray(criterios)) {
        return res.status(400).json({ error: "Faltan criterios" });
    }

    try {
        const prompt = `
            Actúa como un especialista pedagógico del MINEDU Perú.
            Tu tarea es generar DESCRIPTORES DE NIVEL (Inicio, Proceso, Logro) para una rúbrica diagnóstica.
            
            Área: ${area}
            Grado: ${grado}
            
            Inputs Sucios (Limpia el texto antes de procesar):
            ${criterios.map((c, i) => `${i + 1}. ${c}`).join('\n')}
            
            INSTRUCCIONES:
            1. Lee cada criterio. Si dice "Misión 1..." o similar, extrae solo la ACCIÓN PEDAGÓGICA (ej: "Elaborar prototipo").
            2. Redacta descriptores ESPECÍFICOS para ese contenido.
               - MALO: "No lo hace."
               - BUENO: "El prototipo no cumple con las medidas especificadas."
            
            FORMATO DE RESPUESTA (Solo JSON array):
            [
              {
                "criterio": "Texto limpio de la acción (ej: Elaboración de prototipo)",
                "inicio": "Descriptor específico nivel Inicio",
                "proceso": "Descriptor específico nivel Proceso",
                "logro": "Descriptor específico nivel Logro"
              }
            ]
        `;

        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
        let rubrica = [];
        const modelos = ['gemini-2.0-flash-exp', 'gemini-1.5-flash'];

        if (apiKey) {
            for (const modelo of modelos) {
                try {
                    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent?key=${apiKey}`;
                    const geminiReq = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: prompt }] }]
                        })
                    });
                    const geminiRes = await geminiReq.json();

                    if (geminiRes.candidates && geminiRes.candidates.length > 0) {
                        let textoRaw = geminiRes.candidates[0].content.parts[0].text;
                        textoRaw = textoRaw.replace(/```json/g, '').replace(/```/g, '').trim();
                        rubrica = JSON.parse(textoRaw);
                        break;
                    }
                } catch (e) {
                    console.error(`Fallo modelo ${modelo}:`, e.message);
                }
            }
        }

        if (rubrica.length === 0) {
            // Fallback
            rubrica = criterios.map(c => ({
                criterio: c,
                inicio: "Presenta dificultades para iniciar la tarea propuesta.",
                proceso: "Desarrolla la tarea con acompañamiento parcial.",
                logro: "Cumple satisfactoriamente con el desempeño esperado."
            }));
        }

        return res.status(200).json({ rubrica });

    } catch (error) {
        console.error("Error IA Rubrica:", error);
        return res.status(500).json({ error: "Error generando rúbrica" });
    }
}
