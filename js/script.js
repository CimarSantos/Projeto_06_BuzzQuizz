let pontos = 0;
let respondidas = 0;
let corretas = 0;
let quizzInfo;
getQuizzes();

function exibirQuizz(el) {
    let id = el.querySelector("ul").innerHTML;
    let promise = axios.get(`https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes/${id}`);
    promise.then(trocaQuizz);
}

function trocaQuizz(info) {
    document.querySelector(".screen2").innerHTML=
    `<div class="imagem-quiz">
        <img src="http://3.bp.blogspot.com/-P_gTm8O4e34/UG79eZn6EBI/AAAAAAAAAW8/2-VKPd2oHzg/s1600/otaku.jpg">
        <div></div>
        <h4>NOME DO QUIZ</h4>
    </div>

    <div class="perguntas">
    </div>
    `
    quizzInfo=info.data;
    let img = document.querySelector(".imagem-quiz").querySelector("img");
    img.setAttribute('src', info.data.image);
    document.querySelector(".imagem-quiz").querySelector("h4").innerHTML = info.data.title;
    let perguntas = document.querySelector(".perguntas");
    perguntas.innerHTML = `<ul class="esconde idRestart"> ${info.data.id}</ul>`;
    pontos = info.data.questions.length;
    respondidas=0;
    corretas=0;
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

        </div>

    </div>`;
            let montarPergunta=perguntas.lastElementChild.querySelector(".opcoes");
            if (info.data.questions[i].answers.length>=3){
                montarPergunta.innerHTML +=
                `
            <div class="opcao ${info.data.questions[i].answers[2].isCorrectAnswer}" onclick="selecionarOpcao(this, ${info.data.questions[i].answers[2].isCorrectAnswer})">
                <img src="${info.data.questions[i].answers[2].image}">
                <h5>${info.data.questions[i].answers[2].text}</h5>
            </div>`;
            }
            if (info.data.questions[i].answers.length>=4){
                montarPergunta.innerHTML +=
            `
            <div class="opcao ${info.data.questions[i].answers[3].isCorrectAnswer}" onclick="selecionarOpcao(this, ${info.data.questions[i].answers[3].isCorrectAnswer})">
                <img src="${info.data.questions[i].answers[3].image}">
                <h5>${info.data.questions[i].answers[3].text}</h5>
            </div>`;
            }
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
    let el = document.querySelector(".screen1");
    el.classList.remove("esconde");
    document.querySelector(".screen2").classList.add("esconde");
    document.querySelector(".cria-quizz-page4").classList.add("esconde");
    scrollToBottom(el, 'start');

}

function scramble() {
    return Math.random() - 0.5;
}

function selecionarOpcao(el, bool) {
    let i=0;
    let pai = el.parentNode;
    pai.classList.add("selecionados");
    if (bool) {
        corretas++;
        el.classList.add("true");
    }
    el.classList.add("selecao");
    respondidas++;
    if (pai.parentNode.nextSibling!==null){
        setTimeout(scrollToBottom, 2000, pai.parentNode.nextSibling, "end");
    }
    if (respondidas===pontos) {
        let pontuacao=Math.round((corretas/pontos)*100);
        while (quizzInfo.levels[i].minValue>pontuacao) {
            i++;
        }
        loadNivel(i);
    }
}
function loadNivel(i){
    let nivel = document.querySelector(".perguntas");
    nivel.parentNode.innerHTML+=
`<div class="nivel">
    <div class="nivel-text">
        <h5>
            ${quizzInfo.levels[i].title}
        </h5>
    </div>
    <img src="${quizzInfo.levels[i].image}">
    <p>${quizzInfo.levels[i].text}</p>
</div>
<div class="botoes-final">
    <button class="restart" onclick="restart()">Reiniciar Quizz</button>
    <h4 class="back" onclick="backHome()">Voltar pra home</h4>
</div>`
    setTimeout(desceNivel, 2000);
}
function desceNivel() {
    let el = document.querySelector(".nivel");
    scrollToBottom(el, 'start');
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

function infoBasicasQuizz(tituloQuizz, urlImagemQuizz) {

    tituloQuizz = document.querySelector("#tituloQuizz").value;

    console.log(tituloQuizz.length);

    if (tituloQuizz.length < 20) {
        alert("O título deve ter pelo menos 20 caracteres");
        document.querySelector("#tituloQuizz").classList.add("inputError");
        document.querySelector("#tituloQuizz").value = '';
    } else {
        document.querySelector("#tituloQuizz").classList.remove("inputError");
    }

}
function restart() {
    let id = document.querySelector(".idRestart").innerHTML;
    let promise = axios.get(`https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes/${id}`);
    promise.then(trocaQuizz);
}
function teste(id){
    let promise = axios.get(`https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes/${id}`);
    promise.then(trocaQuizz);   
}