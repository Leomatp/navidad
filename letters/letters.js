emailjs.init("HKo0g5Xhcfpf7mg_5");

const form = document.getElementById("letterForm");

form.addEventListener("submit", function(e){

e.preventDefault();

const from_name =
document.getElementById("from_name").value;

const message =
document.getElementById("message").value;

const to_email=
document.getElementById("to_email").value;

emailjs.send(
"service_bel7udg",
"template_lk17oi9",
{
from_name: from_name,
message: message,
to_email: to_email
}
)
.then(() => {

document.getElementById("successMessage").textContent =
"Carta enviada correctamente 💗";

form.reset();

})
.catch((error) => {

document.getElementById("successMessage").textContent =
"Error al enviar";

console.log(error);

});

});