let movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];

const formulario = document.getElementById("formulario");
const lista = document.getElementById("lista");
const buscar = document.getElementById("buscar");
const filtro = document.getElementById("filtro");
const presupuesto = document.getElementById("presupuesto");

presupuesto.value =
localStorage.getItem("presupuesto") || "";

const exportarExcel =
document.getElementById("exportarExcel");

function actualizarPantalla() {

    lista.innerHTML = "";

    let ingresos = 0;
    let gastos = 0;
    let balance = 0;

    const movimientosFiltrados =
    movimientos.filter((movimiento) => {

        const coincideBusqueda =
            movimiento.descripcion
            .toLowerCase()
            .includes(buscar.value.toLowerCase());

        const coincideFiltro =
            filtro.value === "Todos" ||
            movimiento.tipo === filtro.value;

        return coincideBusqueda && coincideFiltro;

    });

    movimientosFiltrados.forEach((movimiento, index) => {

        const li = document.createElement("li");

        li.innerHTML = `
            ${movimiento.fecha} | ${movimiento.tipo} | ${movimiento.descripcion} | $${movimiento.valor}
            <br><br>
            <button onclick="eliminarMovimiento(${index})">
                🗑️ Eliminar
            </button>
        `;

        lista.appendChild(li);

    });

    movimientos.forEach((movimiento) => {

        if (movimiento.tipo === "Ingreso") {

            ingresos += movimiento.valor;
            balance += movimiento.valor;

        } else {

            gastos += movimiento.valor;
            balance -= movimiento.valor;

        }

    });

    document.getElementById("ingresos").textContent =
        "$" + ingresos;

    document.getElementById("gastos").textContent =
        "$" + gastos;

    document.getElementById("balance").textContent =
        "$" + balance;

    const disponible =
        Number(presupuesto.value || 0) - gastos;

    document.getElementById("disponible").textContent =
        "Disponible: $" + disponible;
}

formulario.addEventListener("submit", function (e) {

    e.preventDefault();

    const movimiento = {
        fecha: document.getElementById("fecha").value,
        descripcion: document.getElementById("descripcion").value,
        tipo: document.getElementById("tipo").value,
        categoria: document.getElementById("categoria").value,
        valor: Number(document.getElementById("valor").value)
    };

    /* NUEVOS MOVIMIENTOS PRIMERO */
    movimientos.unshift(movimiento);

    localStorage.setItem(
        "movimientos",
        JSON.stringify(movimientos)
    );

    actualizarPantalla();

    formulario.reset();

});

function eliminarMovimiento(index) {

    movimientos.splice(index, 1);

    localStorage.setItem(
        "movimientos",
        JSON.stringify(movimientos)
    );

    actualizarPantalla();

}

buscar.addEventListener("input", actualizarPantalla);

filtro.addEventListener("change", actualizarPantalla);

presupuesto.addEventListener("input", () => {

    localStorage.setItem(
        "presupuesto",
        presupuesto.value
    );

    actualizarPantalla();

});

exportarExcel.addEventListener("click", () => {

    let contenido =
        "Fecha;Tipo;Categoria;Descripcion;Valor\n";

    movimientos.forEach((movimiento) => {

        contenido +=
            `${movimiento.fecha};${movimiento.tipo};${movimiento.categoria || "Sin categoría"};${movimiento.descripcion};${movimiento.valor}\n`;

    });

    const archivo = new Blob(
        [contenido],
        { type: "text/csv;charset=utf-8;" }
    );

    const enlace =
        document.createElement("a");

    enlace.href =
        URL.createObjectURL(archivo);

    enlace.download =
        "MiMona_Reporte.csv";

    enlace.click();

});

actualizarPantalla();