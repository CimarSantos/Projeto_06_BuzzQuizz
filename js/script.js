//getQuizzes();
function exibirQuizz() {
    document.querySelector(".screen1").classList.add("esconde");
    document.querySelector(".screen2").classList.remove("esconde");
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
        <div class="box-quizz flex" onclick="exibirQuizz()">
            <div class="title-quizz">
                <h3>${info.data[i].title}</h3>
            </div>
        </div>`
    }
}