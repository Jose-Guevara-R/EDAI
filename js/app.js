/* =========================================================
   SISTEMA INSTITUCIONAL DE EVALUACIÓN DIAGNÓSTICA – 2026
   NIVEL SECUNDARIA – CNEB – CICLOS VI Y VII
========================================================= */

/* =========================================================
   UTILIDADES BASE
========================================================= */

const BANCO_PEDAGOGICO = {
  "Se comunica oralmente": ["Participa activamente en intercambios orales.", "Expresa ideas con claridad y fluidez.", "Adecúa su texto oral a la situación."],
  "Lee diversos tipos de textos": ["Obtiene información del texto escrito.", "Infiere e interpreta información del texto.", "Reflexiona y evalúa el contenido."],
  "Escribe diversos tipos de textos": ["Adecúa el texto a la situación comunicativa.", "Organiza y desarrolla las ideas de forma coherente.", "Utiliza convenciones del lenguaje escrito."],
  "Inglés": ["Identifica información explícita en textos sencillos.", "Infiere el significado de vocabulario por contexto.", "Produce textos cortos usando estructuras básicas."],
  "Educación para el Trabajo": ["Diseña propuestas de valor creativas.", "Trabaja cooperativamente para lograr objetivos.", "Evalúa los resultados del proyecto de emprendimiento."],
  "Ciencia y Tecnología": ["Indaga mediante métodos científicos.", "Explica el mundo físico basado en conocimientos.", "Diseña y construye soluciones tecnológicas."],
  "Ciencias Sociales": ["Construye interpretaciones históricas.", "Gestiona responsablemente el espacio y el ambiente.", "Gestiona responsablemente los recursos económicos."],
  "Matemática": ["Resuelve problemas de cantidad.", "Resuelve problemas de regularidad y cambio.", "Resuelve problemas de forma, movimiento y localización."],
  "Desarrollo Personal": ["Construye su identidad.", "Convive y participa democratica mente.", "Regula sus emociones en diversas situaciones."]
};

const TUTORIAL_CONTENT = {
  "contexto": {
    tecnico: {
      titulo: "2.1 Enfoque técnico (MINEDU)",
      cuerpo: `El contexto comprende las condiciones socioeconómicas, socioculturales, lingüísticas, digitales y socioemocionales. No se puede interpretar el desempeño sin comprender estas condiciones.`
    },
    real: {
      titulo: "2.2 Como docente real",
      cuerpo: `¿Quiénes son? ¿Cómo viven? ¿Cómo leen? <b>Ejemplo:</b> En 2° secundaria, el 60% se dedica a la agricultura. Pocos tienen libros. El clima es competitivo.`
    }
  },
  "competencias": {
    tecnico: {
      titulo: "3.1 Selección Curricular",
      cuerpo: `Selecciona competencias considerando relevancia y pertinencia. ¿Qué sospecho que es más difícil para ellos?`
    },
    real: {
      titulo: "3.2 Priorización",
      cuerpo: `No evalúes todo. <b>Ejemplo:</b> En Arte, elijo "Aprecia" y "Crea" porque dibujan pero no explican ni relacionan con su cultura.`
    }
  },
  "estandares": {
    tecnico: {
      titulo: "4.1 El Referente",
      cuerpo: `Los estándares son el nivel esperado. Lee qué debería lograr un estudiante según su ciclo (VI o VII).`
    },
    real: {
      titulo: "4.2 Reflexión Docente",
      cuerpo: `¿Realmente hacen eso? <b>Pensamiento alternativo:</b> Si no lo logran, tal vez no han tenido oportunidades suficientes.`
    }
  },
  "situacion": {
    tecnico: {
      titulo: "5.1 Reto Contextualizado",
      cuerpo: `La situación significativa moviliza competencias. No son preguntas aisladas, es un reto cercano a su vida.`
    },
    real: {
      titulo: "5.2 Ejemplo Real",
      cuerpo: `<b>Situación:</b> Festividades agrícolas en tu comunidad. Analiza una manifestación y crea algo que la represente.`
    }
  }
};

async function cargarTutorial() {
  const path = window.location.pathname;
  const pagina = path.split("/").pop().split(".")[0] || "contexto";
  const data = TUTORIAL_CONTENT[pagina];

  if (!data) return;

  const ev = obtenerEvaluacion();

  // Contenedor Técnico (Izquierda)
  const panelTecnico = document.createElement("aside");
  panelTecnico.className = "panel-tutorial panel-tecnico";
  panelTecnico.innerHTML = `
    <h3>🧭 Brújula Técnica</h3>
    <div class="tutorial-content">
      <strong>${data.tecnico.titulo}</strong>
      <p>${data.tecnico.cuerpo}</p>
    </div>
  `;

  // Contenedor Real (Derecha) - Con IA opcional
  const panelReal = document.createElement("aside");
  panelReal.className = "panel-tutorial panel-real";
  panelReal.innerHTML = `
    <div class="ia-badge">✨ Ejemplo personalizado (IA)</div>
    <h3>🍎 Voz Docente</h3>
    <div id="tutorial-real-content" class="tutorial-content">
      <strong>${data.real.titulo}</strong>
      <p>${data.real.cuerpo}</p>
      <p style="font-size:0.85rem; color:#888;"><i>Generando ejemplo específico para ${ev.area}...</i></p>
    </div>
  `;

  // Inyectar en el layout
  const body = document.body;
  const originalMain = document.querySelector("main");

  const layout = document.createElement("div");
  layout.className = "tutorial-layout";

  body.innerHTML = "";
  layout.appendChild(panelTecnico);

  const mainWrapper = document.createElement("div");
  mainWrapper.className = "main-content";
  mainWrapper.appendChild(originalMain);
  layout.appendChild(mainWrapper);

  layout.appendChild(panelReal);
  body.appendChild(layout);

  // Llamada a IA para personalizar el ejemplo real
  try {
    const res = await fetch('/api/ia-examen', { // Reusando endpoint de IA para ejemplos
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grado: ev.grado,
        area: ev.area,
        indicadores: ["Generar un ejemplo real de aplicación de este paso para mi área"]
      })
    });
    const result = await res.json();
    if (result.actividades && result.actividades.length > 0) {
      const container = document.getElementById("tutorial-real-content");

      // Quitar el mensaje de carga
      const loadingMsg = container.querySelector("p[style*='font-size:0.85rem']");
      if (loadingMsg) loadingMsg.remove();

      // Crear contenedor para el ejemplo de la IA
      const aiSection = document.createElement("div");
      aiSection.style.marginTop = "15px";
      aiSection.style.paddingTop = "10px";
      aiSection.style.borderTop = "1px dashed rgba(123, 31, 162, 0.3)";
      aiSection.innerHTML = `
        <small style="color:#7b1fa2; font-weight:bold; display:block; margin-bottom:5px;">✨ Ejemplo sugerido por IA (${ev.area}):</small>
        <div style="font-style: italic; color: #555;">${result.actividades[0].enunciado}</div>
      `;
      container.appendChild(aiSection);
    }
  } catch (e) {
    console.log("Usando ejemplo estático");
  }
}

function iniciarEvaluacion() {
  if (!localStorage.getItem("evaluacionDiagnostica")) {
    const evaluacion = {
      institucion: "",
      area: "",
      grado: "",
      ciclo: "",
      estudiantes: "",
      contexto: {
        socioeconomico: [],
        sociocultural: "",
        socioemocional: "",
        comprensionLectora: ""
      },
      competencias: [],
      estandar: "",
      situacion: "",
      evidencias: [],
      instrumentoDiagnostico: [],
      matrizDiagnostica: []
    };
    localStorage.setItem(
      "evaluacionDiagnostica",
      JSON.stringify(evaluacion)
    );
  }
}

function iniciar() {
  iniciarEvaluacion();
  window.location.href = "datos.html";
}

function obtenerEvaluacion() {
  return JSON.parse(localStorage.getItem("evaluacionDiagnostica"));
}

function guardarEvaluacion(ev) {
  localStorage.setItem(
    "evaluacionDiagnostica",
    JSON.stringify(ev)
  );
}

/* =========================================================
   VALIDACIÓN GRADO – CICLO (OFICIAL)
========================================================= */

const gradoCicloValido = {
  "1": "VI",
  "2": "VI",
  "3": "VII",
  "4": "VII",
  "5": "VII"
};

/* =========================================================
   MAPAS CURRICULARES OFICIALES – CNEB
========================================================= */

/* ---------- COMPETENCIAS POR ÁREA ---------- */

const competenciasPorArea = {
  "Comunicación": [
    "Se comunica oralmente en su lengua materna",
    "Lee diversos tipos de textos escritos",
    "Escribe diversos tipos de textos"
  ],
  "Matemática": [
    "Resuelve problemas de cantidad",
    "Resuelve problemas de regularidad, equivalencia y cambio",
    "Resuelve problemas de forma, movimiento y localización",
    "Resuelve problemas de gestión de datos e incertidumbre"
  ],
  "Ciencia y Tecnología": [
    "Indaga mediante métodos científicos",
    "Explica el mundo físico basándose en conocimientos científicos",
    "Diseña y construye soluciones tecnológicas"
  ],
  "Ciencias Sociales": [
    "Construye interpretaciones históricas",
    "Gestiona responsablemente el espacio y el ambiente",
    "Gestiona responsablemente los recursos económicos"
  ],
  "Desarrollo Personal, Ciudadanía y Cívica": [
    "Construye su identidad",
    "Convive y participa democráticamente",
    "Delibera sobre asuntos públicos"
  ],
  "Educación Física": [
    "Se desenvuelve de manera autónoma a través de su motricidad",
    "Asume una vida saludable",
    "Interactúa a través de sus habilidades sociomotrices"
  ],
  "Arte y Cultura": [
    "Aprecia de manera crítica manifestaciones artístico-culturales",
    "Crea proyectos desde los lenguajes artísticos"
  ],
  "Educación para el Trabajo": [
    "Gestiona proyectos de emprendimiento económico o social"
  ],
  "Inglés": [
    "Se comunica oralmente en inglés",
    "Lee diversos tipos de textos en inglés",
    "Escribe diversos tipos de textos en inglés"
  ],
  "Educación Religiosa": [
    "Construye su identidad como persona humana, amada por Dios",
    "Asume la experiencia del encuentro personal y comunitario con Dios"
  ]
};

/* ---------- ESTÁNDARES POR ÁREA Y CICLO ---------- */

const estandaresPorAreaYCiclo = {
  "Comunicación": {
    "VI": "Interpreta y produce textos orales y escritos considerando su propósito y contexto.",
    "VII": "Analiza críticamente textos complejos y argumenta con coherencia."
  },
  "Matemática": {
    "VI": "Resuelve problemas aplicando estrategias matemáticas diversas.",
    "VII": "Modela y resuelve problemas complejos con rigor matemático."
  },
  "Ciencia y Tecnología": {
    "VI": "Indaga y explica fenómenos naturales mediante evidencias.",
    "VII": "Diseña soluciones tecnológicas fundamentadas científicamente."
  },
  "Ciencias Sociales": {
    "VI": "Construye interpretaciones históricas y gestiona el espacio.",
    "VII": "Analiza procesos históricos y problemáticas territoriales."
  },
  "Desarrollo Personal, Ciudadanía y Cívica": {
    "VI": "Construye su identidad y convive democráticamente.",
    "VII": "Delibera y actúa éticamente frente a asuntos públicos."
  },
  "Educación Física": {
    "VI": "Se desenvuelve de manera autónoma y asume hábitos saludables.",
    "VII": "Interactúa estratégicamente mediante habilidades sociomotrices."
  },
  "Arte y Cultura": {
    "VI": "Aprecia y crea manifestaciones artístico-culturales.",
    "VII": "Analiza críticamente y desarrolla proyectos artísticos."
  },
  "Educación para el Trabajo": {
    "VI": "Identifica oportunidades de emprendimiento.",
    "VII": "Gestiona proyectos innovadores y sostenibles."
  },
  "Inglés": {
    "VI": "Comprende y produce mensajes sencillos en inglés.",
    "VII": "Interactúa en inglés con mayor fluidez."
  },
  "Educación Religiosa": {
    "VI": "Construye su identidad desde la experiencia de fe.",
    "VII": "Asume una vivencia ética y trascendente."
  }
};

/* ---------- SITUACIONES SIGNIFICATIVAS ---------- */

const situacionesPorAreaYCiclo = {

  "Comunicación": {
    "VI": "Los estudiantes analizan textos orales y escritos relacionados con situaciones cotidianas de su comunidad para identificar información, ideas principales y propósito comunicativo.",
    "VII": "Los estudiantes interpretan y producen textos orales y escritos sobre problemáticas sociales actuales, argumentando sus ideas con coherencia y adecuación al contexto."
  },

  "Matemática": {
    "VI": "Los estudiantes resuelven situaciones problemáticas vinculadas a la economía familiar, el comercio local y la organización de recursos, aplicando estrategias matemáticas.",
    "VII": "Los estudiantes modelan y resuelven situaciones problemáticas complejas del entorno social y científico, utilizando relaciones algebraicas y representaciones matemáticas."
  },

  "Ciencia y Tecnología": {
    "VI": "Los estudiantes indagan fenómenos relacionados con el ambiente, la salud y el uso de recursos naturales en su comunidad, formulando explicaciones basadas en evidencias.",
    "VII": "Los estudiantes analizan problemáticas ambientales y científicas, proponiendo explicaciones y soluciones tecnológicas fundamentadas en conocimientos científicos."
  },

  "Ciencias Sociales": {
    "VI": "Los estudiantes analizan hechos y procesos históricos locales y nacionales para comprender cambios y permanencias en su comunidad.",
    "VII": "Los estudiantes interpretan procesos históricos y problemáticas territoriales y sociales, reflexionando sobre su impacto en la sociedad actual."
  },

  "Desarrollo Personal, Ciudadanía y Cívica": {
    "VI": "Los estudiantes reflexionan sobre situaciones de convivencia escolar y familiar para reconocer su identidad, emociones y responsabilidades como ciudadanos.",
    "VII": "Los estudiantes analizan situaciones de participación ciudadana y convivencia democrática, argumentando decisiones éticas frente a asuntos públicos."
  },

  "Educación Física": {
    "VI": "Los estudiantes participan en actividades físicas y juegos motores para evaluar su condición física, coordinación y hábitos saludables.",
    "VII": "Los estudiantes aplican estrategias motrices y de trabajo en equipo en actividades deportivas, valorando la cooperación y el cuidado de la salud."
  },

  "Arte y Cultura": {
    "VI": "Los estudiantes aprecian y crean producciones artísticas inspiradas en manifestaciones culturales de su localidad, expresando ideas y emociones.",
    "VII": "Los estudiantes analizan manifestaciones artísticas y desarrollan proyectos creativos que expresan identidad cultural y problemáticas sociales."
  },

  "Educación para el Trabajo": {
    "VI": "Los estudiantes identifican necesidades u oportunidades de su entorno y proponen ideas de emprendimiento económico o social.",
    "VII": "Los estudiantes diseñan y gestionan proyectos de emprendimiento considerando la innovación, sostenibilidad y viabilidad."
  },

  "Inglés": {
    "VI": "Los estudiantes comprenden y producen mensajes orales y escritos simples en inglés relacionados con situaciones cotidianas.",
    "VII": "Los estudiantes interactúan en inglés comprendiendo y produciendo textos orales y escritos sobre temas de interés personal y social."
  },

  "Educación Religiosa": {
    "VI": "Los estudiantes reflexionan sobre experiencias de vida cotidiana a la luz de valores cristianos para fortalecer su identidad personal.",
    "VII": "Los estudiantes analizan situaciones personales y sociales desde una perspectiva ética y trascendente, promoviendo el bien común."
  }

};


/* ---------- EVIDENCIAS POR COMPETENCIA ---------- */

const evidenciasPorCompetencia = {

  // COMUNICACIÓN
  "Se comunica oralmente en su lengua materna": [
    "Expresa ideas de manera clara y coherente en situaciones orales.",
    "Adecúa su discurso al interlocutor y contexto."
  ],

  "Lee diversos tipos de textos escritos": [
    "Identifica información explícita e implícita en textos.",
    "Explica el propósito y el sentido global del texto."
  ],

  "Escribe diversos tipos de textos": [
    "Organiza ideas de forma coherente al escribir.",
    "Utiliza recursos lingüísticos básicos de manera adecuada."
  ],

  // MATEMÁTICA
  "Resuelve problemas de cantidad": [
    "Plantea estrategias para resolver problemas numéricos.",
    "Justifica el procedimiento y el resultado obtenido."
  ],

  "Resuelve problemas de regularidad, equivalencia y cambio": [
    "Reconoce patrones y relaciones entre cantidades.",
    "Utiliza expresiones algebraicas sencillas."
  ],

  "Resuelve problemas de forma, movimiento y localización": [
    "Representa objetos y relaciones espaciales.",
    "Utiliza conceptos geométricos en situaciones reales."
  ],

  // CIENCIA Y TECNOLOGÍA
  "Indaga mediante métodos científicos": [
    "Formula preguntas investigables.",
    "Registra y analiza información obtenida."
  ],

  "Explica el mundo físico basándose en conocimientos científicos": [
    "Relaciona conceptos científicos con situaciones reales.",
    "Sustenta explicaciones con evidencias."
  ],

  // CIENCIAS SOCIALES
  "Construye interpretaciones históricas": [
    "Identifica causas y consecuencias de hechos históricos.",
    "Relaciona procesos del pasado con el presente."
  ],

  "Gestiona responsablemente el espacio y el ambiente": [
    "Analiza el uso de recursos en su entorno.",
    "Propone acciones para el cuidado del ambiente."
  ],

  // DPCC
  "Construye su identidad": [
    "Reconoce sus emociones y fortalezas personales.",
    "Reflexiona sobre situaciones que influyen en su identidad."
  ],

  "Convive y participa democráticamente": [
    "Propone normas para la convivencia.",
    "Argumenta decisiones en situaciones de conflicto."
  ],

  // EDUCACIÓN FÍSICA
  "Se desenvuelve de manera autónoma a través de su motricidad": [
    "Ejecuta movimientos coordinados y controlados.",
    "Evalúa su desempeño físico."
  ],

  // ARTE Y CULTURA
  "Aprecia de manera crítica manifestaciones artístico-culturales": [
    "Describe elementos de una obra artística.",
    "Expresa opiniones fundamentadas sobre manifestaciones culturales."
  ],

  "Crea proyectos desde los lenguajes artísticos": [
    "Elabora una producción artística coherente con una intención.",
    "Explica el proceso creativo seguido."
  ],

  // EPT
  "Gestiona proyectos de emprendimiento económico o social": [
    "Identifica una necesidad u oportunidad del entorno.",
    "Propone acciones para desarrollar un proyecto."
  ],

  // INGLÉS (CORREGIDO)
  "Se comunica oralmente en inglés": [
    "Comprende mensajes orales en inglés relacionados con situaciones cotidianas.",
    "Interactúa usando expresiones básicas y vocabulario frecuente."
  ],

  "Lee diversos tipos de textos en inglés": [
    "Identifica información explícita en textos escritos en inglés.",
    "Relaciona ideas principales en textos breves de uso cotidiano."
  ],

  "Escribe diversos tipos de textos en inglés": [
    "Escribe frases y textos cortos en inglés con coherencia básica.",
    "Utiliza vocabulario y estructuras gramaticales simples."
  ],


  // EDUCACIÓN RELIGIOSA
  "Construye su identidad como persona humana, amada por Dios": [
    "Reflexiona sobre experiencias personales desde valores.",
    "Expresa compromisos personales y comunitarios."
  ]

};


/* =========================================================
   PASO C – GENERACIÓN DE ÍTEMS DIAGNÓSTICOS
========================================================= */

function generarItemsDiagnosticos(ev) {
  const banco = bancoItemsPorArea[ev.area] || [];

  // recomendación pedagógica institucional
  const recomendados =
    ev.area === "Matemática" ||
      ev.area === "Ciencia y Tecnología"
      ? 8
      : 6;

  return banco.slice(0, recomendados);
}


/* =========================================================
   MODELO AUTOMÁTICO DE SELECCIÓN DE INSTRUMENTO
========================================================= */

function sugerirTipoInstrumento(ev) {
  const area = ev.area;

  // COMUNICACIÓN
  if (area === "Comunicación") {
    return "Cuestionario de comprensión + Rúbrica analítica";
  }

  // MATEMÁTICA
  if (area === "Matemática") {
    return "Prueba escrita con problemas contextualizados";
  }

  // CIENCIA Y TECNOLOGÍA
  if (area === "Ciencia y Tecnología") {
    return "Cuestionario aplicado + Lista de cotejo";
  }

  // CIENCIAS SOCIALES
  if (area === "Ciencias Sociales") {
    return "Cuestionario interpretativo + Escala valorativa";
  }

  // DESARROLLO PERSONAL, CIUDADANÍA Y CÍVICA
  if (area === "Desarrollo Personal, Ciudadanía y Cívica") {
    return "Guía de observación + Escala valorativa";
  }

  // EDUCACIÓN FÍSICA
  if (area === "Educación Física") {
    return "Lista de cotejo de desempeño motor";
  }

  // ARTE Y CULTURA
  if (area === "Arte y Cultura") {
    return "Rúbrica de apreciación y producción artística";
  }

  // EDUCACIÓN PARA EL TRABAJO
  if (area === "Educación para el Trabajo") {
    return "Lista de cotejo para desempeño emprendedor";
  }

  // INGLÉS
  if (area === "Inglés") {
    return "Cuestionario comunicativo + Rúbrica básica";
  }

  // EDUCACIÓN RELIGIOSA
  if (area === "Educación Religiosa") {
    return "Guía de reflexión + Escala valorativa";
  }

  // RESPALDO
  return "Instrumento diagnóstico mixto";
}


/* =========================================================
   ORQUESTADOR DEL PROCESO DIAGNÓSTICO (A → B → C)
========================================================= */

function ejecutarEvaluacionDiagnostica() {
  const ev = obtenerEvaluacion();

  // PASO A: definir instrumento
  ev.tipoInstrumento = sugerirTipoInstrumento(ev);

  // PASO B: obtener banco de ítems
  ev.bancoItems = bancoItemsPorArea[ev.area] || [];

  // PASO C: generar ítems diagnósticos
  ev.itemsDiagnosticos = generarItemsDiagnosticos(ev);

  guardarEvaluacion(ev);
}



/* =========================================================
   PASO 1 – DATOS INSTITUCIONALES
========================================================= */

function validarDatosInstitucionales() {
  const grado = document.getElementById("grado").value;
  const ciclo = document.getElementById("ciclo").value;
  if (gradoCicloValido[grado] !== ciclo) {
    alert(`El grado ${grado} pertenece al ${gradoCicloValido[grado]}`);
    return false;
  }
  return true;
}

// La convertimos en ASYNC para poder esperar la respuesta de la nube
async function guardarDatosInstitucionales() {
  if (!validarDatosInstitucionales()) return;

  // Recogemos los datos básicos + los hallazgos de insumos
  const datos = {
    institucion: document.getElementById("institucion").value,
    area: document.getElementById("area").value,
    grado: document.getElementById("grado").value,
    ciclo: document.getElementById("ciclo").value,
    estudiantes: document.getElementById("estudiantes").value,
    // Nuevos campos de insumos
    insumos: {
      siagie: { checked: document.getElementById("check-siagie").checked, nota: document.getElementById("nota-siagie").value },
      socioemocional: { checked: document.getElementById("check-socioemocional").checked, nota: document.getElementById("nota-socioemocional").value },
      portafolio: { checked: document.getElementById("check-portafolio").checked, nota: document.getElementById("nota-portafolio").value },
      observacion: { checked: document.getElementById("check-observacion").checked, nota: document.getElementById("nota-observacion").value }
    }
  };

  // ACTUALIZACIÓN: Guardar espejo local para navegación inmediata
  let evLocal = obtenerEvaluacion() || {};
  evLocal = { ...evLocal, ...datos };
  localStorage.setItem("evaluacionDiagnostica", JSON.stringify(evLocal));

  // CAMBIO CLAVE: Enviamos a la API
  try {
    const btn = document.querySelector(".btn-primary");
    btn.textContent = "Guardando en nube..."; // Feedback visual
    btn.disabled = true;

    const respuesta = await fetch('/api/evaluaciones', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });

    if (respuesta.ok) {
      const resultado = await respuesta.json();
      // Guardamos el ID que nos dio la base de datos para usarlo en los siguientes pasos
      localStorage.setItem("evaluacion_id_actual", resultado.id);
      window.location.href = "contexto.html";
    } else {
      alert("Error al guardar en el servidor.");
    }

  } catch (error) {
    console.error(error);
    alert("Error de conexión.");
  }
}
/* =========================================================
   PASO 2 – CONTEXTO
========================================================= */

async function guardarContexto() {
  const idEvaluacion = localStorage.getItem("evaluacion_id_actual");

  if (!idEvaluacion) {
    alert("Error: No se encontró la evaluación actual. Vuelve al inicio.");
    return;
  }

  // Recopilar datos del DOM
  const contextoData = {
    id: idEvaluacion,
    contexto_socioeconomico: Array.from(document.querySelectorAll(".socioeco:checked")).map(c => c.value),
    contexto_sociocultural: document.getElementById("sociocultural").value,
    contexto_comprension_lectora: document.getElementById("comprension").value,
    contexto_clima_aula: document.querySelector("input[name='clima']:checked")?.value || ""
  };

  try {
    const btn = document.querySelector(".btn-primary");
    if (btn) {
      btn.textContent = "Guardando...";
      btn.disabled = true;
    }

    const respuesta = await fetch('/api/evaluaciones', {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contextoData)
    });

    if (respuesta.ok) {
      // ACTUALIZACIÓN: También guardamos localmente para la IA
      const ev = obtenerEvaluacion();
      ev.contexto = {
        socioeconomico: contextoData.contexto_socioeconomico,
        sociocultural: contextoData.contexto_sociocultural,
        comprensionLectora: contextoData.contexto_comprension_lectora,
        bienestar_emocional: contextoData.contexto_clima_aula
      };
      guardarEvaluacion(ev);

      window.location.href = "competencias.html";
    } else {
      alert("Error al guardar contexto en la nube.");
      if (btn) btn.disabled = false;
    }
  } catch (error) {
    console.error(error);
    alert("Error de conexión");
  }
}

/* =========================================================
   PASO 3 – COMPETENCIAS
========================================================= */

function cargarCompetencias() {
  const ev = obtenerEvaluacion();
  const cont = document.getElementById("listaCompetencias");
  cont.innerHTML = "";

  (competenciasPorArea[ev.area] || []).forEach(comp => {
    cont.innerHTML += `
      <label>
        <input type="checkbox" class="competencia" value="${comp}">
        ${comp}
      </label>`;
  });
}

async function guardarCompetencias() {
  const ev = obtenerEvaluacion(); // Leemos el local para saber cuáles se marcaron
  const seleccionadas = Array.from(document.querySelectorAll(".competencia:checked")).map(c => c.value);

  const idEvaluacion = localStorage.getItem("evaluacion_id_actual");

  // Validar
  if (seleccionadas.length === 0) {
    alert("Selecciona al menos una competencia");
    return;
  }

  // Guardar en espejo local (para navegación rápida)
  ev.competencias = seleccionadas;
  localStorage.setItem("evaluacionDiagnostica", JSON.stringify(ev));

  // Guardar en Nube (Neon)
  try {
    const btn = document.querySelector(".btn-primary");
    if (btn) { btn.textContent = "Guardando..."; btn.disabled = true; }

    await fetch('/api/indicadores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        evaluacion_id: idEvaluacion,
        competencias: seleccionadas,
        area: ev.area
      })
    });

    window.location.href = "estandares.html";

  } catch (error) {
    console.error(error);
    alert("Error de conexión");
    if (btn) btn.disabled = false;
  }
}

/* =========================================================
   PASO 4 – ESTÁNDAR
========================================================= */

function cargarEstandarAutomatico() {
  const ev = obtenerEvaluacion();
  document.getElementById("estandar").value =
    estandaresPorAreaYCiclo[ev.area]?.[ev.ciclo] || "";
}

function irASituacion() {
  const ev = obtenerEvaluacion();
  ev.estandar = document.getElementById("estandar").value;
  guardarEvaluacion(ev);
  window.location.href = "situacion.html";
}

/* =========================================================
   PASO 5 – SITUACIÓN
========================================================= */

function sugerirSituacionAprendizaje() {
  const ev = obtenerEvaluacion();
  document.getElementById("situacion").value =
    situacionesPorAreaYCiclo[ev.area]?.[ev.ciclo] || "";
}

function irAEvidencias() {
  const ev = obtenerEvaluacion();
  ev.situacion = document.getElementById("situacion").value;
  guardarEvaluacion(ev);
  window.location.href = "evidencias.html";
}

/* =========================================================
   PASO 6 – EVIDENCIAS
========================================================= */

async function sugerirEvidencias() {
  const ev = obtenerEvaluacion();
  const btn = document.querySelector("button[onclick='sugerirEvidencias()']"); // Selector más seguro
  const txtArea = document.getElementById("evidencias");

  if (btn) {
    btn.innerHTML = "✨ <b>Analizando Estándar y Situación...</b>";
    btn.disabled = true;
  }

  try {
    // 1. Intentar con IA primero
    const res = await fetch('/api/ia-evidencias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        area: ev.area,
        grado: ev.grado,
        ciclo: ev.ciclo,
        competencias: ev.competencias,
        estandar: ev.estandar,
        situacion: ev.situacion
      })
    });

    const data = await res.json();

    if (data.sugerencias) {
      console.log("[IA SUCCESS] Evidencias recibidas de Gemini");
      if (txtArea) {
        // Limpiar formato markdown si viene con ** o *
        let textoLimpio = data.sugerencias.replace(/\*\*/g, "").replace(/\*/g, "•");
        txtArea.value = textoLimpio;
      }
      if (btn) btn.innerHTML = "✨ IA Generativa (Éxito)";
    } else {
      throw new Error("No se recibieron sugerencias de la IA");
    }

  } catch (error) {
    console.warn("[IA FAIL] Fallo IA Evidencias, usando banco local:", error);

    // 2. Fallback al banco local si falla la IA
    let sugerencias = [];
    ev.competencias.forEach(comp => {
      for (let key in BANCO_PEDAGOGICO) {
        if (comp.includes(key) || key.includes(comp)) {
          sugerencias = sugerencias.concat(BANCO_PEDAGOGICO[key]);
        }
      }
    });

    if (sugerencias.length === 0) {
      sugerencias = ["Producción de un texto o proyecto.", "Exposición de procesos seguidos.", "Portafolio de evidencias críticas."];
    }

    if (txtArea) txtArea.value = sugerencias.join("\n");
    if (btn) btn.innerHTML = "⚠️ Modo Offline (Respaldo)";
  } finally {
    setTimeout(() => {
      if (btn) {
        btn.innerHTML = "🔁 Regenerar Sugerencia Pedagógica";
        btn.disabled = false;
      }
    }, 3000); // Mantener el estado visual unos segundos
  }
}

function guardarEvidencias() {
  const ev = obtenerEvaluacion();
  const textoEvidencias = document.getElementById("evidencias").value;
  ev.evidenciasSeleccionadas = textoEvidencias.split("\n").filter(e => e.trim() !== "");

  // También lo guardamos en el campo evidencias original para compatibilidad
  ev.evidencias = ev.evidenciasSeleccionadas;

  guardarEvaluacion(ev);
}


/* =========================================================
   MODELO AUTOMÁTICO DE SELECCIÓN DE INSTRUMENTOS
========================================================= */

function clasificarCompetencia(competencia) {
  if (competencia.includes("Lee")) return "comprension";
  if (competencia.includes("Escribe")) return "produccion";
  if (competencia.includes("Resuelve")) return "resolucion";
  if (competencia.includes("Se comunica oralmente")) return "comunicacion_oral";
  if (competencia.includes("Convive") || competencia.includes("identidad"))
    return "actitudinal";
  if (competencia.includes("motricidad") || competencia.includes("física"))
    return "motora";
  return "general";
}

function seleccionarInstrumentosAutomaticos() {
  const ev = obtenerEvaluacion();
  const tiposDetectados = new Set();

  ev.competencias.forEach(c => {
    tiposDetectados.add(clasificarCompetencia(c));
  });

  const instrumentos = [];

  // Reglas por tipo
  if (tiposDetectados.has("comprension")) {
    instrumentos.push({
      tipo: "Cuestionario diagnóstico",
      finalidad: "Evaluar comprensión lectora",
      registro: "Respuestas escritas"
    });
  }

  if (tiposDetectados.has("produccion")) {
    instrumentos.push({
      tipo: "Rúbrica diagnóstica",
      finalidad: "Valorar producción escrita u oral",
      registro: "Niveles de desempeño"
    });
  }

  if (tiposDetectados.has("resolucion")) {
    instrumentos.push({
      tipo: "Prueba práctica",
      finalidad: "Evaluar resolución de problemas",
      registro: "Procedimientos y resultados"
    });
  }

  if (tiposDetectados.has("comunicacion_oral")) {
    instrumentos.push({
      tipo: "Guía de observación",
      finalidad: "Observar desempeño comunicativo",
      registro: "Lista de cotejo"
    });
  }

  if (tiposDetectados.has("actitudinal")) {
    instrumentos.push({
      tipo: "Escala de valoración",
      finalidad: "Evaluar actitudes y convivencia",
      registro: "Escala descriptiva"
    });
  }

  // Regla transversal de comprensión lectora
  if (
    ev.contexto.comprensionLectora &&
    ev.contexto.comprensionLectora.toLowerCase().includes("dificult")
  ) {
    if (!instrumentos.some(i => i.tipo.includes("Cuestionario"))) {
      instrumentos.push({
        tipo: "Cuestionario de comprensión lectora",
        finalidad: "Identificar nivel lector",
        registro: "Respuestas cerradas y abiertas"
      });
    }
  }

  ev.instrumentosSeleccionados = instrumentos;
  guardarEvaluacion(ev);
}


/* =========================================================
   TEXTO AUTOMÁTICO DEL INFORME DIAGNÓSTICO
========================================================= */

function generarTextoInforme() {
  const ev = obtenerEvaluacion();

  let texto = `
La presente evaluación diagnóstica tiene como finalidad identificar el nivel de desarrollo de las competencias del área de ${ev.area} en los estudiantes del ${ev.grado}, ${ev.ciclo}, al inicio del año escolar 2026.

Esta evaluación es de carácter formativo y exploratorio, y permitirá reconocer fortalezas y necesidades de aprendizaje para orientar la planificación pedagógica.
`;

  texto += `\nInstrumentos de evaluación seleccionados:\n`;

  ev.instrumentosSeleccionados.forEach((inst, i) => {
    texto += `
${i + 1}. ${inst.tipo}: utilizado para ${inst.finalidad}. 
Tipo de registro: ${inst.registro}.
`;
  });

  texto += `
Los resultados obtenidos permitirán ajustar las estrategias metodológicas y promover una atención pertinente a la diversidad del aula.
`;

  ev.textoInforme = texto;
  guardarEvaluacion(ev);
}

/* =========================================================
   CREACIÓN DEL INSTRUMENTO REAL
========================================================= */

function crearInstrumentoReal() {
  const ev = obtenerEvaluacion();
  const instrumento = [];

  ev.evidencias.forEach((evidencia, index) => {
    instrumento.push({
      item: index + 1,
      evidencia: evidencia,
      niveles: {
        inicio: "No logra el desempeño descrito",
        proceso: "Logra el desempeño con apoyo",
        logro: "Logra el desempeño de manera autónoma"
      }
    });
  });

  ev.instrumentoDiagnostico = instrumento;
  ev.instrumento = instrumento; // Sincronizar ambos nombres por si acaso
  guardarEvaluacion(ev);
}




/* =========================================================
   PASO 7 – INSTRUMENTO DIAGNÓSTICO
========================================================= */


async function generarInstrumentoDiagnostico() {
  const ev = obtenerEvaluacion();
  const idEvaluacion = localStorage.getItem("evaluacion_id_actual");

  // FUENTE DE VERDAD: Usar las actividades reales de la ficha si existen
  let listaCriterios = [];

  if (ev.actividadesGeneradas && ev.actividadesGeneradas.length > 0) {
    listaCriterios = ev.actividadesGeneradas.map((act, i) =>
      `Misión ${i + 1}: ${act.titulo} (En base a: ${act.indicador})`
    );
  } else {
    // Fallback si no hay ficha generada aún
    let criteriosRaw = ev.criterios || "";
    if (criteriosRaw.trim()) {
      listaCriterios = criteriosRaw.split('\n').map(l => l.replace(/^[0-9.-•*]\s*/, '').trim()).filter(l => l.length > 5);
    }
    if (listaCriterios.length === 0) {
      listaCriterios = ev.evidenciasSeleccionadas || ev.evidencias || ["Desarrollo de competencias"];
    }
  }

  showLoading("IA redactando descriptores de nivel para cada Misión de tu ficha...");

  try {
    const res = await fetch('/api/ia-rubrica', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        area: ev.area,
        grado: ev.grado,
        criterios: listaCriterios
      })
    });

    const data = await res.json();
    if (data.rubrica) {
      ev.instrumentoDiagnostico = data.rubrica.map(item => ({
        competencia: ev.area || "General",
        evidencia: item.criterio,
        inicio: item.inicio,
        proceso: item.proceso,
        logro: item.logro
      }));
    } else {
      throw new Error("No se recibió rúbrica de la IA");
    }
  } catch (err) {
    console.warn("Fallo IA Rubrica, usando fallback:", err);
    ev.instrumentoDiagnostico = listaCriterios.map(c => ({
      competencia: ev.area || "General",
      evidencia: c,
      inicio: "Nivel Inicial",
      proceso: "En Proceso",
      logro: "Logro Esperado"
    }));
  }

  guardarEvaluacion(ev);
  hideLoading();

  // Sincronización controlada: Evitamos inundar la BD
  const ultimaSincro = localStorage.getItem(`ultimo_sync_${idEvaluacion}`);
  const ahora = Date.now();

  // Solo sincronizar si han pasado más de 10 segundos desde la última vez
  if (ultimaSincro && (ahora - ultimaSincro < 10000)) {
    console.log("Sincronización en la nube omitida (demasiado frecuente)");
    return;
  }
  localStorage.setItem(`ultimo_sync_${idEvaluacion}`, ahora);

  try {
    fetch('/api/generar-instrumento', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        evaluacion_id: idEvaluacion,
        evidencias_texto: listaCriterios
      })
    });
  } catch (e) {
    console.error("Cloud Sync Error:", e);
  }
}


function mostrarInstrumento() {
  const ev = obtenerEvaluacion();
  const tbody = document.getElementById("tablaInstrumento");

  tbody.innerHTML = "";

  if (!ev.instrumento || ev.instrumento.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5">No se generó el instrumento.</td>
      </tr>`;
    return;
  }

  ev.instrumento.forEach((item, index) => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.evidencia}</td>
      <td>${item.niveles.inicio}</td>
      <td>${item.niveles.proceso}</td>
      <td>${item.niveles.logro}</td>
    `;

    tbody.appendChild(fila);
  });
}


/* =========================================================
   PASO 8 – MATRIZ DIAGNÓSTICA
========================================================= */

function generarMatrizDiagnostica() {
  const ev = obtenerEvaluacion();
  ev.matrizDiagnostica = [];

  ev.competencias.forEach(c => {
    ev.evidencias.forEach(e => {
      ev.matrizDiagnostica.push({
        competencia: c,
        evidencia: e,
        nivel: "Diagnóstico"
      });
    });
  });

  guardarEvaluacion(ev);
}

/* =========================================================
   EXPORTAR INSTRUMENTO PDF
========================================================= */

function exportarInstrumentoPDF() {
  const elemento = document.getElementById('exportArea');
  if (!elemento) {
    alert("No se encontró el área de exportación.");
    return;
  }

  // Feedback visual premium
  const btn = event?.target?.closest('button');
  const originalBtnText = btn ? btn.innerHTML : "Exportar PDF";
  if (btn) {
    btn.innerHTML = "⏳ GENERANDO DOCUMENTO...";
    btn.disabled = true;
  }

  const opt = {
    margin: [0, 0, 0, 0],
    filename: 'SIED_Instrumento_Evaluacion_2026.pdf',
    image: { type: 'jpeg', quality: 1 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      windowWidth: 800, // ANCHO EXACTO PARA EVITAR CORTES
      scrollX: 0,
      scrollY: 0
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  window.html2pdf().set(opt).from(elemento).save().then(() => {
    if (btn) {
      btn.innerHTML = originalBtnText;
      btn.disabled = false;
    }
  }).catch(err => {
    console.error("Error PDF:", err);
    if (btn) {
      btn.innerHTML = originalBtnText;
      btn.disabled = false;
    }
  });
}


/* =========================================================
   COMPRENSIÓN LECTORA TRANSVERSAL (EJE INSTITUCIONAL)
========================================================= */

const evidenciasComprensionLectora = [
  "Comprende consignas escritas relacionadas con la actividad.",
  "Identifica información relevante en textos breves del área.",
  "Interpreta instrucciones, cuadros, gráficos o esquemas."
];

function integrarComprensionLectora() {
  const ev = obtenerEvaluacion();

  evidenciasComprensionLectora.forEach(e => {
    if (!ev.evidencias.includes(e)) {
      ev.evidencias.push(e);
    }
  });

  guardarEvaluacion(ev);
}

/* =========================================================
   NAVEGACIÓN ENTRE PASOS
========================================================= */

function irAInforme() {
  generarMatrizDiagnostica();
  window.location.href = "informe.html";
}

/* =========================================================
   EXPORTAR INFORME DIAGNÓSTICO PDF – PASO FINAL
========================================================= */

function exportarInformePDF() {

  if (!window.jspdf || !window.jspdf.jsPDF) {
    alert("La librería jsPDF no se ha cargado correctamente.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const ev = obtenerEvaluacion();

  let y = 10;

  doc.setFontSize(14);
  doc.text("INFORME DE EVALUACIÓN DIAGNÓSTICA – 2026", 10, y);
  y += 10;

  doc.setFontSize(11);
  doc.text(`Institución Educativa: ${ev.institucion}`, 10, y); y += 7;
  doc.text(`Área: ${ev.area}`, 10, y); y += 7;
  doc.text(`Grado: ${ev.grado} – ${ev.ciclo}`, 10, y); y += 10;

  doc.text("1. Contexto de aprendizaje", 10, y); y += 7;
  doc.text(`• Socioeconómico: ${ev.contexto.socioeconomico.join(", ")}`, 12, y); y += 6;
  doc.text(`• Sociocultural: ${ev.contexto.sociocultural}`, 12, y); y += 6;
  doc.text(`• Socioemocional: ${ev.contexto.socioemocional}`, 12, y); y += 6;
  doc.text(`• Comprensión lectora: ${ev.contexto.comprensionLectora}`, 12, y); y += 10;

  doc.text("2. Competencias evaluadas", 10, y); y += 7;
  ev.competencias.forEach(c => {
    doc.text(`- ${c}`, 12, y);
    y += 6;
  });

  y += 6;
  doc.text("3. Situación significativa", 10, y); y += 7;
  doc.text(ev.situacion, 12, y); y += 10;

  doc.text("4. Evidencias de aprendizaje", 10, y); y += 7;
  ev.evidencias.forEach(e => {
    doc.text(`- ${e}`, 12, y);
    y += 6;
  });

  doc.addPage();
  y = 10;

  doc.text("5. Instrumento diagnóstico", 10, y); y += 8;
  const itemsInst = ev.instrumento || ev.instrumentoDiagnostico || [];
  itemsInst.forEach(item => {
    if (y > 270) { doc.addPage(); y = 10; }
    doc.text(`${item.item}. ${item.evidencia}`, 10, y); y += 6;
    doc.setFontSize(9);
    doc.text(`Inicio: ${item.niveles.inicio}`, 15, y); y += 5;
    doc.text(`Proceso: ${item.niveles.proceso}`, 15, y); y += 5;
    doc.text(`Logro: ${item.niveles.logro}`, 15, y); y += 8;
    doc.setFontSize(11);
  });

  doc.save("Informe_Evaluacion_Diagnostica_2026.pdf");
}


function irAInforme() {
  seleccionarInstrumentosAutomaticos();
  generarTextoInforme();
  crearInstrumentoReal();
  generarMatrizDiagnostica();
  window.location.href = "informe.html";
}


/* =========================================================
   PASO C – GENERACIÓN AUTOMÁTICA DE ÍTEMS
========================================================= */

function generarItemsDiagnosticos(cantidadSolicitada = null) {
  const ev = obtenerEvaluacion();

  const area = ev.area;
  const ciclo = ev.ciclo;
  const competencias = ev.competencias;

  let itemsDisponibles = [];

  competencias.forEach(comp => {
    const itemsComp =
      bancoItemsDiagnosticos?.[area]?.[comp]?.[ciclo] || [];
    itemsDisponibles = itemsDisponibles.concat(itemsComp);
  });

  // Eliminar duplicados
  itemsDisponibles = [...new Set(itemsDisponibles)];

  // Recomendación automática
  const recomendados = Math.min(
    itemsDisponibles.length,
    area === "Comunicación" || area === "Matemática" ? 8 : 5
  );

  const cantidadFinal = cantidadSolicitada || recomendados;

  // Selección equilibrada
  const itemsSeleccionados = itemsDisponibles.slice(0, cantidadFinal);

  ev.itemsDiagnosticos = itemsSeleccionados.map((item, i) => ({
    numero: i + 1,
    enunciado: item,
    tipo: sugerirTipoInstrumento(ev),
    competencia: competencias.join(" / ")
  }));

  guardarEvaluacion(ev);
}

/* =========================================================
   PASO NUEVO – MATRIZ DE RESULTADOS (PREMIUM)
   ========================================================= */

async function cargarMatrizResultados() {
  const idEvaluacion = localStorage.getItem("evaluacion_id_actual");
  const contenedor = document.getElementById("contenedorMatriz");

  try {
    const res = await fetch(`/api/resultados?evaluacion_id=${idEvaluacion}`);
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Error al cargar datos");

    // Construir la tabla
    const numEstudiantes = data.numEstudiantes;
    const columnas = data.columnas; // Array de indicadores {id, descripcion...}
    const notasPrevias = data.datosPrevios; // Array {estudiante_identificador, indicador_id, nivel_logro}

    // AUTO-REPARACIÓN: Si no hay columnas O si las columnas son "basura" (letras sueltas del error anterior)
    const esBasura = columnas.length > 0 && columnas.every(c => c.descripcion_indicador.length === 1);

    if (columnas.length === 0 || esBasura) {
      console.warn(esBasura ? "🗑️ Detectados indicadores basura. Purgando y resincronizando..." : "⚠️ No hay indicadores en BD. Sincronizando...");
      const evLocal = obtenerEvaluacion();

      // Buscamos la fuente de verdad del instrumento
      let itemsParaSincronizar = [];

      if (evLocal.instrumentoDiagnostico && evLocal.instrumentoDiagnostico.length > 0) {
        itemsParaSincronizar = evLocal.instrumentoDiagnostico
          .map(i => i.evidencia || i.descripcion || i.descripcion_indicador)
          .filter(t => t && t.length > 1);
      }

      // Si sigue vacío o era basura, usamos el BANCO DE SUGERENCIAS según área
      if (itemsParaSincronizar.length === 0) {
        console.log("🛠️ Recuperando criterios desde el banco pedagógico para:", evLocal.area);
        const areaNormalizada = evLocal.area || "";
        let sugerenciasArea = [];

        for (let key in BANCO_PEDAGOGICO) {
          if (areaNormalizada.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(areaNormalizada.toLowerCase())) {
            sugerenciasArea = BANCO_PEDAGOGICO[key];
            break;
          }
        }

        itemsParaSincronizar = sugerenciasArea.length > 0 ? sugerenciasArea : ["Participación en el diagnóstico", "Capacidad de análisis y síntesis"];
      }

      // Limpieza final antes de enviar
      itemsParaSincronizar = Array.isArray(itemsParaSincronizar) ? itemsParaSincronizar : [itemsParaSincronizar];

      if (itemsParaSincronizar.length > 0) {
        await fetch('/api/generar-instrumento', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            evaluacion_id: idEvaluacion,
            evidencias_texto: itemsParaSincronizar
          })
        });

        // Recargar la matriz ya limpia
        return cargarMatrizResultados();
      }
    }

    // Mapa rápido para buscar notas existentes: "estudiante-indicador" -> nivel
    const mapaNotas = {};
    notasPrevias.forEach(n => {
      mapaNotas[`${n.estudiante_identificador}-${n.indicador_id}`] = n.nivel_logro;
    });

    let html = `
      <table class="tabla-registro">
        <thead>
          <tr>
            <th style="width: 50px;">#</th>
            <th style="width: 200px;">Estudiante</th>
            ${columnas.map(col => `<th>${col.descripcion_indicador}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
    `;

    for (let i = 1; i <= numEstudiantes; i++) {
      const estId = i.toString(); // Identificador simple por ahora
      html += `<tr>
            <td>${i}</td>
            <td>Estudiante ${i}</td>
            ${columnas.map(col => {
        const notaGuardada = mapaNotas[`${estId}-${col.id}`] || "";

        // Determinar clase de color inicial
        let claseColor = "";
        if (notaGuardada == 1) claseColor = "nota-inicio";
        if (notaGuardada == 2) claseColor = "nota-proceso";
        if (notaGuardada == 3) claseColor = "nota-logro";
        if (notaGuardada == 4) claseColor = "nota-destacado";

        return `
                <td>
                    <select class="input-nota ${claseColor}"
                            data-estudiante="${estId}"
                            data-indicador="${col.id}"
                            onchange="colorearSelect(this)">
                        <option value="">-</option>
                        <option value="1" ${notaGuardada == 1 ? 'selected' : ''}>Inicio (C)</option>
                        <option value="2" ${notaGuardada == 2 ? 'selected' : ''}>Proceso (B)</option>
                        <option value="3" ${notaGuardada == 3 ? 'selected' : ''}>Logro (A)</option>
                        <option value="4" ${notaGuardada == 4 ? 'selected' : ''}>Destacado (AD)</option>
                    </select>
                </td>
                `;
      }).join('')}
        </tr>`;
    }

    html += `</tbody></table>`;
    contenedor.innerHTML = html;

  } catch (error) {
    console.error(error);
    contenedor.innerHTML = `<p style="color:red; text-align:center;">Error al cargar la matriz: ${error.message}</p>`;
  }
}

async function guardarResultados() {
  const idEvaluacion = localStorage.getItem("evaluacion_id_actual");
  const selects = document.querySelectorAll(".input-nota");

  const resultados = [];

  selects.forEach(sel => {
    if (sel.value) { // Solo guardar si tiene nota
      resultados.push({
        estudiante: sel.dataset.estudiante,
        indicador: sel.dataset.indicador,
        nota: parseInt(sel.value)
      });
    }
  });

  try {
    const btn = document.querySelector(".btn-primary");
    const textoOriginal = btn.textContent;
    btn.textContent = "Guardando..."; btn.disabled = true;

    const res = await fetch('/api/resultados', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        evaluacion_id: idEvaluacion,
        resultados: resultados
      })
    });

    if (res.ok) {
      alert("¡Resultados guardados exitosamente!");
      const btnInfo = document.getElementById("btnInforme");
      if (btnInfo) btnInfo.disabled = false;
    } else {
      alert("Error al guardar en la nube.");
    }
    btn.textContent = textoOriginal;
    btn.disabled = false;

  } catch (error) {
    console.error(error);
  }
}

function irAInformeFinal() {
  window.location.href = "informe-final.html";
}

/* =========================================================
   PASO NUEVO – INFORME FINAL (DASHBOARD + IA)
   ========================================================= */

async function cargarInformeFinal() {
  const idEvaluacion = localStorage.getItem("evaluacion_id_actual");
  if (!idEvaluacion) return;

  try {
    // 1. Pedir datos a la API Inteligente
    const res = await fetch('/api/ia-informe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ evaluacion_id: idEvaluacion })
    });
    const data = await res.json();

    // 2. Llenar Caja de Texto IA
    document.getElementById("textoConclusiones").value = data.conclusiones;

    // 3. Renderizar Gráfico (Chart.js)
    const ctx = document.getElementById('graficoBarras').getContext('2d');

    const labels = data.estadisticas.map(d => d.indicador.substring(0, 30) + "...");
    const dataInicio = data.estadisticas.map(d => d.inicio);
    const dataProceso = data.estadisticas.map(d => d.proceso);
    const dataLogro = data.estadisticas.map(d => d.logro);
    const dataDestacado = data.estadisticas.map(d => d.destacado);

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          { label: 'Inicio', data: dataInicio, backgroundColor: '#ffcdd2' },
          { label: 'Proceso', data: dataProceso, backgroundColor: '#fff9c4' },
          { label: 'Logro', data: dataLogro, backgroundColor: '#c8e6c9' },
          { label: 'Destacado', data: dataDestacado, backgroundColor: '#bbdefb' }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { stacked: true },
          y: { stacked: true, beginAtZero: true }
        }
      }
    });

    // 4. Renderizar Tabla Profesional (Premium Design)
    let htmlTabla = `
        <style>
            .premium-table { width: 100%; border-collapse: separate; border-spacing: 0; font-family: 'Segoe UI', sans-serif; margin-top: 15px; }
            .premium-table th { background: #f8f9fa; padding: 12px; font-weight: 600; text-align: center; border-bottom: 2px solid #e9ecef; color: #495057; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 0.5px; }
            .premium-table td { padding: 12px; border-bottom: 1px solid #f1f3f5; vertical-align: middle; font-size: 0.95rem; }
            .premium-table tr:hover td { background-color: #f8f9fa; }
            
            .badge-stat { display: inline-block; padding: 6px 14px; border-radius: 20px; font-weight: bold; min-width: 30px; text-align: center; font-size: 0.9rem; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
            .bg-inicio { background-color: #ffcdd2; color: #b71c1c; }
            .bg-proceso { background-color: #fff9c4; color: #f57f17; }
            .bg-logro { background-color: #c8e6c9; color: #1b5e20; }
            .bg-destacado { background-color: #bbdefb; color: #0d47a1; }
        </style>
        
        <table class="premium-table">
            <thead>
                <tr>
                    <th style="text-align:left; width: 45%;">Indicador / Criterio</th>
                    <th style="color: #b71c1c;">Inicio</th>
                    <th style="color: #f57f17;">Proceso</th>
                    <th style="color: #1b5e20;">Logro</th>
                    <th style="color: #0d47a1;">Destacado</th>
                </tr>
            </thead>
            <tbody>`;

    data.estadisticas.forEach(d => {
      htmlTabla += `<tr>
                <td style="font-weight: 500; color: #343a40;">${d.indicador}</td>
                <td style="text-align:center;"><span class="badge-stat bg-inicio">${d.inicio}</span></td>
                <td style="text-align:center;"><span class="badge-stat bg-proceso">${d.proceso}</span></td>
                <td style="text-align:center;"><span class="badge-stat bg-logro">${d.logro}</span></td>
                <td style="text-align:center;"><span class="badge-stat bg-destacado">${d.destacado}</span></td>
            </tr>`;
    });
    htmlTabla += "</tbody></table>";
    document.getElementById("tablaEstadistica").innerHTML = htmlTabla;

  } catch (e) {
    console.error(e);
    alert("Error cargando el informe inteligente");
  }
}

function exportarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const ev = obtenerEvaluacion() || {};

  // Título
  doc.setFontSize(16);
  doc.text("INFORME DE EVALUACIÓN DIAGNÓSTICA", 105, 20, null, null, "center");

  doc.setFontSize(12);
  doc.text(`Institución: ${ev.institucion || '---'}`, 20, 40);
  doc.text(`Área: ${ev.area || '---'}`, 20, 50);

  // Conclusiones
  doc.setFontSize(14);
  doc.text("Conclusiones Pedagógicas", 20, 70);

  doc.setFontSize(11);
  const textoConclusiones = document.getElementById("textoConclusiones").value;
  const lineas = doc.splitTextToSize(textoConclusiones, 170);
  doc.text(lineas, 20, 80);

  // Nota: Para gráficos reales en PDF se requiere html2canvas, 
  // por simplicidad en versión free, solo imprimimos texto.
  doc.text("(Ver anexo digital para gráficos detallados)", 20, 80 + (lineas.length * 5) + 10);

  doc.save("Informe_Diagnostico_Final.pdf");
}

// ==========================================
// MÓDULO: FICHA DEL ESTUDIANTE (IA GENERATOR)
// ==========================================

async function generarContenidoExamen() {
  const ev = obtenerEvaluacion();
  if (!ev) return;

  // Llenar datos cabecera con diseño mejorado
  const nomInst = document.getElementById("nomInst");
  nomInst.innerHTML = `<span style="font-size: 1.6rem; color: #1f3c88; font-weight: 900;">${ev.institucion || "INSTITUCIÓN EDUCATIVA"}</span>`;

  document.getElementById("areaCurso").textContent = "ÁREA: " + (ev.area || "GENERAL");
  document.getElementById("txtGrado").textContent = ev.grado + " (" + ev.ciclo + " Ciclo)";

  const contenedor = document.getElementById("contenedorPreguntas");
  const btnRegenerar = document.querySelector("button[onclick='generarContenidoExamen()']");

  // Fuente de verdad única: evidencias seleccionadas en el paso anterior
  const indicadores = ev.evidenciasSeleccionadas || ev.evidencias || [];

  if (indicadores.length === 0) {
    contenedor.innerHTML = "<p>No hay indicadores seleccionados para generar preguntas.</p>";
    return;
  }

  try {
    // Feedback visual y limpieza
    if (btnRegenerar) {
      btnRegenerar.disabled = true;
      btnRegenerar.innerHTML = "🪄 Generando...";
    }
    contenedor.innerHTML = "<p style='text-align:center; padding: 40px; color:#1f3c88;'>🤖 La Inteligencia Artificial está redactando tu ficha contextualizada...<br><small>Esto puede tardar unos segundos.</small></p>";

    // Llamada a la API de IA con CONTEXTO COMPLETO
    const res = await fetch('/api/ia-examen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grado: ev.grado,
        area: ev.area,
        indicadores: indicadores,
        situacion: ev.situacion || "",
        contexto: ev.contexto || {},
        estandares: ev.estandar || ev.estandarActual || "",
        competencias: ev.competencias ? ev.competencias.join(", ") : ""
      })
    });

    const data = await res.json();

    // GUARDAR LOS DESAFÍOS EN EL LOCAL PARA EL SIGUIENTE PASO (INSTRUMENTO)
    ev.actividadesGeneradas = data.desafios;
    guardarEvaluacion(ev);

    // DETERMINAR SI ES IA O FALLBACK (Buscamos una marca en el título o contenido)
    const esIA = !data.titulo_examen.includes("RETO DE APRENDIZAJE"); // El fallback usa "RETO DE APRENDIZAJE" hardcoded

    if (esIA) {
      console.log("[IA SUCCESS] Ficha generada por Gemini");
      contenedor.innerHTML = `<div style="text-align:center; margin-bottom: 20px;"><span class="badge badge-ai">✨ Generado con Inteligencia Artificial</span></div>`;
    } else {
      console.warn("[IA FAIL] Usando generador de respaldo");
      contenedor.innerHTML = `<div style="text-align:center; margin-bottom: 20px;"><span class="badge badge-warning">⚠️ Modo Offline (Generador Local)</span></div>`;
    }

    if (data.texto_estimulo) {
      // Título de la evaluación generado por IA
      if (data.titulo_examen) {
        const headerTitle = document.querySelector(".examen-header p");
        if (headerTitle) headerTitle.textContent = data.titulo_examen;
      }

      let html = contenedor.innerHTML; // Mantener el badge

      // 1. Renderizar el Texto Estímulo (Lectura de entrada)
      html += `
        <div class="estimulo-lectura" style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 30px; border-radius: 12px; margin-bottom: 40px; line-height: 1.8; position: relative;">
            <div style="position: absolute; top: -12px; left: 20px; background: #1f3c88; color: white; padding: 4px 15px; border-radius: 20px; font-size: 0.75rem; font-weight: bold; text-transform: uppercase;">Material de Lectura</div>
            <h3 style="color: #1f3c88; margin-bottom: 15px; text-transform: uppercase; font-size: 1.2rem; font-weight: 800; border-bottom: 2px solid #1f3c88; padding-bottom: 8px;">
                ${data.texto_estimulo.titulo}
            </h3>
            <div contenteditable="true" style="text-align: justify; color: #1e293b; font-size: 1.1rem; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                ${data.texto_estimulo.contenido ? data.texto_estimulo.contenido.replace(/\n/g, '<br>') : ''}
            </div>
        </div>
      `;

      // 2. Renderizar los Desafíos basados en la lectura
      data.desafios.forEach((act, idx) => {
        let espacioHtml = "";
        if (act.espacio_respuesta === "cuadricula") {
          espacioHtml = `<div style="border: 1px solid #cbd5e0; height: 150px; background-image: radial-gradient(#cbd5e0 1px, transparent 1px); background-size: 20px 20px; margin-top: 10px;"></div>`;
        } else if (act.espacio_respuesta === "dibujo") {
          espacioHtml = `<div style="border: 2px dashed #cbd5e0; height: 200px; margin-top: 10px; display: flex; align-items: center; justify-content: center; color: #94a3b8;">[ Espacio para dibujo o esquema ]</div>`;
        } else {
          espacioHtml = `
            <div class="espacio-respuesta">
              <div class="espacio-respuesta-lineas"></div>
              <div class="espacio-respuesta-lineas"></div>
              <div class="espacio-respuesta-lineas"></div>
              <div class="espacio-respuesta-lineas"></div>
            </div>`;
        }

        html += `
                <div class="pregunta-card" style="margin-bottom: 40px; border-left: 6px solid #1f3c88; padding-left: 25px; page-break-inside: avoid;">
                    <div class="pregunta-titulo" contenteditable="true" style="font-size: 1.35rem; font-weight: 900; color: #1f3c88 !important; margin-bottom: 12px; letter-spacing: -0.5px;">
                      Misión ${idx + 1}: ${act.titulo}
                    </div>
                    <div class="pregunta-texto" contenteditable="true" style="line-height: 1.7; text-align: justify; margin-bottom: 25px; font-size: 1.1rem; color: #334155;">
                      ${act.enunciado}
                    </div>
                    ${espacioHtml}
                </div>`;
      });
      contenedor.innerHTML = html;
    }

  } catch (e) {
    console.error("[IA CRITICAL ERROR]", e);
    contenedor.innerHTML = "<p style='color:red;'>Error conectando con la IA. Intente recargar.</p>";
  } finally {
    if (btnRegenerar) {
      btnRegenerar.disabled = false;
      btnRegenerar.innerHTML = "🪄 Regenerar con IA";
    }
  }
}

function descargarFichaPDF() {
  const elemento = document.getElementById('areaExamen');

  // Clonar para no afectar la vista original si fuera necesario, 
  // pero html2pdf ya maneja esto razonablemente bien.

  const opt = {
    margin: [0, 0, 0, 0], // El margen ya lo damos por CSS (padding en .hoja-examen)
    filename: `Ficha_Evaluacion_${document.getElementById('txtGrado').textContent.replace(/ /g, '_')}.pdf`,
    image: { type: 'jpeg', quality: 1 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      logging: false
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  // Usamos la librería global html2pdf cargada en el HTML
  window.html2pdf().set(opt).from(elemento).save();
}

/**
 * =========================================================
 * SISTEMA DE RECUPERACIÓN DE DATOS (DASHBOARD SYNC)
 * =========================================================
 */
async function cargarEvaluacionDesdeBD(id) {
  try {
    console.log("🔄 Sincronizando datos del servidor para ID:", id);

    const response = await fetch(`/api/evaluaciones?t=${Date.now()}`);
    if (!response.ok) throw new Error("Error de red");

    const evaluaciones = await response.json();
    const evBD = evaluaciones.find(e => String(e.id) === String(id));

    if (evBD) {
      // 1. Obtener indicadores de la BD para esta evaluación
      const resInd = await fetch(`/api/resultados?evaluacion_id=${id}`);
      const dataInd = await resInd.json();

      // FILTRO CRÍTICO: Solo aceptamos indicadores que tengan más de 1 carácter (evita basura "P", "R", "E")
      const indicadoresBD = (dataInd.columnas || []).filter(ind => ind.descripcion_indicador.length > 1);

      // 2. Parsear contextos de forma segura
      let socioeconomicoParsed = [];
      try {
        socioeconomicoParsed = JSON.parse(evBD.contexto_socioeconomico || '[]');
      } catch (err) {
        socioeconomicoParsed = evBD.contexto_socioeconomico ? [evBD.contexto_socioeconomico] : [];
      }

      // 3. Reconstruir el objeto local
      const evLocal = {
        id: evBD.id,
        institucion: evBD.institucion,
        area: evBD.area,
        grado: evBD.grado,
        ciclo: evBD.ciclo,
        estudiantes: evBD.numero_estudiantes,
        contexto: {
          socioeconomico: socioeconomicoParsed,
          sociocultural: evBD.contexto_sociocultural || "",
          socioemocional: evBD.contexto_clima_aula || "",
          comprensionLectora: evBD.contexto_comprension_lectora || ""
        },
        situacion: evBD.situacion_significativa || "",
        // Mapeamos los indicadores de la BD al formato del instrumento local (solo si son válidos)
        instrumentoDiagnostico: indicadoresBD.map(ind => ({
          competencia: evBD.area || "General",
          evidencia: ind.descripcion_indicador,
          inicio: "Nivel Inicial",
          proceso: "En Proceso",
          logro: "Logro Esperado"
        })),
        evidenciasSeleccionadas: indicadoresBD.map(ind => ind.descripcion_indicador),
        evidencias: indicadoresBD.map(ind => ind.descripcion_indicador)
      };

      localStorage.setItem("evaluacionDiagnostica", JSON.stringify(evLocal));
      localStorage.setItem("evaluacion_id_actual", String(id));

      console.log("✅ Sincronización completa con indicadores:", evLocal.area);
      return true;
    }
    return false;
  } catch (e) {
    console.error("❌ Error de sincronización:", e);
    return false;
  }
}
// ============================================
// GENERACIÓN DE CRITERIOS CON IA
// ============================================
async function generarCriteriosIA() {
  const ev = obtenerEvaluacion();
  if (!ev) return;

  const area = ev.area || "General";
  const grado = ev.grado || "-";
  const contexto = ev.contexto ? JSON.stringify(ev.contexto) : "No especificado";
  const competencias = ev.competenciasSeleccionadas ? ev.competenciasSeleccionadas.join(", ") : "Área general";
  const estandar = ev.estandarActual || "Estándar de ciclo correspondiente";
  const situacion = ev.situacion || "";
  const evidencias = ev.evidenciasSeleccionadas ? ev.evidenciasSeleccionadas.join(", ") : "";

  showLoading("IA analizando datos y redactando criterios...");

  try {
    const res = await fetch('/api/ia-criterios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ area, grado, contexto, competencias, estandar, situacion, evidencias })
    });

    const data = await res.json();
    if (data.criterios) {
      console.log("[IA SUCCESS] Criterios generados por Gemini");
      document.getElementById("criterios").value = data.criterios;
      showAlert("success", "IA - Criterios", "Criterios generados basándose en tu secuencia pedagógica.");
    }
  } catch (err) {
    console.error("[IA FAIL] Error IA Criterios:", err);
    showAlert("warning", "Modo Offline", "No se pudo conectar con la IA. Usando criterios estándar.");
  } finally {
    hideLoading();
  }
}

// ============================================
// EXPORTACIÓN A WORD (INSTURMENTO)
// ============================================
function exportarInstrumentoWord() {
  const ev = obtenerEvaluacion();
  if (!ev) return;

  const area = ev.area || 'General';
  const grado = ev.grado || '-';
  const inst = ev.institucion || '-';
  const ciclo = ev.ciclo || '-';
  const fecha = new Date().toLocaleDateString();

  // SCRAPING DE LA TABLA: Capturamos lo que el docente editó en pantalla
  let tablaHtml = "";
  const filas = document.querySelectorAll("#tablaInstrumento tr");

  if (filas.length > 0) {
    filas.forEach((fila) => {
      const celdas = fila.querySelectorAll("td");
      if (celdas.length >= 5) {
        tablaHtml += `
          <tr>
            <td style="border: 1pt solid #000; padding: 5pt; text-align: center;">${celdas[0].innerText}</td>
            <td style="border: 1pt solid #000; padding: 5pt;">${celdas[1].innerHTML}</td>
            <td style="border: 1pt solid #000; padding: 5pt; font-size: 9pt;">${celdas[2].innerText}</td>
            <td style="border: 1pt solid #000; padding: 5pt; font-size: 9pt;">${celdas[3].innerText}</td>
            <td style="border: 1pt solid #000; padding: 5pt; font-size: 9pt;">${celdas[4].innerText}</td>
          </tr>
        `;
      }
    });
  } else if (ev.instrumentoDiagnostico) {
    // Fallback al objeto guardado si no hay tabla en el DOM (poco probable si está en el Paso 8)
    ev.instrumentoDiagnostico.forEach((item, i) => {
      tablaHtml += `
        <tr>
          <td style="border: 1pt solid #000; padding: 5pt; text-align: center;">${i + 1}</td>
          <td style="border: 1pt solid #000; padding: 5pt;"><b>${item.competencia}</b><br>${item.evidencia}</td>
          <td style="border: 1pt solid #000; padding: 5pt; font-size: 9pt;">${item.inicio}</td>
          <td style="border: 1pt solid #000; padding: 5pt; font-size: 9pt;">${item.proceso}</td>
          <td style="border: 1pt solid #000; padding: 5pt; font-size: 9pt;">${item.logro}</td>
        </tr>
      `;
    });
  }

  const wordContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'>
    <style>
      body { font-family: 'Segoe UI', Arial, sans-serif; }
      .header { text-align: center; border-bottom: 2pt solid #1e3a8a; padding-bottom: 10pt; margin-bottom: 20pt; }
      .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 20pt; }
      .meta-table td { border: 0.5pt solid #ccc; padding: 8pt; background: #f8fafc; }
      .label { font-size: 7pt; font-weight: bold; color: #1e3a8a; text-transform: uppercase; }
      .value { font-size: 10pt; font-weight: bold; }
      table.doc-table { width: 100%; border-collapse: collapse; }
      table.doc-table th { background: #1e293b; color: #ffffff; border: 1pt solid #000; padding: 8pt; text-align: left; font-size: 9pt; text-transform: uppercase; }
      table.doc-table td { border: 1pt solid #000; padding: 8pt; font-size: 10pt; vertical-align: top; }
      .footer { margin-top: 50pt; text-align: center; }
      .sig-line { border-top: 1pt solid #000; width: 200pt; display: inline-block; padding-top: 5pt; margin: 0 40pt; font-size: 9pt; font-weight: bold; }
    </style>
    </head>
    <body>
      <div class="header">
        <h1 style="font-size: 18pt; margin: 0;">INSTRUMENTO DE EVALUACIÓN DIAGNÓSTICA 2026</h1>
        <p style="font-size: 9pt; color: #666;">Sistema de Evaluación Institucional - SIED</p>
      </div>

      <table class="meta-table">
        <tr>
          <td><div class="label">Institución Educativa</div><div class="value">${inst}</div></td>
          <td><div class="label">Área Curricular</div><div class="value">${area}</div></td>
        </tr>
        <tr>
          <td><div class="label">Grado y Ciclo</div><div class="value">${grado} - ${ciclo}</div></td>
          <td><div class="label">Fecha de Emisión</div><div class="value">${fecha}</div></td>
        </tr>
      </table>

      <table class="doc-table">
        <thead>
          <tr>
            <th style="width: 30pt;">N°</th>
            <th style="width: 150pt;">Indicador de Logro</th>
            <th>Nivel Inicio</th>
            <th>Nivel Proceso</th>
            <th>Nivel Logro</th>
          </tr>
        </thead>
        <tbody>
          ${tablaHtml}
        </tbody>
      </table>

      <div class="footer">
        <div style="margin-top: 60pt;">
          <div class="sig-line">DOCENTE DE AULA</div>
          <div class="sig-line">DIRECCIÓN / COORDINACIÓN</div>
        </div>
      </div>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', wordContent], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Instrumento_Diagnostico_${area.replace(/ /g, '_')}_2026.doc`;
  link.click();
  URL.revokeObjectURL(url);
  showAlert("success", "Exportación", "Instrumento descargado en formato Word.");
}

// Exportar globalmente
window.generarCriteriosIA = generarCriteriosIA;
window.exportarInstrumentoWord = exportarInstrumentoWord;
