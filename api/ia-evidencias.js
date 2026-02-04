/* api/ia-evidencias.js */
export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { area, grado, ciclo, competencias, estandar, situacion } = req.body;

    try {
        const prompt = `
            Actúa como un especialista pedagógico del MINEDU (Perú).
            
            CONTEXTO:
            - Área: ${area}
            - Grado: ${grado} (${ciclo})
            - Competencias: ${competencias.join(", ")}
            - Estándar del Ciclo: ${estandar}
            - Situación Significativa: "${situacion}"
            
            TAREA:
            Propón 3 EVIDENCIAS DE APRENDIZAJE concretas, creativas y retadoras que permitan evaluar estas competencias en el contexto de la situación significativa dada.
            
            CRITERIOS PARA LAS EVIDENCIAS:
            1. Deben ser productos tangibles o actuaciones observables.
            2. Deben estar directamente conectadas con la Situación Significativa (que resuelvan el problema o reto planteado).
            3. No uses generalidades como "Un informe". Sé específico: "Un informe científico sobre la calidad del agua en...".
            
            FORMATO DE RESPUESTA:
            Solo devuelve una lista con viñetas de las 3 evidencias sugeridas. Sin saludos ni explicaciones extra.
        `;

        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
        let sugerencias = "";
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
                        sugerencias = geminiRes.candidates[0].content.parts[0].text.trim();
                        break;
                    }
                } catch (e) {
                    console.error(`Fallo modelo ${modelo}:`, e.message);
                }
            }
        }

        if (!sugerencias) {
            // Fallback mejorado un poco, pero la idea es que nunca llegue aquí si hay API Key
            sugerencias = `- Elaboración de un ${area === 'Comunicación' ? 'ensayo argumentativo' : 'prototipo'} sobre el problema planteado.\n- Exposición oral explicando la solución propuesta.\n- Informe detallado del proceso de indagación.`;
        }

        return res.status(200).json({ sugerencias });

    } catch (error) {
        console.error("Error IA Evidencias:", error);
        return res.status(500).json({ error: "Error generando evidencias" });
    }
}
