let pontos = 0;
let respondidas = 0;
let corretas = 0;
let quizzInfo;
let numberOfQuestions=0;
let numberOfLevels=0;
let newQuizz= {
    title: "Título do quizz",
	image: "https://http.cat/411.jpg",
	questions: [],
    levels: [
		{
			title: "Título do nível 1",
			image: "https://http.cat/411.jpg",
			text: "Descrição do nível 1",
			minValue: 0
		}
	]
}
getQuizzes();
function exibirQuizz(el) {
    let id = el.querySelector("ul").innerHTML;
    let promise = axios.get(`https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes/${id}`);
    promise.then(trocaQuizz);
}

function trocaQuizz(info) {
    document.querySelector(".screen2").innerHTML =
        `<div class="imagem-quiz">
        <img src="http://3.bp.blogspot.com/-P_gTm8O4e34/UG79eZn6EBI/AAAAAAAAAW8/2-VKPd2oHzg/s1600/otaku.jpg">
        <div></div>
        <h4>NOME DO QUIZ</h4>
    </div>

    <div class="perguntas">
    </div>
    `
    quizzInfo = info.data;
    let img = document.querySelector(".imagem-quiz").querySelector("img");
    img.setAttribute('src', info.data.image);
    document.querySelector(".imagem-quiz").querySelector("h4").innerHTML = info.data.title;
    let perguntas = document.querySelector(".perguntas");
    perguntas.innerHTML = `<ul class="esconde idRestart"> ${info.data.id}</ul>`;
    pontos = info.data.questions.length;
    respondidas = 0;
    corretas = 0;
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
        let montarPergunta = perguntas.lastElementChild.querySelector(".opcoes");
        if (info.data.questions[i].answers.length >= 3) {
            montarPergunta.innerHTML +=
                `
            <div class="opcao ${info.data.questions[i].answers[2].isCorrectAnswer}" onclick="selecionarOpcao(this, ${info.data.questions[i].answers[2].isCorrectAnswer})">
                <img src="${info.data.questions[i].answers[2].image}">
                <h5>${info.data.questions[i].answers[2].text}</h5>
            </div>`;
        }
        if (info.data.questions[i].answers.length >= 4) {
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
    getQuizzes();
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
    let i = 0;
    let pai = el.parentNode;
    pai.classList.add("selecionados");
    if (bool) {
        corretas++;
        el.classList.add("true");
    }
    el.classList.add("selecao");
    respondidas++;
    if (pai.parentNode.nextSibling !== null) {
        setTimeout(scrollToBottom, 2000, pai.parentNode.nextSibling, "end");
    }
    if (respondidas === pontos) {
        let pontuacao = Math.round((corretas / pontos) * 100);
        while (quizzInfo.levels[i].minValue > pontuacao) {
            i++;
        }
        loadNivel(i);
    }
}

function loadNivel(i) {
    let nivel = document.querySelector(".perguntas");
    nivel.parentNode.innerHTML +=
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
    newQuizz.title = document.getElementById("tituloQuizz").value;
    newQuizz.image = document.getElementById("urlImagemQuizz").value;
    numberOfQuestions = document.getElementById("qtdPerguntas").value;
    numberOfLevels = document.getElementById("qtdNiveis").value;

    let campos = document.querySelector(".cria-quizz-page2");
    campos.innerHTML= `        
    <h2 class="page-title flex">Crie suas perguntas</h2>
    <div class="flex">
        <form action="" method="post" class="expandido selecaoPerguntas">
            <div class="flex">
                <label>Pergunta 1</label>
                <ion-icon name="paper" onclick="expandirQuizz(this)"></ion-icon>
            </div>
            <div class="pergunta1">
                <div>
                    <input type="text" name="textoPergunta" id="textoPergunta" placeholder="Texto da pergunta">
                    <input type="text" name="corFundoPergunta" id="corFundoPergunta" placeholder="Cor de fundo da pergunta">
                </div>
                <div class="right">
                    <label>Resposta correta</label>
                    <input type="text" name="respostaCorreta" id="respostaCorreta" placeholder="Resposta correta">
                    <input type="url" name="urlImagem" id="urlImagem" placeholder="URL da imagem">
                </div>
                <div class="wrong1">
                    <label>Respostas incorretas</label>
                    <input type="text" name="respostaIncorreta1" id="respostaIncorreta1" placeholder="Resposta incorreta 1">
                    <input type="url" name="urlImagem" id="urlImagem" placeholder="URL da imagem 1">
                </div>
                <div class="wrong2">
                    <input type="text" name="respostaIncorreta2" id="respostaIncorreta2" placeholder="Resposta incorreta 2">
                    <input type="url" name="urlImagem" id="urlImagem" placeholder="URL da imagem 2">
                </div>
                <div class="wrong3">
                    <input type="text" name="respostaIncorreta3" id="respostaIncorreta3" placeholder="Resposta incorreta 3">
                    <input type="url" name="urlImagem" id="urlImagem" placeholder="URL da imagem 3">
                </div>
            </div>
            
        </form>
    </div>
    `
    for (let i=1; i<numberOfQuestions; i++) {
        campos.innerHTML+=`
        <div class="flex">
        <form action="" method="post" class="selecaoPerguntas">
            <div class="flex">
                <label>Pergunta ${i+1}</label>
                <ion-icon name="paper" onclick="expandirQuizz(this)"></ion-icon>
            </div>
            <div class="pergunta${i+1}">
                <div>
                    <input type="text" name="textoPergunta" id="textoPergunta" placeholder="Texto da pergunta">
                    <input type="text" name="corFundoPergunta" id="corFundoPergunta" placeholder="Cor de fundo da pergunta">
                </div>
                <div class="right">
                    <label>Resposta correta</label>
                    <input type="text" name="respostaCorreta" id="respostaCorreta" placeholder="Resposta correta">
                    <input type="url" name="urlImagem" id="urlImagem" placeholder="URL da imagem">
                </div>
                <div class="wrong1">
                    <label>Respostas incorretas</label>
                    <input type="text" name="respostaIncorreta1" id="respostaIncorreta1" placeholder="Resposta incorreta 1">
                    <input type="url" name="urlImagem" id="urlImagem" placeholder="URL da imagem 1">
                </div>
                <div class="wrong2">
                    <input type="text" name="respostaIncorreta2" id="respostaIncorreta2" placeholder="Resposta incorreta 2">
                    <input type="url" name="urlImagem" id="urlImagem" placeholder="URL da imagem 2">
                </div>
                <div class="wrong3">
                    <input type="text" name="respostaIncorreta3" id="respostaIncorreta3" placeholder="Resposta incorreta 3">
                    <input type="url" name="urlImagem" id="urlImagem" placeholder="URL da imagem 3">
                </div>
            </div>
        </form>

    </div>
    `
    }
    campos.innerHTML+=`
    <div class="flex">
    <button class="btn-form2" type="submit" onclick="criarQuizzToPage3()">
        Prosseguir pra criar níveis
    </button>
</div>
    `

    document.querySelector(".cria-quizz-page1").classList.add("esconde");
    document.querySelector(".cria-quizz-page2").classList.remove("esconde");
}

function criarQuizzToPage3() {
    let entradas = document.querySelector(".pergunta1");
    let primeiro = entradas.querySelector(":nth-child(1)")
    let extra;
    let novaPergunta = {
        title: primeiro.querySelector(":nth-child(1)").value,
		color: primeiro.querySelector(":nth-child(2)").value,
		answers: [
			{
				text: entradas.querySelector(".right :nth-child(2)").value,
				image: entradas.querySelector(".right :nth-child(2)").value,
				isCorrectAnswer: true
			},
            {
                text: entradas.querySelector(".wrong1 :nth-child(2)").value,
                image: entradas.querySelector(".wrong1 :nth-child(3)").value,
                isCorrectAnswer: false
            }
        ]
    }
    if (entradas.querySelector(".wrong2 :nth-child(1)").value!='') {
        extra = {
            text: entradas.querySelector(".wrong2 :nth-child(1)").value,
            image: entradas.querySelector(".wrong2 :nth-child(2)").value,
            isCorrectAnswer: false
        }
        novaPergunta.answers.push(extra);
    }
    if (entradas.querySelector(".wrong3 :nth-child(1)").value!='') {
        extra = {
            text: entradas.querySelector(".wrong3 :nth-child(1)").value,
            image: entradas.querySelector(".wrong3 :nth-child(2)").value,
            isCorrectAnswer: false
        }
        novaPergunta.answers.push(extra);
    }
    newQuizz.questions.push(novaPergunta);
    for (let i=1; i<numberOfQuestions; i++) {
        entradas = document.querySelector(`.pergunta${i+1}`);
        novaPergunta = {
            title: entradas.querySelector("input").value,
            color: entradas.querySelector(":nth-child(2)").value,
            answers: [
                {
                    text: entradas.querySelector(".right :nth-child(2)").value,
                    image: entradas.querySelector(".right :nth-child(2)").value,
                    isCorrectAnswer: true
                },
                {
                    text: entradas.querySelector(".wrong1 :nth-child(2)").value,
                    image: entradas.querySelector(".wrong1 :nth-child(3)").value,
                    isCorrectAnswer: false
                }
            ]
        }
        if (entradas.querySelector(".wrong2 :nth-child(1)").value!='') {
            extra = {
                text: entradas.querySelector(".wrong2 :nth-child(1)").value,
                image: entradas.querySelector(".wrong2 :nth-child(2)").value,
                isCorrectAnswer: false
            }
            novaPergunta.answers.push(extra);
        }
        if (entradas.querySelector(".wrong3 :nth-child(1)").value!='') {
            extra = {
                text: entradas.querySelector(".wrong3 :nth-child(1)").value,
                image: entradas.querySelector(".wrong3 :nth-child(2)").value,
                isCorrectAnswer: false
            }
            novaPergunta.answers.push(extra);
        }
        newQuizz.questions.push(novaPergunta);
    }
    let pag3 = document.querySelector(".cria-quizz-page3");
    pag3.innerHTML=`
    <h2 class="page-title flex">Agora, decida os níveisa</h2>
    <div class="flex">
        <form action="" method="post" class="selecaoNiveis expandido">
            <div class="flex">
                <label>Nível 1</label>
                <ion-icon name="paper" onclick="expandirNivel(this)"></ion-icon>
            </div>
            <div class="nivel1">
                <input type="text" name="tituloNivel2" id="tituloNivel2" placeholder="Título do nível">
                <input type="number" name="porcentoAcertoMinimo2" id="porcentoAcertoMinimo2" placeholder="% de acerto mínima">
                <input type="url" name="urlImagemNivel2" id="urlImagemNivel2" placeholder="URL da imagem do nível">
                <input type="text" name="descricaoNivel2" id="descricaoNivel2" placeholder="Descrição do Nível">
            </div>
        </form>
    </div>`;
    for (let i=1; i<numberOfLevels; i++) {
        pag3.innerHTML+= `
        <div class="flex">
            <form action="" method="post" class="selecaoNiveis">
                <div class="flex">
                    <label>Nível ${i+1}</label>
                    <ion-icon name="paper" onclick="expandirNivel(this)"></ion-icon>
                </div>
                <div class="nivel${i+1}">
                    <input type="text" name="tituloNivel2" id="tituloNivel2" placeholder="Título do nível">
                    <input type="number" name="porcentoAcertoMinimo2" id="porcentoAcertoMinimo2" placeholder="% de acerto mínima">
                    <input type="url" name="urlImagemNivel2" id="urlImagemNivel2" placeholder="URL da imagem do nível">
                    <input type="text" name="descricaoNivel2" id="descricaoNivel2" placeholder="Descrição do Nível">
                </div>
            </form>
        </div>
        `;
    }
    pag3.innerHTML+=`
    <div class="flex">
        <button class="btn-form3" type="submit" onclick="criarQuizzToPage4()">
            Finalizar quizz
        </button>
    </div>`;
    document.querySelector(".cria-quizz-page2").classList.add("esconde");
    document.querySelector(".cria-quizz-page3").classList.remove("esconde");
}

function criarQuizzToPage4() {
    let pag4=document.querySelector(".cria-quizz-page4")
    pag4.querySelector(".title-quizz").querySelector("h3").innerHTML = newQuizz.title;
    pag4.querySelector(".caixa-quizz").querySelector("img").setAttribute('src', newQuizz.image);

    pag4.classList.remove("esconde");
    document.querySelector(".cria-quizz-page3").classList.add("esconde");
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

    let result;
    document.querySelector("#urlImagemQuizz").addEventListener("change", function() {

        let regex = XRegExp("[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?");
        urlImageQuizz = document.querySelector("#urlImagemQuizz").value;
        result = regex.test(urlImageQuizz);

        if (result !== true || result === '') {
            alert("Digite corretamente a URL da imagem do seu quizz");
            document.querySelector("#urlImagemQuizz").classList.add("inputError");
        } else {
            document.querySelector("#urlImagemQuizz").classList.remove("inputError");
        }

    });

    document.querySelector("#qtdPerguntas").addEventListener("change", function() {

        qtdPerguntas = document.querySelector("#qtdPerguntas").value;

        if (qtdPerguntas < 3) {
            alert("O seu quizz deve ter no mínimo 3 perguntas");
            document.querySelector("#qtdPerguntas").classList.add("inputError");
            document.querySelector("#qtdPerguntas").value = 3;
        } else {
            document.querySelector("#qtdPerguntas").classList.remove("inputError");
        }
    });

    document.querySelector("#qtdNiveis").addEventListener("change", function() {

        qtdNiveis = document.querySelector("#qtdNiveis").value;

        if (qtdNiveis < 2) {
            alert("O seu quizz deve ter no mínimo 2 níveis");
            document.querySelector("#qtdNiveis").classList.add("inputError");
            document.querySelector("#qtdNiveis").value = 2;
        } else {
            document.querySelector("#qtdNiveis").classList.remove("inputError");
        }
    });

    let URL = document.querySelector("#urlImagemQuizz").classList.contains("inputError");
    let numPerguntas = document.querySelector("#qtdPerguntas").value;
    let numNiveis = document.querySelector("#qtdNiveis").value;
    if (tituloQuizz.length >= 20 && URL !== true && numPerguntas >= 3 && numNiveis >= 2) {
        document.querySelector(".btn-form1").removeAttribute("disabled");
    }
}

function restart() {
    let id = document.querySelector(".idRestart").innerHTML;
    let promise = axios.get(`https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes/${id}`);
    promise.then(trocaQuizz);
}

function expandirQuizz(el){
    document.querySelector(".expandido").classList.remove("expandido");
    el.parentNode.parentNode.classList.add("expandido");
}

function expandirNivel(el){
    document.querySelector(".selecaoNiveis.expandido").classList.remove("expandido");
    el.parentNode.parentNode.classList.add("expandido");
}

function teste(id) {
    let promise = axios.get(`https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes/${id}`);
    promise.then(trocaQuizz);
}