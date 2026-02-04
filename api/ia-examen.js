/* api/ia-examen.js */
export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { grado, area, indicadores, situacion, contexto, estandares } = req.body;

    const nombreColegio = (contexto?.colegio && contexto.colegio !== "tu institución educativa") ? contexto.colegio : "nuestra institución educativa";
    const nombreZona = (contexto?.zona && contexto.zona !== "tu comunidad") ? contexto.zona : "nuestra comunidad";
    const gradoFormateado = grado ? `${grado}.° de secundaria` : "secundaria";

    // Semilla de aleatoriedad para forzar a la IA a no repetirse
    const seed = Math.floor(Math.random() * 1000000);

    // Limpieza previa de indicadores/evidencias para evitar basura visual
    const indicadoresLimpios = indicadores.map(ind =>
        ind.replace(/^[-\u2022\d\.)]+\s*/, '') // Quita guiones, puntos, números al inicio
            .replace(/\.$/, '') // Quita punto final si existe para integrarlo en frases
            .trim()
    );

    try {
        const prompt = `
            ID: ${seed}
            ROL: Eres un Diseñador de Experiencias de Aprendizaje (Game Designer Pedagógico) para adolescentes peruanos.
            OBJETIVO: Convertir una evaluación diagnóstica aburrida en una MISIÓN DE APRENDIZAJE inmersiva y retadora.
            
            CONTEXTO:
            - Colegio: ${nombreColegio}
            - Grado: ${gradoFormateado}
            - Situación Real: "${situacion}"
            
            TU TAREA:
            1. Inventa un TÍTULO ÉPICO para la evaluación (ej: "Operación Rescate", "El Desafío del Futuro").
            2. Redacta una INTRODUCCIÓN NARRATIVA (Storytelling) que ponga al estudiante en un ROL importante (ej: Científico jefe, Alcalde escolar, Detective histórico). No digas "Lee el texto", di "Recibes este informe confidencial...".
            3. Convierte cada evidencia solicitada en una MISIÓN concreta dentro de la historia.

            LAS MISIONES (Basadas en estas evidencias):
            ${indicadoresLimpios.map((ind, i) => `   - Evidencia ${i + 1}: ${ind}`).join('\n')}

            REGLAS DE ORO:
            - ¡PROHIBIDO ABURRIR! Usa un tono que motive y empodere.
            - NO repitas el texto de la evidencia literal. Úsalo como base para la acción.
            - Si la evidencia es "Elaboración de prototipo", tu misión debe ser "Diseña el plano de tu invento...".
            
            FORMATO JSON (Estricto):
            {
              "titulo_examen": "Título Épico",
              "texto_estimulo": { 
                  "titulo": "Título de la Historia", 
                  "contenido": "Historia narrativa de 3 párrafos..." 
              },
              "desafios": [
                { 
                    "indicador": "Texto original evidencia", 
                    "titulo": "Misión 1: [Nombre de la Misión]", 
                    "enunciado": "Instrucción motivadora...", 
                    "espacio_respuesta": "lineas" 
                }
              ]
            }
        `;

        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
        let pDiagnostico = null;

        if (apiKey) {
            // Probamos primero con Flash por velocidad y confiabilidad, si no Pro
            const modelos = ['gemini-1.5-flash', 'gemini-1.5-pro'];

            for (const modelo of modelos) {
                try {
                    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent?key=${apiKey}`;
                    const geminiReq = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
                    });

                    if (!geminiReq.ok) continue;

                    const geminiRes = await geminiReq.json();
                    if (geminiRes.candidates && geminiRes.candidates.length > 0) {
                        let textoRaw = geminiRes.candidates[0].content.parts[0].text;
                        const jsonMatch = textoRaw.match(/\{[\s\S]*\}/);
                        if (jsonMatch) {
                            pDiagnostico = JSON.parse(jsonMatch[0]);
                            break;
                        }
                    }
                } catch (e) {
                    console.error(`Fallo inteligencia ${modelo}:`, e.message);
                }
            }
        }

        if (!pDiagnostico) {
            // FALLBACK PREMIUM: (Gamification de Emergencia)

            const rolSugerido = area.toLowerCase().includes("ciencia") ? "Científico Joven"
                : area.toLowerCase().includes("comunicación") ? "Periodista de Investigación"
                    : area.toLowerCase().includes("matemática") ? "Ingeniero Civil"
                        : "Líder Estudiantil";

            pDiagnostico = {
                titulo_examen: `🚀 DESAFÍO: PROYECTO ${area.toUpperCase()}`,
                texto_estimulo: {
                    titulo: `🌟 TU MISIÓN COMO ${rolSugerido.toUpperCase()}`,
                    contenido: situacion
                        ? `¡Atención, ${rolSugerido}! ${situacion} Tu comunidad confía en tu capacidad para analizar esta situación y proponer soluciones innovadoras. ¡Es momento de actuar!`
                        : `¡Atención, ${rolSugerido}! En nuestra comunidad de ${nombreZona}, ha surgido un reto inesperado. Se requiere tu intervención urgente para proponer soluciones creativas y viables.`
                },
                desafios: indicadoresLimpios.map((ind, i) => {
                    let accion = "Realiza";
                    let contexto = "para completar la misión.";

                    if (ind.toLowerCase().includes("prototipo") || ind.toLowerCase().includes("diseña")) {
                        accion = "🛠️ Dibuja y diseña";
                        contexto = "Asegúrate de detallar los materiales y funcionameinto.";
                    } else if (ind.toLowerCase().includes("informe") || ind.toLowerCase().includes("explic")) {
                        accion = "📢 Redacta o explica";
                        contexto = "Usa argumentos sólidos para convencer a la audiencia.";
                    } else if (ind.toLowerCase().includes("exposición") || ind.toLowerCase().includes("oral")) {
                        accion = "🎤 Prepara el guion para";
                        contexto = "¿Qué dirías para impactar a tu público?";
                    }

                    return {
                        indicador: ind,
                        titulo: `Misión ${i + 1}`,
                        enunciado: `🎯 **Tu Objetivo:** ${accion} **"${ind}"** ${contexto}`,
                        espacio_respuesta: "lineas"
                    };
                })
            };
        }

        return res.status(200).json(pDiagnostico);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error crítico de generación" });
    }
}
