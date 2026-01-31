-- ==============================================================================
-- ESQUEMA DE BASE DE DATOS - SISTEMA DE EVALUACIÓN DIAGNÓSTICA (VERSIÓN PREMIUM)
-- PLATAFORMA: Neon Tech (PostgreSQL)
-- FECHA: 2026
-- ==============================================================================

-- 1. TABLA: EVALUACIONES
-- Almacena la cabecera del informe y los datos del contexto institucional.
CREATE TABLE IF NOT EXISTS evaluaciones (
    id SERIAL PRIMARY KEY,
    
    -- Datos Institucionales
    nombre_docente VARCHAR(255),
    institucion VARCHAR(255),
    area VARCHAR(100) NOT NULL,
    grado VARCHAR(50),
    ciclo VARCHAR(50),
    numero_estudiantes INTEGER,
    
    -- Metadatos
    fecha_creacion TIMESTAMP DEFAULT NOW(),
    fecha_modificacion TIMESTAMP DEFAULT NOW(),
    
    -- Datos del Contexto (Almacenados como JSON para flexibilidad futura)
    -- Ejemplo: ["Pobreza", "Zona Rural", "Acceso a internet"]
    contexto_socioeconomico JSONB, 
    
    -- Textos descriptivos del contexto
    contexto_sociocultural TEXT,
    contexto_clima_aula TEXT,
    contexto_comprension_lectora TEXT, -- Clave para tu eje transversal
    
    -- Estado de la evaluación
    estado VARCHAR(20) DEFAULT 'borrador' CHECK (estado IN ('borrador', 'finalizado', 'archivado'))
);

-- 2. TABLA: INDICADORES_EVALUACION
-- Define QUÉ se está evaluando en esa prueba específica (las filas de tu rúbrica).
CREATE TABLE IF NOT EXISTS indicadores_evaluacion (
    id SERIAL PRIMARY KEY,
    evaluacion_id INTEGER REFERENCES evaluaciones(id) ON DELETE CASCADE,
    
    competencia VARCHAR(255) NOT NULL, -- Ej: "Aprecia de manera crítica..."
    capacidad VARCHAR(255),            -- Ej: "Percibe manifestaciones..."
    
    descripcion_indicador TEXT NOT NULL, -- Ej: "Identifica elementos culturales en una imagen"
    
    -- Tipo de evidencia esperada (oral, escrita, producto)
    tipo_evidencia VARCHAR(100)
);

-- 3. TABLA: RESULTADOS_ESTUDIANTES
-- Almacena la nota individual de cada estudiante por cada indicador.
-- Esta tabla permitirá generar los GRÁFICOS ESTADÍSTICOS.
CREATE TABLE IF NOT EXISTS resultados_estudiantes (
    id SERIAL PRIMARY KEY,
    evaluacion_id INTEGER REFERENCES evaluaciones(id) ON DELETE CASCADE,
    indicador_id INTEGER REFERENCES indicadores_evaluacion(id) ON DELETE CASCADE,
    
    -- Identificador del estudiante (Puede ser nombre o un ID anonimizado 1-30)
    estudiante_identificador VARCHAR(150), 
    
    -- Nivel de Logro CNEB:
    -- 1 = Inicio (C)
    -- 2 = Proceso (B)
    -- 3 = Logro Esperado (A)
    -- 4 = Logro Destacado (AD)
    nivel_logro INTEGER CHECK (nivel_logro BETWEEN 1 AND 4),
    
    observacion_especifica TEXT -- Comentario opcional para el alumno en ese ítem
);

-- 4. TABLA: BANCO_ITEMS (OPCIONAL - FUTURO)
-- Servirá para sugerir preguntas automáticamente sin escribirlas.
CREATE TABLE IF NOT EXISTS banco_items (
    id SERIAL PRIMARY KEY,
    area VARCHAR(100),
    ciclo VARCHAR(50),
    competencia VARCHAR(255),
    texto_item TEXT,
    sugerencia_nivel VARCHAR(20) -- Para qué nivel de dificultad está pensado
);
