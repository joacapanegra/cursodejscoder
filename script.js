const stickers = [
  { nombre: "Sticker 1", precioUnitario: 5, cantidad: 0 },
  { nombre: "Sticker 2", precioUnitario: 3, cantidad: 0 },
  { nombre: "Sticker 3", precioUnitario: 7, cantidad: 0 }
];

function calcularTotal() {
  let cantidadInputs = document.getElementsByClassName("cantidad-input");
  let total = 0;
  let isValidInput = true;

  for (let i = 0; i < cantidadInputs.length; i++) {
    let cantidadValue = cantidadInputs[i].value.trim();

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
  } else {
    alert("Por favor, ingrese valores numéricos positivos en los tres campos de cantidad.");
  }

  if (isNaN(total)) {
    alert("El total a pagar es inválido. Por favor, ingrese números válidos en todos los campos de cantidad.");
  }
}
