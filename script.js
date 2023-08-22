document.addEventListener("DOMContentLoaded", function() {
  Swal.fire({
    title: '¡Bienvenido!',
    html: `
        <h4>Para comenzar, por favor ingresa tus datos:</h4>
        <form id="datosForm">
            <label for="nombre">Nombre:</label>
            <input type="text" id="nombre" required>
            <label for="edad">Edad:</label>
            <input type="number" id="edad" required>
            <label for="email">Email:</label>
            <input type="email" id="email" required>
            <button type="submit">Enviar</button>
        </form>
        <p><a href="#" id="saltearFormulario">Saltear Formulario</a></p>

    `,
    showCancelButton: false,
    showConfirmButton: false,
    allowOutsideClick: false,
    customClass: {
        container: 'mi-alerta-inicial',
    },
    didOpen: (modal) => {
        const datosForm = modal.querySelector("#datosForm");
        const saltearFormulario = modal.querySelector("#saltearFormulario");
        
        datosForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const nombre = document.getElementById("nombre").value;
            const edad = parseInt(document.getElementById("edad").value);
            const email = document.getElementById("email").value;

            if (nombre && !isNaN(edad) && edad >= 0 && email) {
                Swal.close(); // Cerrar el SweetAlert

                // Mostrar los stickers y la calculadora
                const calculador = document.getElementById("calculador");
                calculador.style.display = "block";
            } else {
                alert("Por favor, ingrese datos válidos en el formulario.");
            }
        });

        saltearFormulario.addEventListener("click", function(event) {
            event.preventDefault();

            Swal.close(); // Cerrar el SweetAlert

            // Mostrar los stickers y la calculadora
            const calculador = document.getElementById("calculador");
            calculador.style.display = "block";
        });
    }
  });
});


// Cargar los datos de stickers y precios desde un archivo JSON
fetch('precios.json')
  .then(response => response.json())
  .then(data => {
    const preciosElement = document.getElementById("precios");
    preciosElement.innerHTML = "<u>Precios:</u>";

    data.stickers.forEach(sticker => {
      preciosElement.innerHTML += `<p>${sticker.nombre}: ${sticker.precio}$</p>`;
    });
  })
  .catch(error => console.error('Error:', error));

class Sticker {
  constructor(nombre, precioUnitario, cantidad) {
    this.nombre = nombre;
    this.precioUnitario = precioUnitario;
    this.cantidad = cantidad;
  }
}

let storedStickers = localStorage.getItem("stickers");
let stickers = [];

if (storedStickers) {
  stickers = JSON.parse(storedStickers);
} else {
  stickers = [
    new Sticker("Sticker 1", 5, 0),
    new Sticker("Sticker 2", 3, 0),
    new Sticker("Sticker 3", 7, 0)
  ];
}

function actualizarStorage() {
  localStorage.setItem("stickers", JSON.stringify(stickers));
}

function actualizarDetalleCompra() {
  let detalleElement = document.getElementById("detalle-compra");

  if (!detalleElement) {
    console.error("Error: El elemento 'detalle-compra' no existe.");
    return;
  }

  detalleElement.innerHTML = "";

  stickers.forEach(sticker => {
    let subtotal = sticker.cantidad * sticker.precioUnitario;

    let stickerDetalle = document.createElement("p");
    stickerDetalle.textContent = `${sticker.nombre}: Cantidad: ${sticker.cantidad}, Subtotal: $${subtotal}`;
    
    detalleElement.appendChild(stickerDetalle);
  });
}

function calcularTotal() {
  let total = 0;
  let isValidInput = true;

  for (let i = 0; i < stickers.length; i++) {
    let cantidadInput = document.getElementById(`cantidad${i + 1}`);

    if (!cantidadInput) {
      console.error(`Error: El input de cantidad con ID 'cantidad${i + 1}' no existe.`);
      isValidInput = false;
      break;
    }

    let cantidadValue = cantidadInput.value.trim();

    if (!cantidadValue || isNaN(cantidadValue) || parseInt(cantidadValue) < 0) {
      isValidInput = false;
      break;
    }

    stickers[i].cantidad = parseInt(cantidadValue);
    let subtotal = stickers[i].cantidad * stickers[i].precioUnitario;

    if (stickers[i].cantidad >= 10) {
      let descuento = subtotal * 0.1; 
      subtotal -= descuento;
    }

    total += subtotal;
  }

  if (isValidInput) {
    let resultadoElement = document.getElementById("total");
    resultadoElement.textContent = "Total a pagar: $" + total;

    actualizarDetalleCompra();
    actualizarStorage();

    mostrarBotonFinalizar(); // Mostrar el botón "Finalizar Compra"
  } else {
    alert("Por favor, ingrese valores numéricos positivos en los campos de cantidad.");
  }

  if (isNaN(total)) {
    alert("El total a pagar es inválido. Por favor, ingrese números válidos en todos los campos de cantidad.");
  }
  return total; // Devolver el total calculado
}

document.getElementById("calcularButton").addEventListener("click", calcularTotal);

const cantidadInputs = document.getElementsByClassName("cantidad-input");
for (let i = 0; i < cantidadInputs.length; i++) {
  cantidadInputs[i].addEventListener("input", calcularTotal);
}

function finalizarCompra() {
  // Mostrar SweetAlert para finalizar la compra y redirigir a WhatsApp
  Swal.fire({
    icon: 'success',
    title: '¡Compra finalizada!',
    text: 'Para seguir con tu compra, dirígete a WhatsApp.',
    confirmButtonText: 'Ir a WhatsApp',
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = 'https://wa.link/5wgoyn'; // Enlace a WhatsApp
    }
  });
}

function mostrarBotonFinalizar() {
  document.getElementById("finalizarButton").style.display = "block";
}

// Función para descargar el archivo de detalle de compra
function descargarArchivo() {
  let contenidoArchivo = generarContenidoArchivo();
  
  const blob = new Blob([contenidoArchivo], { type: 'text/plain' });
  
  const enlaceDescarga = document.createElement('a');
  enlaceDescarga.href = URL.createObjectURL(blob);
  enlaceDescarga.download = 'detalle_compra.txt';
  enlaceDescarga.style.display = 'none';
  document.body.appendChild(enlaceDescarga);
  
  enlaceDescarga.click();
  
  document.body.removeChild(enlaceDescarga);
}

// Función para generar el contenido del archivo
function generarContenidoArchivo() {
  let contenido = '';
  let total = 0;

  stickers.forEach((sticker, index) => {
    contenido += `Sticker ${index + 1}: ${sticker.nombre}, Cantidad: ${sticker.cantidad}\n`;

    let subtotal = sticker.cantidad * sticker.precioUnitario;

    if (sticker.cantidad >= 10) {
      let descuento = subtotal * 0.1; 
      subtotal -= descuento;
    }

    total += subtotal;
  });

  contenido += `\nTotal a pagar: $${total}`;

  return contenido;
}


