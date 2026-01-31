/* api/install_db.js */
import query from "./db.js";

export default async function handler(req, res) {
    try {
        const sql = `
      -- 0. LIMPIEZA PROFUNDA (CUIDADO: BORRA DATOS)
      DROP TABLE IF EXISTS resultados_estudiantes CASCADE;
      DROP TABLE IF EXISTS indicadores_evaluacion CASCADE;
      DROP TABLE IF EXISTS evaluaciones CASCADE;

      -- 1. TABLA EVALUACIONES
      CREATE TABLE evaluaciones (
          id SERIAL PRIMARY KEY,
          nombre_docente VARCHAR(255),
          institucion VARCHAR(255),
          area VARCHAR(100) NOT NULL,
          grado VARCHAR(50),
          ciclo VARCHAR(50),
          numero_estudiantes INTEGER, -- ESTA ES LA COLUMNA QUE FALTABA
          fecha_creacion TIMESTAMP DEFAULT NOW(),
          fecha_modificacion TIMESTAMP DEFAULT NOW(),
          contexto_socioeconomico JSONB, 
          contexto_sociocultural TEXT,
          contexto_clima_aula TEXT,
          contexto_comprension_lectora TEXT,
          estado VARCHAR(20) DEFAULT 'borrador'
      );

      -- 2. TABLA INDICADORES
      CREATE TABLE IF NOT EXISTS indicadores_evaluacion (
          id SERIAL PRIMARY KEY,
          evaluacion_id INTEGER REFERENCES evaluaciones(id) ON DELETE CASCADE,
          competencia VARCHAR(255) NOT NULL,
          capacidad VARCHAR(255),
          descripcion_indicador TEXT NOT NULL,
          tipo_evidencia VARCHAR(100)
      );

      -- 3. TABLA RESULTADOS
      CREATE TABLE IF NOT EXISTS resultados_estudiantes (
          id SERIAL PRIMARY KEY,
          evaluacion_id INTEGER REFERENCES evaluaciones(id) ON DELETE CASCADE,
          indicador_id INTEGER REFERENCES indicadores_evaluacion(id) ON DELETE CASCADE,
          estudiante_identificador VARCHAR(150), 
          nivel_logro INTEGER CHECK (nivel_logro BETWEEN 1 AND 4),
          observacion_especifica TEXT
      );
    `;

        await query(sql);
        return res.status(200).send("<h1>✅ Base de Datos Instalada Correctamente</h1><p>Ya puedes volver a intentar guardar la evaluación.</p>");

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}
