/**
 * Created by fauno on 12/9/15.
 */
(function($) {
    var modulo = angular.module('appModule', []);

    modulo.controller('AppCtrl', function($scope) {
        $scope.taxaCrossover = 70;
        $scope.taxaMutacao = 1;
        $scope.elite = false;
        $scope.tamanhoPopulacao = 30;
        $scope.quantidadeGeracoes = 50;

        $scope.geracao = [];


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
        $scope.gerarPrimeiraGeracao = function gerarPopulacaoInicial() {
            $scope.geracao[0] = {
                descricao: "Geração Inicial",
                populacao: new Array(this.tamanhoPopulacao)

            };
            for(var i = 0; i<this.tamanhoPopulacao; i++) {
                var numeroSorteado = getRandomInt(-10, 10);
                $scope.geracao[0].populacao[i] = new Individuo(numeroSorteado.toString(2).to5digit());
            }
        };

//Tenta gerar novos descendentes
       $scope.gerarDescendentes =  function gerarDescedentes(numeroGeracao) {
            //Gera indices randomicos dos idividuos da opulacao a serem combinados
            var iPai = getRandomInt(0, $scope.tamanhoPopulacao-1);
            var iMae = iPai;

            //Garante 2 individuos diferentes
            while (iMae == iPai) {
                iMae = getRandomInt(0, $scope.tamanhoPopulacao-1);
            }

            //pega o valor dos individuos sorteados
            //var pai = populacao[iPai];
            //var mae = populacao[iMae];

            //Verifica se ocorrera o crossover
            if (getRandomInt(0,100) < $scope.taxaCrossover) {
                $scope.crossover(iPai, iMae, numeroGeracao);
            } else {
                $scope.geracao[numeroGeracao+1] = {
                    descricao: "Geração " + (numeroGeracao+1),
                    populacao: new Array($scope.tamanhoPopulacao)
                };
                $scope.geracao[numeroGeracao+1].populacao = $scope.geracao[numeroGeracao].populacao.clone()
            }

            //Verifica se ocorrera mutacao
            if(getRandomInt(0, 100) < $scope.taxaMutacao) {
                //mutacao();
            }
        };

//Aplica o crossover baseando-se na numero da geracao base e os indices do pai e da mae a serem combinados
        $scope.crossover = function crossover(iPai, iMae, numeroGeracao) {
            var populacaoBase = $scope.geracao[numeroGeracao].populacao.clone();
            $scope.geracao[numeroGeracao+1] = {
                descricao: "Geração " + (numeroGeracao+1),
                populacao: populacaoBase
            }

            var pai = $scope.geracao[numeroGeracao+1].populacao[iPai];
            var mae = $scope.geracao[numeroGeracao+1].populacao[iMae];

            var filho1 = new Individuo(pai.bin.substr(0,3).concat(mae.bin.substr(3,2)));
            var filho2 = new Individuo(mae.bin.substr(0,3).concat(pai.bin.substr(3,2)));

            //adicionna os filhos na geracao criada no lugar de seus pais
            $scope.geracao[numeroGeracao+1].populacao[iPai] = filho1;
            $scope.geracao[numeroGeracao+1].populacao[iMae] = filho2;
        };

//Aplica a mutacao baseando-se nos individuos do indice informado na geracao informada
        $scope.mutacao = function mutacao(iIndividuo1, iIndividuo2, numeroGeracao) {
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

        $scope.criarGeracoes = function criarGeracoes(quantidadeGeracoes) {
            for (var i = 0; i<quantidadeGeracoes-1; i++) {
                $scope.gerarDescendentes(i);
            }
        }

        function calculaFuncao(x) {
            return (x*x) - (3*x) + 4;
        };

        $scope.algoritmoGenetico = function algoritmoGenetico() {
            $scope.gerarPrimeiraGeracao();
            $scope.criarGeracoes($scope.quantidadeGeracoes);
        };

    });



})();