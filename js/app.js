/* =========================================================
   SISTEMA INSTITUCIONAL DE EVALUACIÓN DIAGNÓSTICA – 2026
   NIVEL SECUNDARIA – CNEB – CICLOS VI Y VII
========================================================= */

/* =========================================================
   UTILIDADES BASE
========================================================= */

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
  "1°": "Ciclo VI",
  "2°": "Ciclo VI",
  "3°": "Ciclo VII",
  "4°": "Ciclo VII",
  "5°": "Ciclo VII"
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
    "Ciclo VI": "Interpreta y produce textos orales y escritos considerando su propósito y contexto.",
    "Ciclo VII": "Analiza críticamente textos complejos y argumenta con coherencia."
  },
  "Matemática": {
    "Ciclo VI": "Resuelve problemas aplicando estrategias matemáticas diversas.",
    "Ciclo VII": "Modela y resuelve problemas complejos con rigor matemático."
  },
  "Ciencia y Tecnología": {
    "Ciclo VI": "Indaga y explica fenómenos naturales mediante evidencias.",
    "Ciclo VII": "Diseña soluciones tecnológicas fundamentadas científicamente."
  },
  "Ciencias Sociales": {
    "Ciclo VI": "Construye interpretaciones históricas y gestiona el espacio.",
    "Ciclo VII": "Analiza procesos históricos y problemáticas territoriales."
  },
  "Desarrollo Personal, Ciudadanía y Cívica": {
    "Ciclo VI": "Construye su identidad y convive democráticamente.",
    "Ciclo VII": "Delibera y actúa éticamente frente a asuntos públicos."
  },
  "Educación Física": {
    "Ciclo VI": "Se desenvuelve de manera autónoma y asume hábitos saludables.",
    "Ciclo VII": "Interactúa estratégicamente mediante habilidades sociomotrices."
  },
  "Arte y Cultura": {
    "Ciclo VI": "Aprecia y crea manifestaciones artístico-culturales.",
    "Ciclo VII": "Analiza críticamente y desarrolla proyectos artísticos."
  },
  "Educación para el Trabajo": {
    "Ciclo VI": "Identifica oportunidades de emprendimiento.",
    "Ciclo VII": "Gestiona proyectos innovadores y sostenibles."
  },
  "Inglés": {
    "Ciclo VI": "Comprende y produce mensajes sencillos en inglés.",
    "Ciclo VII": "Interactúa en inglés con mayor fluidez."
  },
  "Educación Religiosa": {
    "Ciclo VI": "Construye su identidad desde la experiencia de fe.",
    "Ciclo VII": "Asume una vivencia ética y trascendente."
  }
};

/* ---------- SITUACIONES SIGNIFICATIVAS ---------- */

const situacionesPorAreaYCiclo = {

  "Comunicación": {
    "Ciclo VI": "Los estudiantes analizan textos orales y escritos relacionados con situaciones cotidianas de su comunidad para identificar información, ideas principales y propósito comunicativo.",
    "Ciclo VII": "Los estudiantes interpretan y producen textos orales y escritos sobre problemáticas sociales actuales, argumentando sus ideas con coherencia y adecuación al contexto."
  },

  "Matemática": {
    "Ciclo VI": "Los estudiantes resuelven situaciones problemáticas vinculadas a la economía familiar, el comercio local y la organización de recursos, aplicando estrategias matemáticas.",
    "Ciclo VII": "Los estudiantes modelan y resuelven situaciones problemáticas complejas del entorno social y científico, utilizando relaciones algebraicas y representaciones matemáticas."
  },

  "Ciencia y Tecnología": {
    "Ciclo VI": "Los estudiantes indagan fenómenos relacionados con el ambiente, la salud y el uso de recursos naturales en su comunidad, formulando explicaciones basadas en evidencias.",
    "Ciclo VII": "Los estudiantes analizan problemáticas ambientales y científicas, proponiendo explicaciones y soluciones tecnológicas fundamentadas en conocimientos científicos."
  },

  "Ciencias Sociales": {
    "Ciclo VI": "Los estudiantes analizan hechos y procesos históricos locales y nacionales para comprender cambios y permanencias en su comunidad.",
    "Ciclo VII": "Los estudiantes interpretan procesos históricos y problemáticas territoriales y sociales, reflexionando sobre su impacto en la sociedad actual."
  },

  "Desarrollo Personal, Ciudadanía y Cívica": {
    "Ciclo VI": "Los estudiantes reflexionan sobre situaciones de convivencia escolar y familiar para reconocer su identidad, emociones y responsabilidades como ciudadanos.",
    "Ciclo VII": "Los estudiantes analizan situaciones de participación ciudadana y convivencia democrática, argumentando decisiones éticas frente a asuntos públicos."
  },

  "Educación Física": {
    "Ciclo VI": "Los estudiantes participan en actividades físicas y juegos motores para evaluar su condición física, coordinación y hábitos saludables.",
    "Ciclo VII": "Los estudiantes aplican estrategias motrices y de trabajo en equipo en actividades deportivas, valorando la cooperación y el cuidado de la salud."
  },

  "Arte y Cultura": {
    "Ciclo VI": "Los estudiantes aprecian y crean producciones artísticas inspiradas en manifestaciones culturales de su localidad, expresando ideas y emociones.",
    "Ciclo VII": "Los estudiantes analizan manifestaciones artísticas y desarrollan proyectos creativos que expresan identidad cultural y problemáticas sociales."
  },

  "Educación para el Trabajo": {
    "Ciclo VI": "Los estudiantes identifican necesidades u oportunidades de su entorno y proponen ideas de emprendimiento económico o social.",
    "Ciclo VII": "Los estudiantes diseñan y gestionan proyectos de emprendimiento considerando la innovación, sostenibilidad y viabilidad."
  },

  "Inglés": {
    "Ciclo VI": "Los estudiantes comprenden y producen mensajes orales y escritos simples en inglés relacionados con situaciones cotidianas.",
    "Ciclo VII": "Los estudiantes interactúan en inglés comprendiendo y produciendo textos orales y escritos sobre temas de interés personal y social."
  },

  "Educación Religiosa": {
    "Ciclo VI": "Los estudiantes reflexionan sobre experiencias de vida cotidiana a la luz de valores cristianos para fortalecer su identidad personal.",
    "Ciclo VII": "Los estudiantes analizan situaciones personales y sociales desde una perspectiva ética y trascendente, promoviendo el bien común."
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

  // Recogemos los datos igual que antes
  const datos = {
    institucion: document.getElementById("institucion").value,
    area: document.getElementById("area").value,
    grado: document.getElementById("grado").value,
    ciclo: document.getElementById("ciclo").value,
    estudiantes: document.getElementById("estudiantes").value
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
      window.location.href = "competencias.html";
    } else {
      alert("Error al guardar contexto en la nube.");
      if (btn) btn.disabled = false; // Reactivar si falló
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

function sugerirEvidencias() {
  const ev = obtenerEvaluacion();
  let lista = [];

  ev.competencias.forEach(c => {
    if (evidenciasPorCompetencia[c]) {
      lista = lista.concat(evidenciasPorCompetencia[c]);
    }
  });

  document.getElementById("evidencias").value = lista.join("\n");
}

function guardarEvidencias() {
  const ev = obtenerEvaluacion();
  ev.evidencias = document
    .getElementById("evidencias")
    .value.split("\n")
    .filter(e => e.trim() !== "");

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
      indicador: evidencia,
      niveles: {
        inicio: "No logra el desempeño descrito",
        proceso: "Logra el desempeño con apoyo",
        logro: "Logra el desempeño de manera autónoma"
      }
    });
  });

  ev.instrumentoDiagnostico = instrumento;
  guardarEvaluacion(ev);
}




/* =========================================================
   PASO 7 – INSTRUMENTO DIAGNÓSTICO
========================================================= */


async function generarInstrumentoDiagnostico() {
  const ev = obtenerEvaluacion();
  const idEvaluacion = localStorage.getItem("evaluacion_id_actual");

  // Lógica actual de generación local (para mostrar la tabla en pantalla)
  ev.instrumento = ev.itemsDiagnosticos.map((texto, i) => ({
    item: i + 1,
    evidencia: texto,
    niveles: {
      inicio: "No logra el desempeño descrito",
      proceso: "Logra el desempeño con apoyo",
      logro: "Logra el desempeño de manera autónoma"
    }
  }));

  // Guardado local
  localStorage.setItem("evaluacionDiagnostica", JSON.stringify(ev));

  // NUEVO: Guardado en Nube (Prepara la tabla de notas)
  try {
    const btn = document.getElementById("btnGenerar"); // Asumiendo que el botón que llama esto tiene este ID
    // Si no tiene ID, simplemente no mostramos feedback en el botón, pero el alert funcionará.
    if (btn) { btn.textContent = "Procesando..."; btn.disabled = true; }

    await fetch('/api/generar-instrumento', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        evaluacion_id: idEvaluacion,
        evidencias_texto: ev.itemsDiagnosticos
      })
    });

    // Feedback visual
    alert("Instrumento generado y sincronizado con la nube.");
    // No redireccionamos forzosamente porque esta función suele llamarse dentro de la misma página "instrumento.html" para pintar la tabla.
    // Si se necesita recargar para ver cambios, se puede descomentar:
    // window.location.reload(); 

  } catch (e) {
    console.error(e);
    alert("Se generó localmente pero falló la sincronización nube.");
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
  if (!window.jspdf || !window.jspdf.jsPDF) {
    alert("La librería PDF no se ha cargado correctamente.");
    return;
  }

  const jsPDF = window.jspdf.jsPDF;
  const doc = new jsPDF();
  const ev = obtenerEvaluacion();

  let y = 10;

  doc.setFontSize(12);
  doc.text("INSTRUMENTO DE EVALUACIÓN DIAGNÓSTICA – 2026", 10, y);
  y += 10;

  doc.setFontSize(10);
  doc.text(`Institución: ${ev.institucion}`, 10, y); y += 6;
  doc.text(`Área: ${ev.area} | Grado: ${ev.grado} | ${ev.ciclo}`, 10, y);
  y += 10;

  ev.instrumentoDiagnostico.forEach((item) => {
    if (y > 270) {
      doc.addPage();
      y = 10;
    }

    doc.text(`${item.numero}. ${item.criterio}`, 10, y);
    y += 6;
    doc.text(`Inicio: ${item.niveles.inicio}`, 12, y); y += 5;
    doc.text(`Proceso: ${item.niveles.proceso}`, 12, y); y += 5;
    doc.text(`Logro: ${item.niveles.logro}`, 12, y); y += 8;
  });

  doc.save("Instrumento_Diagnostico_2026.pdf");
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
  ev.instrumentoDiagnostico.forEach(item => {
    doc.text(`${item.numero}. ${item.criterio}`, 10, y); y += 6;
    doc.text(`Inicio: ${item.niveles.inicio}`, 12, y); y += 5;
    doc.text(`Proceso: ${item.niveles.proceso}`, 12, y); y += 5;
    doc.text(`Logro: ${item.niveles.logro}`, 12, y); y += 8;
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

    // 4. Renderizar Tabla Simple
    let htmlTabla = `<table class="tabla-registro" style="margin-top:0">
            <thead>
                <tr>
                    <th>Indicador</th> <th>Inicio</th> <th>Proceso</th> <th>Logro</th> <th>Destacado</th>
                </tr>
            </thead><tbody>`;

    data.estadisticas.forEach(d => {
      htmlTabla += `<tr>
                <td style="text-align:left;">${d.indicador}</td>
                <td>${d.inicio}</td>
                <td>${d.proceso}</td>
                <td>${d.logro}</td>
                <td>${d.destacado}</td>
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
