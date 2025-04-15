const simulaciones = [];

function pedirNumero(mensaje) {
    let numero;
    do {
     numero = parseFloat(prompt(mensaje));
    } while (isNaN(numero) || numero < 0);
    return numero;
}
  
function iniciarSimulacion() {
    const ahorroActualInput = pedirNumero("¿Cuánto dinero tenés ahorrado actualmente? Ingresalo (o poné 0):");
    const ahorroInicial = pedirNumero("¿Querés sumar un ahorro inicial? Ingresalo (o poné 0):");
    const objetivo = pedirNumero("¿Cuál es tu objetivo de ahorro total?");
    const aporteMensual = pedirNumero("¿Cuánto pensás ahorrar por mes?");
  
    let ahorroActual = ahorroActualInput + ahorroInicial;
    let meses = 0;
    const historialMensual = [];

    while (ahorroActual < objetivo) {
        meses++;
        ahorroActual += aporteMensual;
        historialMensual.push(ahorroActual.toFixed(2));
    }

    simulaciones.push({
        objetivo,
        meses,
        totalAhorrado: ahorroActual.toFixed(2),
        historial: historialMensual
    });

    let resumen = `📅 Progreso del ahorro:\n\n`;
    historialMensual.forEach((monto, index) => {
        resumen += `Mes ${index + 1}: $${monto}\n`;
    });
  
    alert(resumen + `\n🎉 ¡Objetivo alcanzado en ${meses} mes(es)!\nTotal ahorrado: $${ahorroActual.toFixed(2)}`);
}

function verHistorial() {
    if (simulaciones.length === 0) {
      alert("No hay simulaciones registradas todavía.");
      return;
    }

    let resumen = "📊 Historial de simulaciones:\n\n";
    simulaciones.forEach((sim, index) => {
      resumen += `#${index + 1} - Objetivo: $${sim.objetivo} | Meses: ${sim.meses} | Total Ahorrado: $${sim.totalAhorrado}\n`;
    });

  alert(resumen);
}


document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("iniciarBtn").addEventListener("click", iniciarSimulacion);
    document.getElementById("verHistorialBtn").addEventListener("click", verHistorial);
});
