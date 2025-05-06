document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("simuladorForm");
  const resultadoDiv = document.getElementById("resultado");
  const historialDiv = document.getElementById("historial");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const ahorroActual = parseFloat(document.getElementById("ahorroActual").value);
    const ahorroInicial = parseFloat(document.getElementById("ahorroInicial").value);
    const objetivo = parseFloat(document.getElementById("objetivo").value);
    const aporteMensual = parseFloat(document.getElementById("aporteMensual").value);

    let totalAhorro = ahorroActual + ahorroInicial;
    let meses = 0;
    const historialMensual = [];

    while (totalAhorro < objetivo) {
      meses++;
      totalAhorro += aporteMensual;
      historialMensual.push(totalAhorro.toFixed(2));
    }

    const simulacion = {
      objetivo,
      meses,
      totalAhorrado: totalAhorro.toFixed(2),
      historial: historialMensual
    };

    guardarSimulacion(simulacion);
    mostrarResultado(simulacion);
  });

  document.getElementById("verHistorialBtn").addEventListener("click", mostrarHistorial);

  function guardarSimulacion(simulacion) {
    let historial = JSON.parse(localStorage.getItem("simulaciones")) || [];
    historial.push(simulacion);
    localStorage.setItem("simulaciones", JSON.stringify(historial));
  }

  function mostrarResultado(simulacion) {
    resultadoDiv.innerHTML =
    `
      <h3>🎉Objetivo alcanzado en ${simulacion.meses} mes(es)!</h3>
      <p>Total ahorrado: $${simulacion.totalAhorrado}</p>
      <ul>
        ${simulacion.historial.map((monto, i) => `<li>Mes ${i + 1}: $${monto}</li>`).join("")}
      </ul>
    `;
  }

  function mostrarHistorial() {
    const historial = JSON.parse(localStorage.getItem("simulaciones")) || [];
    if (historial.length === 0) {
      historialDiv.innerHTML = "<p>No hay simulaciones previas.</p>";
      return;
    }

    historialDiv.innerHTML = "<h3>📊Historial:</h3>" + historial.map((sim, index) => 
    `
      <p>#${index + 1} - 🎯Objetivo: $${sim.objetivo} | Meses: ${sim.meses} | Total Ahorrado: $${sim.totalAhorrado}</p>
    `).join("");
  }
});  