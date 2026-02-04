/* api/ia-criterios.js */
export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { area, grado, contexto, competencias, estandar, situacion, evidencias } = req.body;

    try {
        const prompt = `
            Actúa como un especialista pedagógico experto del MINEDU Perú.
            Tu tarea es generar los CRITERIOS DE EVALUACIÓN para un instrumento de evaluación diagnóstica.
            
            INFORMACIÓN DEL CONTEXTO:
            - Área: ${area}
            - Grado: ${grado}
            - Contexto identificado: ${contexto}
            - Competencias seleccionadas: ${competencias}
            - Estándar de Ciclo: ${estandar}
            - Situación Significativa: ${situacion}
            - Evidencias solicitadas: ${evidencias}
            
            REGLAS TÉCNICAS:
            1. Los criterios deben ser observables, medibles y estar alineados al estándar del ciclo.
            2. Deben describir qué debe hacer el estudiante para demostrar la competencia.
            3. Presenta los criterios en una lista clara (pueden ser 3 a 5 criterios clave).
            4. Usa un lenguaje técnico-pedagógico del CNEB.
            
            FORMATO DE RESPUESTA:
            - Solo devuelve los criterios en formato de lista (puedes usar viñetas o números).
            - No incluyas explicaciones adicionales, solo el texto de los criterios.
        `;

        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;

        let criterios = "";
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
                        criterios = geminiRes.candidates[0].content.parts[0].text.trim();
                        break;
                    }
                } catch (e) {
                    console.error(`Fallo modelo ${modelo}:`, e.message);
                }
            }
        }

        if (!criterios) {
            criterios = "1. Identifica información explícita en el texto.\n2. Infiere e interpreta información relevante.\n3. Reflexiona sobre la forma y el contenido del texto.";
        }

        return res.status(200).json({ criterios });

    } catch (error) {
        console.error("Error IA Criterios:", error);
        return res.status(500).json({ error: "Error generando criterios" });
    }
}
