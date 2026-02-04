# INFORME TÉCNICO Y PEDAGÓGICO: SISTEMA INSTITUCIONAL DE EVALUACIÓN DIAGNÓSTICA (SIED)

**Versión del Documento:** 1.0  
**Fecha:** 4 de Febrero de 2026  
**Destino:** Equipo de Desarrollo (Migración a App Nativa)  
**Contexto:** Ministerio de Educación del Perú (MINEDU) - CNEB

---

## 1. RESUMEN EJECUTIVO

El **SIED (Sistema Institucional de Evaluación Diagnóstica)** es una herramienta digital de orquestación pedagógica diseñada para docentes de educación secundaria (Ciclos VI y VII). Su objetivo principal es automatizar, contextualizar y "gamificar" el diseño de la evaluación diagnóstica de entrada.

A diferencia de un simple procesador de textos, el SIED guía al docente a través de una **secuencia lógica de 8 pasos** alineada con el Currículo Nacional (CNEB), utilizando Inteligencia Artificial Generativa para transformar inputs técnicos (competencias, estándares) en materiales didácticos motivadores para el estudiante.

---

## 2. FUNDAMENTACIÓN PEDAGÓGICA (CORE MINEDU)

Cualquier reimplementación del SIED debe respetar estrictamente estos principios:

### 2.1 Enfoque por Competencias
El sistema no evalúa memorización. Se basa en el **"Saber Hacer"**.
*   **Lógica:** Input Competencia -> Output Evidencia Tangible.
*   **Validación:** Las actividades generadas siempre deben resolver un problema de la "Situación Significativa".

### 2.2 Evaluación Formativa
El diagnóstico no es para calificar (poner nota), sino para identificar necesidades.
*   **Resultados:** Se visualizan en mapas de calor (Inicio, Proceso, Logro) y no en escalas vigesimales (0-20), aunque internamente se manejen valores numéricos para estadística.

### 2.3 Contextualización
La IA actúa no como un generador genérico, sino como un adaptador cultural.
*   **Variables Críticas:** El sistema ingesta datos del contexto (ej. "Zona rural", "Contaminación del río") y adapta las preguntas del examen a esa realidad específica.

---

## 3. ARQUITECTURA DE LA APLICACIÓN (FLUJO DE USUARIO)

El SIED funciona como un "Wizard" (Asistente paso a paso). La App Nativa debe replicar este flujo secuencial:

### Fase 1: Insumos y Configuración
1.  **Datos Institucionales:** I.E., Grado, Sección.
2.  **Contexto:** Checklist de condiciones socioemocionales, lectoras y económicas.
    *   *Dato Clave:* Estos datos condicionan el "Prompt" de la IA más adelante.

### Fase 2: Alineamiento Curricular
3.  **Selección de Competencias:** Checkbox múltiple basado en el área curricular (Matemática, Comunicación, etc.).
4.  **Estándar de Aprendizaje:** Carga automática del texto oficial del CNEB según el ciclo seleccionado (VI o VII).

### Fase 3: Diseño de la Experiencia
5.  **Situación Significativa:** El docente redacta el problema del entorno (ej. "Anemia en adolescentes").
6.  **Evidencias (IA):**
    *   *Input:* Competencias + Situación.
    *   *Proceso:* La IA sugiere 3 productos tangibles (ej. "Prototipo de galleta de hierro").
    *   *Feature:* Botón "Sugerir con IA".

### Fase 4: Instrumentación (El Entregable)
7.  **Ficha del Estudiante (Gamification):**
    *   **Transformación:** Convierte la "Prueba escrita" en una "Misión".
    *   **Estructura:** Lectura motivadora + Retos/Misiones.
    *   **Exportación:** Generación de archivo nativo `.doc` (Word) para edición final.
8.  **Instrumento de Evaluación (Rúbrica):**
    *   Generación de tabla con descriptores de nivel (Inicio, Proceso, Logro) alineados a las misiones creadas.

### Fase 5: Análisis
9.  **Matriz de Resultados:** Dashboard interactivo para ingresar niveles de logro por estudiante.
10. **Informe Final:** Generación automática de conclusiones pedagógicas y gráficos estadísticos.

---

## 4. ESPECIFICACIONES TÉCNICAS PARA APP NATIVA

### 4.1 Modelo de Datos (JSON Schema)
Este es el objeto central `Evaluacion` que debe persistir en la base de datos local (SQLite/Realm) de la app:

```json
{
  "id": "uuid-v4",
  "meta_institucional": {
    "nombre_ie": "String",
    "area": "String", // Enum: ['Matemática', 'Comunicación', ...]
    "grado": "Integer",
    "ciclo": "String" // 'VI' | 'VII'
  },
  "contexto": {
    "socioeconomico": ["Array Strings"],
    "problematicas": "String"
  },
  "diseño_curricular": {
    "competencias_seleccionadas": ["String"],
    "estandar": "String",
    "situacion_significativa": "String"
  },
  "diseño_instruccional": {
    "evidencias": ["String"], // Output Paso 6
    "ficha_gamificada": {     // Output Paso 7 (IA)
      "titulo_epico": "String",
      "historia_contexto": "String",
      "misiones": [
        {
          "titulo": "String",
          "consigna": "String",
          "tipo_respuesta": "Enum: ['texto', 'dibujo', 'cuadricula']"
        }
      ]
    }
  },
  "instrumento_evaluacion": [ // Rúbrica
    {
      "criterio": "String",
      "nivel_inicio": "String",
      "nivel_proceso": "String",
      "nivel_logro": "String"
    }
  ]
}
```

### 4.2 Lógica de "Gamification" (Business Logic)
La app no puede simplemente pegar texto. Debe implementar la lógica de limpieza y transformación que desarrollamos:

*   **Sanitización:** Limpiar bullets, guiones y números de los textos que vienen de la IA o inputs manuales.
*   **Inyección de Roles:** Detectar el área para asignar roles automáticos si la IA falla (ej. Área Ciencia -> Rol: "Científico Jefe").
*   **Fallback Strategy:** Si no hay conexión para la IA, el sistema debe tener plantillas pre-cargadas ("Templates") donde solo se insertan las variables del docente.

### 4.3 Integración con IA (API Gateway)
La app nativa no debe llamar a OpenAI/Gemini directamente desde el cliente (por seguridad de API Key).
*   **Arquitectura:** App -> Cloud Function (Middleware) -> LLM (Gemini/GPT).
*   **Prompt Engineering:** Usar los prompts "System" definidos en el prototipo web que instruyen a la IA actuar como "Diseñador de Juegos Pedagógicos".

### 4.4 Funcionalidad Offline-First
Dado el contexto peruano, la app debe:
1.  Permitir crear toda la evaluación sin internet (usando el mecanismo de Fallback/Plantillas).
2.  Sincronizar con la nube solo cuando haya conexión para potenciar con IA.
3.  Exportar a Word (`.docx`) localmente sin requerir servidor de conversión.

---

## 5. UI/UX: SISTEMA DE DISEÑO "PREMIUM"

Mantener la estética actual es clave para la percepción de valor del docente.

*   **Paleta de Colores:** "Midnight Professional". Fondos oscuros profundos (`#0f172a`) con acentos vibrantes (`#3b82f6`, `#10b981`).
*   **Componentes:**
    *   **Glassmorphism:** Tarjetas semitransparentes con bordes sutiles.
    *   **Steppers:** Indicadores de progreso claros (Paso X de 8).
    *   **Feedback Visual:** Spinners, Badges de "IA Trabajando", Alertas animadas.

---

## 6. REQUISITOS DE EXPORTACIÓN

El "Killer Feature" es la capacidad de sacar la información de la App al mundo físico.

1.  **Formato Word (.docx):**
    *   No usar PDF estático. Los docentes necesitan editar.
    *   El archivo generado debe usar una tabla HTML limpia compatible con Word para maquetar el encabezado y las líneas de respuesta.
2.  **Márgenes:**
    *   Configurar márgenes estrechos (1.27cm o 0.5 pulgada) para maximizar el espacio de las misiones.

---

Este informe consolida todo el conocimiento técnico y de dominio acumulado durante el desarrollo del prototipo web SIED, sirviendo como hoja de ruta fiel para el futuro desarrollo móvil.
