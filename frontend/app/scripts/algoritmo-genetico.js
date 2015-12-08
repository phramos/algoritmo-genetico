//Taxa de crossover
var taxaCrossover = 70;

//Array que guarda a populacao
var populacao = [0, 0, 0, 0];

//Extensao de Number para inclusao de mmetodo que converte um decimal para binario
Number.prototype.toBin = function() {
    number = this;
    var bin = ((number >>> 0) + ((number >= 0) ? 0 : -1)).toString(2);
    return ((number > 0) ? '0' : '') + bin;
};

String.prototype.to5digit = function() {
    var valor = this;
    if (valor.length<5){
        while (valor.length<5){
            valor = valor.charAt(0) + valor;
        }
    }

    if (valor.length == 32) {
        while (valor.length>5){
            valor = valor.substr(27,5);
        }
    }
    return valor;
};

//Extensao de String para inclusao de metodo que converte um binario para numero decimal
String.prototype.toNumber = function() {
    var aux = 1;
    var number = this;
    if (number.length == 32) {
        for (var i = 0; i < 32; ++i) {
            number = number.substr(0, i) + ((number[i] === '1')? '0' : '1') + number.substr(i+1);
        }
        aux = -1;
    }
    return parseInt(number, 2) * aux;
};

//Gera um inteiro limitado pelos valores de min e max inclusos
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

//Gera a populacao iniciao de 4 individuoes com valores decimais de -10 ate 10
function geraPopulacaoInicial() {
    for(var i = 0; i<4; i++) {
        var numeroSorteado = getRandomInt(-10, 10);
        populacao[i] = numeroSorteado;
    }
};

function crossover() {
    if (Math.random()*100 < taxaCrossover) {

        //Gera indices randomicos dos idividuos da opulacao a serem combinados
        var iPai = getRandomInt(0, 3);
        var iMae = iPai;
        while (iMae == iPai) {
            iMae = getRandomInt(0, 3);
        }
        //pega o valor dos individuos sorteados
        var pai = populacao[iPai];
        var mae = populacao[iMae];


    }
};

//function combinaBinario(iPai, iMae) {
//    var filho1 = populacao.
//}

function calculaFuncao(x) {
    return (x*x) - (3*x) + 4;
};