let pontos = 0;
let respondidas = 0;
let corretas = 0;
getQuizzes();

function exibirQuizz(el) {
    let id = el.querySelector("ul").innerHTML;
    let promise = axios.get(`https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes/${id}`);
    promise.then(trocaQuizz);
}

function trocaQuizz(info) {
    let img = document.querySelector(".imagem-quiz").querySelector("img");
    img.setAttribute('src', info.data.image);
    document.querySelector(".imagem-quiz").querySelector("h4").innerHTML = info.data.title;
    let perguntas = document.querySelector(".perguntas");
    perguntas.innerHTML = '';
    pontos = info.data.questions.length;
    for (let i = 0; i < info.data.questions.length; i++) {
        info.data.questions[i].answers = info.data.questions[i].answers.sort(scramble);
        perguntas.innerHTML +=
            `<div class="pergunta">

            <div class="pergunta-text" style="background-color:${info.data.questions[i].color}">
                <h4>${info.data.questions[i].title}</h4>
            </div>

        <div class="opcoes">

            <div class="opcao ${info.data.questions[i].answers[0].isCorrectAnswer}" onclick="selecionarOpcao(this, ${info.data.questions[i].answers[0].isCorrectAnswer})">
                <img src="${info.data.questions[i].answers[0].image}">
                <h5>${info.data.questions[i].answers[0].text}</h5>
            </div>
            <div class="opcao ${info.data.questions[i].answers[1].isCorrectAnswer}" onclick="selecionarOpcao(this, ${info.data.questions[i].answers[1].isCorrectAnswer})">
                <img src="${info.data.questions[i].answers[1].image}">
                <h5>${info.data.questions[i].answers[1].text}</h5>
            </div>
            <div class="opcao ${info.data.questions[i].answers[2].isCorrectAnswer}" onclick="selecionarOpcao(this, ${info.data.questions[i].answers[2].isCorrectAnswer})">
                <img src="${info.data.questions[i].answers[2].image}">
                <h5>${info.data.questions[i].answers[2].text}</h5>
            </div>
            <div class="opcao ${info.data.questions[i].answers[3].isCorrectAnswer}" onclick="selecionarOpcao(this, ${info.data.questions[i].answers[3].isCorrectAnswer})">
                <img src="${info.data.questions[i].answers[3].image}">
                <h5>${info.data.questions[i].answers[3].text}</h5>
            </div>

        </div>

    </div>`
    }
    document.querySelector(".screen1").classList.add("esconde");
    document.querySelector(".screen2").classList.remove("esconde");
    scrollToBottom(img, "start");
}

function getQuizzes() {
    let promise = axios.get("https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes");
    promise.then(loadQuizzes);
}

function loadQuizzes(info) {
    let quizzes = document.querySelector(".todos-os-quizzes .area-quizzes");
    quizzes.innerHTML = '';
    for (let i = 0; i < info.data.length; i++) {
        quizzes.innerHTML += `
        <div class="caixa-quizz" onclick="exibirQuizz(this)">
            <ul class="idQuizz esconde">${info.data[i].id}</ul>
            <img src="${info.data[i].image}">
            <div class="shadow-quizz flex">
                <div class="title-quizz">
                    <h3>${info.data[i].title}</h3>
                </div>
            </div>
        </div>`
    }
}

function backHome() {
    document.querySelector(".screen1").classList.remove("esconde");
    document.querySelector(".screen2").classList.add("esconde");
    document.querySelector(".cria-quizz-page4").classList.add("esconde");
}

function scramble() {
    return Math.random() - 0.5;
}

function selecionarOpcao(el, bool) {
    let pai = el.parentNode;
    pai.classList.add("selecionados");
    if (bool) {
        corretas++;
        el.classList.add("true");
    }
    el.classList.add("selecao");
    respondidas++;
    setTimeout(scrollToBottom, 2000, pai.parentNode.nextSibling, "end");
}

function scrollToBottom(el) {
    el.scrollIntoView(true);
}

function criarQuizz() {
    document.querySelector(".screen1").classList.add("esconde");
    document.querySelector(".cria-quizz-page1").classList.remove("esconde");

}

function criarQuizzToPage2() {
    document.querySelector(".cria-quizz-page1").classList.add("esconde");
    document.querySelector(".cria-quizz-page2").classList.remove("esconde");

}

function criarQuizzToPage3() {
    document.querySelector(".cria-quizz-page2").classList.add("esconde");
    document.querySelector(".cria-quizz-page3").classList.remove("esconde");
}

function criarQuizzToPage4() {
    document.querySelector(".cria-quizz-page3").classList.add("esconde");
    document.querySelector(".cria-quizz-page4").classList.remove("esconde");
}

function scrollToBottom(el, local) {
    el.scrollIntoView({ block: local, behavior: 'smooth' });
}

function infoBasicasQuizz(tituloQuizz, urlImageQuizz, qtdPerguntas, qtdNiveis) {

    tituloQuizz = document.querySelector("#tituloQuizz").value;

    if (tituloQuizz.length < 20) {
        alert("O título deve ter pelo menos 20 caracteres");
        document.querySelector("#tituloQuizz").classList.add("inputError");
        document.querySelector("#tituloQuizz").value = '';
    } else {
        document.querySelector("#tituloQuizz").classList.remove("inputError");
    }


    document.querySelector("#urlImagemQuizz").addEventListener("mouseout", function() {

        let regex = XRegExp("[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?");
        urlImageQuizz = document.querySelector("#urlImagemQuizz").value;
        let result = regex.test(urlImageQuizz);

        if (result !== true || result === '') {
            alert("Digite corretamente a URL da imagem do seu quizz");
            document.querySelector("#urlImagemQuizz").classList.add("inputError");
            document.querySelector("#urlImagemQuizz").value = '';

        } else {
            document.querySelector("#urlImagemQuizz").classList.remove("inputError");
        }

    });

    document.querySelector("#qtdPerguntas").addEventListener("mouseout", function() {

        qtdPerguntas = document.querySelector("#qtdPerguntas").value;

        if (qtdPerguntas !== true && qtdPerguntas < 3) {
            alert("O seu quizz deve ter no mínimo 3 perguntas");
            document.querySelector("#qtdPerguntas").classList.add("inputError");
            document.querySelector("#qtdPerguntas").value = '';
        } else {
            document.querySelector("#qtdPerguntas").classList.remove("inputError");
        }
    });

    document.querySelector("#qtdNiveis").addEventListener("mouseout", veNivel = () => {

        qtdNiveis = document.querySelector("#qtdNiveis").value;

        if (qtdNiveis < 2) {
            alert("O seu quizz deve ter no mínimo 2 níveis");
            document.querySelector("#qtdNiveis").classList.add("inputError");
            document.querySelector("#qtdNiveis").value = '';
        } else {
            document.querySelector("#qtdNiveis").classList.remove("inputError");
        }
    });

}