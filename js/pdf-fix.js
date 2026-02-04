/**
 * SIED PDF ENGINE v4.0 - PROFESSIONAL GRADE
 * Solución definitiva basada en aislamiento de coordenadas.
 */
function exportarInstrumentoPDF() {
    const areaOriginal = document.getElementById('exportArea');
    if (!areaOriginal) return;

    const btn = event?.target?.closest('button');
    if (btn) {
        btn.innerHTML = "⏳ GENERANDO PDF...";
        btn.disabled = true;
    }

    // 1. Clonamos el elemento
    const clon = areaOriginal.cloneNode(true);

    // 2. Creamos un contenedor "Limpio" (Sin Flex, Sin Centrado)
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '0';
    container.style.top = '0';
    container.style.width = '794px'; // Ancho A4 exacto
    container.style.zIndex = '-9999';
    container.style.background = 'white';

    // 3. Reseteamos estilos del clon para que esté pegado arriba a la izquierda
    clon.style.margin = '0';
    clon.style.padding = '40px';
    clon.style.boxShadow = 'none';
    clon.style.width = '100%';
    clon.style.display = 'block';

    container.appendChild(clon);
    document.body.appendChild(container);

    // 4. Configuración de captura milimétrica
    const opt = {
        margin: 10,
        filename: 'Instrumento_SIED_2026.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            logging: false,
            scrollX: 0,
            scrollY: 0,
            windowWidth: 794 // Forzamos a la cámara a ver solo 794px de ancho
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // 5. Ejecución
    window.html2pdf().set(opt).from(container).save().then(() => {
        document.body.removeChild(container);
        if (btn) {
            btn.innerHTML = "📄 DESCARGAR PDF OFICIAL";
            btn.disabled = false;
        }
    }).catch(err => {
        console.error("Critical PDF Failure:", err);
        if (container.parentNode) document.body.removeChild(container);
        if (btn) {
            btn.innerHTML = "📄 REINTENTAR";
            btn.disabled = false;
        }
    });
}
