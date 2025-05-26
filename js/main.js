document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("simuladorForm");
  const resultadoDiv = document.getElementById("resultado");
  const historialDiv = document.getElementById("historial");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const ahorroActual = parseFloat(document.getElementById("ahorroActual").value);
    const ahorroInicial = parseFloat(document.getElementById("ahorroInicial").value);
    const objetivo = parseFloat(document.getElementById("objetivo").value);
    const aporteMensual = parseFloat(document.getElementById("aporteMensual").value);

    let totalAhorro = ahorroActual + ahorroInicial;
    let meses = 0;
    const historialMensual = [];
    let fecha = luxon.DateTime.now();

    while (totalAhorro < objetivo) {
      meses++;
      totalAhorro += aporteMensual;
      fecha = fecha.plus({ months: 1 });

      historialMensual.push({
        mes: meses,
        monto: totalAhorro.toFixed(2),
        fecha: fecha.toFormat("dd/MM/yyyy")
      });
    }

    try {
      const response = await fetch("https://v6.exchangerate-api.com/v6/0a0096eedb4da0f3a8843825/latest/USD");
      const data = await response.json();
      const tasaDolar = data.conversion_rates.USD;
      const ahorroDolares = (totalAhorro / tasaDolar).toFixed(2);

      const simulacion = {
        objetivo,
        meses,
        totalAhorrado: totalAhorro.toFixed(2),
        enDolares: ahorroDolares,
        historial: historialMensual,
        fechaFinal: fecha.toFormat("dd/MM/yyyy")
      };

      guardarSimulacion(simulacion);
      mostrarResultado(simulacion, tasaDolar);
    } catch (error) {
      console.error("Error al obtener la cotización:", error);
      resultadoDiv.innerHTML = "<p>❌ No se pudo obtener la cotización del dólar.</p>";
    }
  });

  function guardarSimulacion(simulacion) {
    let historial = JSON.parse(localStorage.getItem("simulaciones")) || [];
    historial.push(simulacion);
    localStorage.setItem("simulaciones", JSON.stringify(historial));
  }

  async function mostrarResultado(simulacion, tasaDolar) {
    resultadoDiv.innerHTML = `
      <h3>🎉 Objetivo alcanzado en ${simulacion.meses} mes(es)!</h3>
      <p>💰 Total ahorrado: $${simulacion.totalAhorrado} ARS</p>
      <p>💵 Equivale a: ${simulacion.enDolares} USD (tasa: ${tasaDolar})</p>
      <ul>
        ${simulacion.historial.map(item => `
          <li>Mes ${item.mes} (${item.fecha}): $${item.monto}</li>
        `).join("")}
      </ul>
    `;
  }

  document.getElementById("verHistorialBtn").addEventListener("click", () => {
    const historial = JSON.parse(localStorage.getItem("simulaciones")) || [];
    mostrarHistorial(historial);
  });

  document.getElementById("filtrarBtn").addEventListener("click", () => {
    const historial = JSON.parse(localStorage.getItem("simulaciones")) || [];
    const filtradas = historial.filter(sim => sim.meses > 6);
    mostrarHistorial(filtradas, true);
  });

  function mostrarHistorial(lista, esFiltrado = false) {
    if (lista.length === 0) {
      historialDiv.innerHTML = "<p>No hay simulaciones para mostrar.</p>";
      return;
    }

    historialDiv.innerHTML = `<h3>${esFiltrado ? "🔍 Simulaciones de más de 6 meses" : "📊 Historial completo"}</h3>` +
      lista.map((sim, index) => `
        <div style="margin-bottom: 10px; border-bottom: 1px solid #ccc;">
          <p>#${index + 1} - 🎯 Objetivo: $${sim.objetivo} | 🗓️ Meses: ${sim.meses}</p>
          <p>💰 Total: $${sim.totalAhorrado} ARS | 💵 ${sim.enDolares} USD | 🏁 Fin: ${sim.fechaFinal}</p>
        </div>
      `).join("");
  }

  document.getElementById("borrarHistorialBtn").addEventListener("click", () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Se eliminará todo el historial de simulaciones y no podrás recuperarlo.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4CAF50',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, borrar todo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("simulaciones");
        historialDiv.innerHTML = "<p>🗑️ Historial eliminado.</p>";
        Swal.fire(
          'Eliminado!',
          'El historial ha sido borrado.',
          'success'
        );
      }
    });
  });

});
