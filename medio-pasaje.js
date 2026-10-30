var ESTADOS = ["Registrado", "Foto validada", "Enviado a Minedu", "En proceso", "Listo para recojo"];
var etapa = 0;
var nota = 0;
var datos = {};

function $(id) { return document.getElementById(id); }

/* ---------- Navegación entre pasos (2 a 6) ---------- */
function mostrar(n) {
  for (var i = 2; i <= 6; i++) $("paso-" + i).hidden = (i !== n);
  document.querySelectorAll(".paso").forEach(function (el) {
    var k = +el.dataset.n;
    el.className = "paso" + (k < n ? " hecho" : (k === n ? " actual" : ""));
    el.firstElementChild.textContent = k < n ? "✓" : k;
  });
  if (n === 4) pintarSeguimiento();
  window.scrollTo(0, 0);
}

/* ---------- Paso 2: vista previa del carné ---------- */
function recortar(t, n) { return t.length > n ? t.slice(0, n - 1) + "…" : t; }

function actualizarCarne() {
  $("c-nom").textContent = recortar($("nom").value.trim() || "Nombres completos", 30);
  $("c-dni").textContent = $("dni").value.trim() || "00000000";
  $("c-car").textContent = recortar($("car").value.trim() || "Tu carrera", 30);
  $("c-cic").textContent = $("ciclo").value;
  $("c-sed").textContent = $("sede").value;
}
["nom", "dni", "car"].forEach(function (id) { $(id).addEventListener("input", actualizarCarne); });
["ciclo", "sede"].forEach(function (id) { $(id).addEventListener("change", actualizarCarne); });
actualizarCarne();

/* ---------- Paso 2: validación y envío ---------- */
$("formulario").addEventListener("submit", function (e) {
  e.preventDefault();
  var d = {
    nom: $("nom").value.trim(),
    dni: $("dni").value.trim(),
    car: $("car").value.trim(),
    mail: $("mail").value.trim(),
    ciclo: $("ciclo").value,
    sede: $("sede").value
  };
  var ok = true;
  function validar(id, cumple, msg) {
    $("e-" + id).textContent = cumple ? "" : msg;
    if (!cumple) ok = false;
  }
  validar("nom", d.nom.split(/\s+/).length >= 2, "Ingresa tus nombres completos.");
  validar("dni", /^\d{8}$/.test(d.dni), "El DNI debe tener 8 dígitos.");
  validar("mail", /^\S+@\S+\.\S+$/.test(d.mail), "Ingresa tu correo institucional.");
  validar("car", d.car.length > 2, "Indica tu carrera.");
  if (!ok) return;

  datos = d;
  var codigo = "CMP-" + new Date().getFullYear() + "-" + (Math.floor(Math.random() * 90000) + 10000);
  $("codigo").textContent = codigo;
  $("codigo2").textContent = codigo;
  $("correo").textContent = d.mail;
  etapa = 0;
  mostrar(3);
});

/* ---------- Paso 3 y 4: seguimiento ---------- */
$("ver-seguimiento").addEventListener("click", function () { mostrar(4); });

function pintarSeguimiento() {
  document.querySelectorAll(".evento").forEach(function (el) {
    var i = +el.dataset.i;
    el.className = "evento" + (i < etapa ? " hecho" : (i === etapa ? " actual" : ""));
    el.firstElementChild.textContent = i < etapa ? "✓" : i + 1;
  });
  $("estado").textContent = ESTADOS[etapa];
}

$("avanzar").addEventListener("click", function () {
  etapa++;
  if (etapa >= ESTADOS.length - 1) {
    etapa = ESTADOS.length - 1;
    $("sede-recojo").textContent = datos.sede;
    mostrar(5);
  } else {
    pintarSeguimiento();
  }
});

/* ---------- Paso 5: pago y cierre ---------- */
document.querySelectorAll(".pago").forEach(function (b) {
  b.addEventListener("click", function () {
    b.textContent = "Pago registrado";
    b.disabled = true;
  });
});
$("finalizar").addEventListener("click", function () { mostrar(6); });

/* ---------- Paso 6: encuesta ---------- */
function pintarEstrellas() {
  $("estrellas").innerHTML = [1, 2, 3, 4, 5].map(function (n) {
    return '<button type="button" data-n="' + n + '" class="' + (n <= nota ? "on" : "") + '" aria-label="' + n + ' estrellas">★</button>';
  }).join("");
  $("estrellas").querySelectorAll("button").forEach(function (b) {
    b.addEventListener("click", function () {
      nota = +b.dataset.n;
      pintarEstrellas();
      $("enviar").disabled = false;
    });
  });
}
pintarEstrellas();

$("enviar").addEventListener("click", function () {
  $("nota").textContent = nota;
  $("encuesta").hidden = true;
  $("gracias").hidden = false;
});

/* ---------- Inicio: el paso 1 (ISIL|NET) ya se completó ---------- */
mostrar(2);
