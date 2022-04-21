let pontos=0;
let respondidas=0;
let corretas=0;
getQuizzes();
function exibirQuizz(el) {
    let id = el.querySelector("ul").innerHTML;
    let promise = axios.get(`https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes/${id}`);
    promise.then(trocaQuizz);
}
function trocaQuizz(info) {
    let img = document.querySelector(".imagem-quiz").querySelector("img");
    img.setAttribute('src',info.data.image);
    document.querySelector(".imagem-quiz").querySelector("h4").innerHTML = info.data.title;
    let perguntas = document.querySelector(".perguntas");
    perguntas.innerHTML='';
    pontos=info.data.questions.length;
    for (let i=0; i<info.data.questions.length; i++) {
    info.data.questions[i].answers = info.data.questions[i].answers.sort(scramble);
    perguntas.innerHTML+=
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
    scrollToBottom(img);
}
function getQuizzes() {
    let promise = axios.get("https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes");
    promise.then(loadQuizzes);
}
function loadQuizzes(info) {
    let quizzes = document.querySelector(".todos-os-quizzes .area-quizzes");
    quizzes.innerHTML = '';
    for (let i=0; i<info.data.length; i++) {
        quizzes.innerHTML+= `
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
    console.log(el.nextSibling);
    setTimeout(scrollToBottom(el.nextSibling), 2000);
}

function scrollToBottom(el) {
    el.scrollIntoView(true);
}