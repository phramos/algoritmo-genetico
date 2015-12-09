//Taxa de crossover
var taxaCrossover = 70;
var taxaMutacao = 1;
var elite = false;
var tamanhoPopulacao = 30;
var quantidadeGeracoes = 50;


//Array que guarda a populacao
var geracao = [];


function Individuo(bin) {
    this.bin = bin;
    this.decimal = parseInt(bin, 2);
    this.aptidao = calculaFuncao(this.decimal);
};

//Transforma string binarias em string binarias de 5 digitos
String.prototype.to5digit = function() {
    var bin = this;
    if (bin.length<5){
        while (bin.length<5){
            if (bin.charAt(0) == "-"){
                var signal = bin.charAt(0);
                bin = signal + "0" + bin.substr(1, bin.length-1);

            } else {
                bin = "0" + bin;
            }
        }
    }
    return bin;
};

//Extensao da classe Array para clonar arrays
Array.prototype.clone = function() {
    return this.slice(0);
};

//Gera um inteiro limitado pelos valores de min e max inclusos
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

//Gera a populacao iniciao de 4 individuoes com valores decimais de -10 ate 10
function gerarPopulacaoInicial() {
    geracao[0] = {
        populacao: new Array(tamanhoPopulacao)
    };
    for(var i = 0; i<tamanhoPopulacao; i++) {
        var numeroSorteado = getRandomInt(-10, 10);
        geracao[0].populacao[i] = new Individuo(numeroSorteado.toString(2).to5digit());
    }
};

//Tenta gerar novos descendentes
function gerarDescedentes(numeroGeracao) {
    //Gera indices randomicos dos idividuos da opulacao a serem combinados
    var iPai = getRandomInt(0, tamanhoPopulacao-1);
    var iMae = iPai;

    //Garante 2 individuos diferentes
    while (iMae == iPai) {
        iMae = getRandomInt(0, tamanhoPopulacao-1);
    }

    //pega o valor dos individuos sorteados
    //var pai = populacao[iPai];
    //var mae = populacao[iMae];

    //Verifica se ocorrera o crossover
    if (getRandomInt(0,100) < taxaCrossover) {
        crossover(iPai, iMae, numeroGeracao);
    } else {
        geracao[numeroGeracao+1] = {
            populacao: new Array(tamanhoPopulacao)
        };
        geracao[numeroGeracao+1].populacao = geracao[numeroGeracao].populacao.clone()
    }

    //Verifica se ocorrera mutacao
    if(getRandomInt(0, 100) < taxaMutacao) {
        //mutacao();
    }
};

//Aplica o crossover baseando-se na numero da geracao base e os indices do pai e da mae a serem combinados
function crossover(iPai, iMae, numeroGeracao) {
    geracao[numeroGeracao+1] = {
        populacao: geracao[numeroGeracao].populacao.clone()
    }

    var pai = geracao[numeroGeracao+1].populacao[iPai];
    var mae = geracao[numeroGeracao+1].populacao[iMae];

    var filho1 = new Individuo(pai.bin.substr(0,3).concat(mae.bin.substr(3,2)));
    var filho2 = new Individuo(mae.bin.substr(0,3).concat(pai.bin.substr(3,2)));

    //adicionna os filhos na geracao criada no lugar de seus pais
    geracao[numeroGeracao+1].populacao[iPai] = filho1;
    geracao[numeroGeracao+1].populacao[iMae] = filho2;
};

//Aplica a mutacao baseando-se nos individuos do indice informado na geracao informada
function mutacao(iIndividuo1, iIndividuo2, numeroGeracao) {
    //Obtem os indices com base nos indices e geracao
    var individuo1 = geracao[numeroGeracao+1].populacao[iIndividuo1];
    var individuo2 = geracao[numeroGeracao+1].populacao[iIndividuo2];

    //Muta os individuos
    individuo1 = new Individuo(mutar(individuo1.bin));
    individuo2 = new Individuo(mutar(individuo2.bin));

    //Coloca os individuos mutados na geracao
    geracao[numeroGeracao+1].populacao[iIndividuo1] = individuo1;
    geracao[numeroGeracao+1].populacao[iIndividuo2] = individuo2;
};

//Retorna um binario mutando um indice aleatorio
function mutar(bin) {
    var binMutado;
    var indiceMutado = getRandomInt(0, 4);
    if (indiceMutado == 0) {
        if (bin.charArt(indiceMutado) == "-") {
            binMutado = "0".concat(bin.substr(1, 4));
        } else {
            binMutado = "-".concat(bin.substr(1, 4));
        }
    } else {
        if (bin.charAt(indiceMutado) == "0") {
            binMutado = bin.substr(0, indiceMutado) + "1" + bin.substr(indiceMutado+1);
        } else {
            binMutado = bin.substr(0, indiceMutado) + "0" + bin.substr(indiceMutado+1);
        }
    }

    return binMutado;
};

function criarGeracoes(quantidadeGeracoes) {
    for (var i = 0; i<quantidadeGeracoes-1; i++) {
        gerarDescedentes(i);
    }
}

function calculaFuncao(x) {
    return (x*x) - (3*x) + 4;
};

function algoritmoGenetico() {
    gerarPopulacaoInicial();
    criarGeracoes(quantidadeGeracoes);
};