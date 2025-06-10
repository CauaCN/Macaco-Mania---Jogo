const macaco = document.querySelector('.macaco');
const lobo = document.querySelector('.lobo');
const contador = document.getElementById('contador');
const tela = document.querySelector('.tela');
const reiniciarBtn = document.getElementById('reiniciar');
const iniciarBtn = document.getElementById('iniciar-jogo');
const telaInicio = document.querySelector('.tela-inicio');
const somFundo = document.getElementById('somFundo');
const somBanana = document.getElementById('somBanana');
const somPulo = document.getElementById('somPulo');
const somFim = document.getElementById('somFim');

let tempo = 60;
let pontuacao = 0;
let intervaloTimer;
let verificarColisao;
let intervaloBananas;

function moverLobo() {
    const lobo = document.getElementById("lobo");
    let pos = -180;

    function iniciarCiclo() {
        const duracao = Math.random() * 2 + 1; 
        const destino = window.innerWidth + 200;
        const inicio = performance.now();

        function animarLobo(now) {
            const progresso = (now - inicio) / (duracao * 1000);
            const deslocamento = progresso * destino;
            lobo.style.right = `${pos + deslocamento}px`;

            if (deslocamento < destino) {
                requestAnimationFrame(animarLobo);
            } else {
                pos = -180;
                lobo.style.right = `${pos}px`;
                iniciarCiclo(); // 
            }
        }

        requestAnimationFrame(animarLobo);
    }

    iniciarCiclo();
}

function mostrarLobo() {
    const lobo = document.getElementById("lobo");
    lobo.style.display = "block";
    moverLobo();
}

function iniciarJogo() {
    telaInicio.style.display = 'none';
    somFundo.play();
    mostrarLobo();
    tempo = 60;
    pontuacao = 0;
    contador.textContent = pontuacao;
    document.getElementById('timer').textContent = `Tempo: ${tempo}`;
    document.querySelector('.game-over').style.display = 'none';
    
    macaco.src = 'imagens/macaco.gif';
    macaco.style.width = '200px';
    macaco.style.bottom = '-10px';
    macaco.style.marginLeft = '0';
    
    lobo.style.animation = '';
    lobo.style.left = '';
    
    intervaloTimer = setInterval(atualizarTimer, 1000);
    verificarColisao = setInterval(verificarColisaoComLobo, 10);
    intervaloBananas = setInterval(criarBanana, 2000);
}

function pular() {
    if (!macaco.classList.contains('pulo')) {
        macaco.classList.add('pulo');
        somPulo.currentTime = 0;
        somPulo.play();
        setTimeout(() => {
            macaco.classList.remove('pulo');
        }, 500);
    }
}

function criarBanana() {
    const banana = document.createElement('img');
    banana.src = 'imagens/banana.png';
    banana.style.width = '60px';
    banana.classList.add('banana');
    banana.style.right = '-40px';
    banana.style.bottom = `${Math.random() * 200 + 50}px`;
    tela.appendChild(banana);
    
    setTimeout(() => {
        banana.remove();
    }, 3000);
}

function atualizarTimer() {
    tempo--;
    document.getElementById('timer').textContent = `Tempo: ${tempo}`;
    
    if (tempo <= 0) {
        mostrarGameOver();
    }
}

function verificarBananas() {
    const bananas = document.querySelectorAll('.banana');
    const posMacaco = macaco.getBoundingClientRect();
    
    bananas.forEach(banana => {
        const posBanana = banana.getBoundingClientRect();
        
        if (posMacaco.right > posBanana.left && 
            posMacaco.left < posBanana.right &&
            posMacaco.bottom > posBanana.top &&
            posMacaco.top < posBanana.bottom) {
            
            banana.remove();
            pontuacao++;
            contador.textContent = pontuacao;
            somBanana.currentTime = 0;
            somBanana.play();
        }
    });
}

function verificarColisaoComLobo() {
    const posLobo = lobo.offsetLeft;
    const posMacaco = +window.getComputedStyle(macaco).bottom.replace('px', '');

    if (posLobo <= 120 && posLobo > 0 && posMacaco < 80) {
        mostrarGameOver();
    }
    
    verificarBananas();
}

function mostrarGameOver() {
    clearInterval(verificarColisao);
    clearInterval(intervaloTimer);
    clearInterval(intervaloBananas);
    
    document.querySelectorAll('.banana').forEach(banana => banana.remove());
    
    lobo.style.animation = 'none';
    macaco.src = 'imagens/game-over.gif';
    macaco.style.width = '200px';
    
    somFundo.pause();
    somFim.currentTime = 0;
    somFim.play();
    
    document.querySelector('.game-over').style.display = 'block';
    document.getElementById('pontuacao-final').textContent = pontuacao;
}

document.addEventListener('keydown', function(e) {
    if (document.querySelector('.game-over').style.display === 'block' && e.key !== ' ') {
        iniciarJogo();
    }
});

reiniciarBtn.addEventListener('click', iniciarJogo);
document.addEventListener('keydown', pular);
document.addEventListener('click', pular);
iniciarBtn.addEventListener('click', iniciarJogo);