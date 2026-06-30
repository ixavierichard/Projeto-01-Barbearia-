// =========================
// ELEMENTOS
// =========================

const servicos = document.querySelectorAll(".servico-card");
const barbeiros = document.querySelectorAll(".barbeiro-card");

const preview = document.getElementById("previewServico");
const totalDiv = document.getElementById("total");

const campoServico = document.getElementById("servico");
const campoBarbeiro = document.getElementById("barbeiro");
const campoHora = document.getElementById("hora");

const agenda = document.getElementById("agenda");
const horariosDiv = document.getElementById("horarios");

// =========================
// DADOS
// =========================

let servicosSelecionados = [];
let barbeiroSelecionado = "";
let horarioSelecionado = "";

// preços

const precos = {
    Corte: 40,
    Barba: 30,
    Sobrancelha: 20
};

// imagens

const imagens = {
    Corte: "img/corte.jpeg",
    Barba: "img/barba.jpg",
    Sobrancelha: "img/sobrancelha.jpeg"
};

// =========================
// SERVIÇOS
// =========================

servicos.forEach(card => {

    card.addEventListener("click", () => {

        const servico = card.dataset.servico;

        card.classList.toggle("selected");

        if (servicosSelecionados.includes(servico)) {

            servicosSelecionados =
                servicosSelecionados.filter(
                    item => item !== servico
                );

        } else {

            servicosSelecionados.push(servico);

        }

        atualizarServico();
        atualizarPreview();
        atualizarTotal();

    });

});

// =========================
// ATUALIZAR SERVIÇOS
// =========================

function atualizarServico() {

    campoServico.value =
        servicosSelecionados.join(", ");

}

// =========================
// IMAGENS DOS SERVIÇOS
// =========================

function atualizarPreview() {

    preview.innerHTML = "";

    servicosSelecionados.forEach(servico => {

        const img = document.createElement("img");

        img.src = imagens[servico];

        img.alt = servico;

        preview.appendChild(img);

    });

}

// =========================
// TOTAL
// =========================

function atualizarTotal() {

    let total = 0;

    servicosSelecionados.forEach(servico => {

        total += precos[servico];

    });

    totalDiv.textContent =
        `Total: R$ ${total}`;

}

// =========================
// BARBEIROS
// =========================

barbeiros.forEach(card => {

    card.addEventListener("click", () => {

        barbeiros.forEach(item =>
            item.classList.remove("selected")
        );

        card.classList.add("selected");

        barbeiroSelecionado =
            card.dataset.barbeiro;

        campoBarbeiro.value =
            barbeiroSelecionado;

        agenda.classList.remove("hidden");

        gerarHorarios();

    });

});

// =========================
// HORÁRIOS
// =========================

function gerarHorarios() {

    horariosDiv.innerHTML = "";

    for (let hora = 7; hora <= 20; hora++) {

        ["00", "30"].forEach(minuto => {

            if (hora === 20 && minuto === "30") {
                return;
            }

            const horario =
                `${hora.toString().padStart(2, "0")}:${minuto}`;

            const card =
                document.createElement("div");

            card.classList.add("card");

            card.textContent = horario;

            card.addEventListener("click", () => {

                document
                    .querySelectorAll("#horarios .card")
                    .forEach(item =>
                        item.classList.remove("selected")
                    );

                card.classList.add("selected");

                horarioSelecionado =
                    horario;

                campoHora.value =
                    horario;

            });

            horariosDiv.appendChild(card);

        });

    }

}

// =========================
// DATA MÍNIMA = HOJE
// =========================

const campoData =
    document.getElementById("data");

const hoje =
    new Date().toISOString().split("T")[0];

campoData.min = hoje;

// =========================
// ENVIO WHATSAPP
// =========================

document
    .getElementById("formAgendamento")
    .addEventListener("submit", function (e) {

        e.preventDefault();

        const nome =
            document.getElementById("nome").value;

        const telefone =
            document.getElementById("telefone").value;

        const data =
            document.getElementById("data").value;

        if (servicosSelecionados.length === 0) {

            alert("Selecione ao menos um serviço.");

            return;
        }

        if (!barbeiroSelecionado) {

            alert("Selecione um barbeiro.");

            return;
        }

        if (!data) {

            alert("Selecione uma data.");

            return;
        }

        if (!horarioSelecionado) {

            alert("Selecione um horário.");

            return;
        }

        let total = 0;

        servicosSelecionados.forEach(servico => {

            total += precos[servico];

        });

        const mensagem =

`Olá!

Gostaria de agendar um horário.

👤 Nome: ${nome}

📱 Telefone: ${telefone}

✂️ Serviços:
${servicosSelecionados.join(", ")}

💰 Total: R$ ${total}

💈 Barbeiro:
${barbeiroSelecionado}

📅 Data:
${data}

⏰ Horário:
${horarioSelecionado}`;

        const numeroWhatsapp =
            "5547988598578";

        const url =
            `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(mensagem)}`;

        window.open(url, "_blank");

    });