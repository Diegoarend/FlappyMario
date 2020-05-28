//além de classList também se pode usar className
function novoElemento(tagName, className) {
    const elem = document.createElement (tagName)
    elem.className = className 
    return elem
}
 

// vai instanciar a funcao para ter mais de uma barreira 
// vai criar elemento this que é o próprio createElement
//próprio elemento que foi criado

//com o this o atributo ficará visível pra fora da funcão 
// esse atributo será público
function Barreira (reversa=false){
    this.elemento=novoElemento('div','barreira')

    const borda= novoElemento('div','borda')
    const corpo = novoElemento('div','corpo')
    //se for reversa = true vai por o corpo e depois a borda
    //se for reversa = false vai por a borda e depois o corpo
    this.elemento.appendChild( reversa ? corpo: borda)
    this.elemento.appendChild(reversa ? borda : corpo)

    this.setAltura= altura => corpo.style.height = `${altura}px`

}

//const b = new Barreira(true)
//b.setAltura(200) 
//document.querySelector('[wm-flappy]').appendChild(b.elemento)


function ParDeBarreiras (altura,abertura,x){
    this.elemento=novoElemento('div','par-de-barreiras')

    this.superior=new Barreira (true)
    this.inferior=new Barreira (false)


    //o elemento que representa o elemento do dom é .elemento do .superior que está dentro da funcão construtura barreira
    //então nesse comando ele está fazendo um append no elemento par-de-barreiras do elemento criado com o superior.elemento
    this.elemento.appendChild(this.superior.elemento)
    //mesma coisa para o inferior
    this.elemento.appendChild(this.inferior.elemento)

    //calcular a abertura
    this.sortearAbertura = () => {
        const alturaSuperior= Math.random() * (altura - abertura)
        const alturaInferior= altura - abertura - alturaSuperior 
        this.superior.setAltura(alturaSuperior)
        this.inferior.setAltura(alturaInferior)
    }

    //está convertendo para inteiro (o style left que é uma string com px no final, fazendo um split, 
    //e pegando o index 0 que é o número)
    this.getX= () => parseInt(this.elemento.style.left.split('px')[0])
    //setando a posicao no eixo x 
    this.setX = x => this.elemento.style.left = `${x}px`
    //pegar a largura 
    this.getLargura=() => this.elemento.clientWidth
    this.sortearAbertura()
    this.setX(x)
    
}

//const b = new ParDeBarreiras(700,200,300) 
//document.querySelector('[wm-flappy]').appendChild(b.elemento)

function Barreiras(altura,largura,abertura,espaco,notificarPonto){
    this.pares= [
        new ParDeBarreiras(altura,abertura,largura),
        new ParDeBarreiras(altura,abertura,largura + espaco),
        new ParDeBarreiras(altura,abertura,largura + espaco * 2),
        new ParDeBarreiras(altura,abertura,largura + espaco * 3)
    ]

    const deslocamento = 3

    this.animar=()=> {
        this.pares.forEach(par => {
            par.setX(par.getX() - deslocamento)
        

        //quando a barreira sair da tela, vamos jogar ela de volta para a fila da barreiras que vão entrar na tela
        if (par.getX() < -par.getLargura()) {
            par.setX(par.getX() + espaco * this.pares.length)
            par.sortearAbertura()
        }

        const meio = largura / 2

        const CruzouOMeio= par.getX() + deslocamento >= meio 
            && par.getX() < meio 

        if(CruzouOMeio) notificarPonto()

        })
    }
}

function Coin (y,x){
    this.elemento= novoElemento('img','coin')
    this.elemento.src='imgs/coin.png'
    //está convertendo para inteiro (o style left que é uma string com px no final, fazendo um split, 
    //e pegando o index 0 que é o número)
    this.getX= () => parseInt(this.elemento.style.left.split('px')[0])
    //setando a posicao no eixo x 
    this.setX = x => this.elemento.style.left = `${x}px`
    this.setX(x)
    this.getY=() => parseInt(this.elemento.style.bottom.split('px')[0])
    this.setY= y => this.elemento.style.bottom = `${Math.random() * (y)}px`
    this.setY(y)
    this.getLargura=() => this.elemento.clientWidth
}


function Coins (y,x,espaco){
    this.moedas= [
        new Coin(y,x),
        new Coin(y,x + espaco),
        new Coin(y,x + espaco * 2),
        new Coin(y, x + espaco * 3)
    ]

    const deslocamento = 3

    this.animar=()=> {
        this.moedas.forEach(moeda => {
            moeda.setX(moeda.getX() - deslocamento)


            if (moeda.getX() < -moeda.getLargura()) {
                moeda.setX(moeda.getX() + espaco * this.moedas.length)
                meoda.setY(y)
            }
        })
        
    }
    
}



function Passaro(alturaJogo){
    let voando = false 

    this.elemento = novoElemento('img','passaro')
    this.elemento.src='imgs/passaro.png'
    
    this.getY=() => parseInt(this.elemento.style.bottom.split('px')[0])
    this.setY=(y) => this.elemento.style.bottom = `${y}px`

    window.onkeydown= e => voando=true 
    window.onkeyup= e => voando=false

    this.animar = () => {
        const novoY = this.getY() + (voando ? 8 : -5)
        const alturaMaxima = alturaJogo - this.elemento.clientHeight
 
        if (novoY <= 0) {
            this.setY(0)
        } else if (novoY >= alturaMaxima) {
            this.setY(alturaMaxima)
        } else {
            this.setY(novoY)
        }
    }
 
    this.setY(alturaJogo/2)
}
 

function Progresso() {
    this.elemento = novoElemento('span', 'progresso')
    this.atualizarPontos = pontos => {
        this.elemento.innerHTML = pontos
    }
    this.atualizarPontos(0)
}

// const barreiras = new Barreiras(700, 1200, 200, 400)
// const passaro = new Passaro(700)
// const areaDoJogo = document.querySelector('[wm-flappy]')
// areaDoJogo.appendChild(passaro.elemento)
// areaDoJogo.appendChild(new Progresso().elemento)
// barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))
// setInterval(() => {
//     barreiras.animar()
//     passaro.animar()
// }, 20)

function estaoSobrepostos(elementoA, elementoB) {
    const a = elementoA.getBoundingClientRect()
    const b = elementoB.getBoundingClientRect()

    const horizontal = a.left + a.width >= b.left
        && b.left + b.width >= a.left
    const vertical = a.top + a.height >= b.top
        && b.top + b.height >= a.top
    return horizontal && vertical
}

function colidiu(passaro, barreiras) {
    let colidiu = false
    barreiras.pares.forEach(parDeBarreiras => {
        if (!colidiu) {
            const superior = parDeBarreiras.superior.elemento
            const inferior = parDeBarreiras.inferior.elemento
            colidiu = estaoSobrepostos(passaro.elemento, superior)
                || estaoSobrepostos(passaro.elemento, inferior)
        }
    })
    return colidiu
}

function pontuou(passaro, coins) {
    let pontuou = false
    coins.moedas.forEach(coin => {
        if (!pontuou) {
            const superior = coin.elemento
            pontuou = estaoSobrepostos(passaro.elemento, superior)
                
        }
    })
    return pontuou
}

function GameOver() {
    this.elemento = novoElemento('span', 'gameOver')
    this.elemento.innerHTML = 'GAME OVER'
    
}




function FlappyBird() {
    let pontos = 0

    const areaDoJogo = document.querySelector('[wm-flappy]')
    const altura = areaDoJogo.clientHeight
    const largura = areaDoJogo.clientWidth

    const progresso = new Progresso()
    const barreiras = new Barreiras(altura, largura, 400, 400,
        () => progresso.atualizarPontos(++pontos))
    const passaro = new Passaro(altura)
    const coins = new Coins(altura,largura + 200,400) 

    //areaDoJogo.appendChild(coins.elemento)
    areaDoJogo.appendChild(progresso.elemento)
    areaDoJogo.appendChild(passaro.elemento)
    //areaDoJogo.appendChild(Coin().elemento)
    //areaDoJogo.appendChild(coins.elemento)
    coins.moedas.forEach(moeda => areaDoJogo.appendChild(moeda.elemento))
    barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))

    this.start = () => {
        // loop do jogo
        const temporizador = setInterval(() => {
            barreiras.animar()
            passaro.animar()
            coins.animar()
            if(pontuou(passaro,coins)){
                alert('CORNO')
            } else if (colidiu(passaro, barreiras)) {
                clearInterval(temporizador)
                areaDoJogo.appendChild(new GameOver().elemento)
                setTimeout(() => {
                    location.reload()
                }, 3000)
            }
        }, 20)
    }
}


new FlappyBird().start()


/*
const barreiras = new Barreiras(700,1000,400,400, ()=> progresso.atualizarPontos(++pontos))
const passaro = new Passaro(700)
const areadoJogo = document.querySelector('[wm-flappy]')
areadoJogo.appendChild(passaro.elemento)
areadoJogo.appendChild(new Progresso().elemento)
barreiras.pares.forEach(par => areadoJogo.appendChild(par.elemento))
setInterval(()=> {
    barreiras.animar()
    passaro.animar()
},20) */