class Sticker {
  constructor(nombre, precioUnitario, cantidad) {
    this.nombre = nombre;
    this.precioUnitario = precioUnitario;
    this.cantidad = cantidad;
  }
}

// Obtener los datos de stickers desde el Storage (localStorage o sessionStorage)
let storedStickers = localStorage.getItem("stickers");
let stickers = [];

if (storedStickers) {
  stickers = JSON.parse(storedStickers);
} else {
  // Si no hay datos en el Storage, crear los datos iniciales
  stickers = [
    new Sticker("Sticker 1", 5, 0),
    new Sticker("Sticker 2", 3, 0),
    new Sticker("Sticker 3", 7, 0)
  ];
}

function actualizarStorage() {
  // Guardar los datos de stickers en el Storage (localStorage o sessionStorage)
  localStorage.setItem("stickers", JSON.stringify(stickers));
}

function actualizarDetalleCompra() {
  let detalleElement = document.getElementById("detalle-compra");

  if (!detalleElement) {
    // Verificar si el elemento "detalle-compra" existe antes de actualizarlo
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
      // Verificar si el input de cantidad existe antes de acceder a él
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
      // Descuento del 10% si se compran 10 o más stickers
      subtotal -= descuento;
    }

    total += subtotal;
  }

  if (isValidInput) {
    let resultadoElement = document.getElementById("total");
    resultadoElement.textContent = "Total a pagar: $" + total;

    // Actualizar el detalle de la compra
    actualizarDetalleCompra();

    // Actualizar el Storage con los datos de stickers
    actualizarStorage();
  } else {
    alert("Por favor, ingrese valores numéricos positivos en los campos de cantidad.");
  }

  if (isNaN(total)) {
    alert("El total a pagar es inválido. Por favor, ingrese números válidos en todos los campos de cantidad.");
  }
}

// Capturar evento click en el botón
document.getElementById("calcularButton").addEventListener("click", calcularTotal);

// Capturar evento de cambio en los inputs de cantidad
const cantidadInputs = document.getElementsByClassName("cantidad-input");
for (let i = 0; i < cantidadInputs.length; i++) {
  cantidadInputs[i].addEventListener("input", calcularTotal);
}
