// Criamos variáveis pegando informações do HTML

let aviso = document.querySelector('#aviso')
let formulario = document.querySelector('form')

let btnCalcular = document.querySelector('#btnCalcular')
let btnLimpar = document.querySelector('#btnLimpar')
let btnLimpar2 = document.querySelector('#btnLimpar2')
let btnrecuperacao = document.querySelector('#btnrecuperacao')
let btnCalcularRecuperacao = document.querySelector('#btnCalcularRecuperacao')

// selecionar caixas de texto por id
let cxNota1 = document.querySelector('#nota1')
let cxNota2 = document.querySelector('#nota2')
let cxMedia = document.querySelector('#media')
let cxNota3 = document.querySelector('#nota3') 
let cxMediaFinal = document.querySelector('#mediafinal') 
let cxSituacao = document.querySelector('#situacao')
let cxSituacaoRecuperacao = document.querySelector('#situacaoRecuperacao')
let divOculta = document.getElementById("minha-div-oculta");



// CALCULAR MEDIA
function calcularMedia(n1, n2) {
    return (n1 + n2) / 2
}

// DEFINIR SITUACAO FINAL COM BASE NA MEDIA
function situacaoFinal(mediaFinal) {
    let situacaoFinal = ''
    let Necessidade =  10 - mediaFinal// obtém a referência à div oculta


    
    if (mediaFinal >= 7) {
        situacaoFinal = 'Aprovado(a)'
        document.getElementById("necessidade").innerHTML = "" 
        divOculta.style.display = "none";
    } else if (mediaFinal < 4) {
        situacaoFinal = 'Reprovado(a)'
        document.getElementById("necessidade").innerHTML = "" 
        divOculta.style.display = "none";
    } else {
        situacaoFinal = 'Recuperação'
        document.getElementById("necessidade").innerHTML = "Você precisa de " + Necessidade + " para ser Aprovado na Avaliação Final" 
        divOculta.style.display = "block";
    }
    return situacaoFinal
    document.getElementById("necessidade").innerHTML = ""
    divOculta.style.display = "none"; 
}

// FORMATAR A CAIXA DE SITUACAO FINAL
function formatarSituacao(situacaoFinal) {
    console.log('Situação Final ' + situacaoFinal)
    switch(situacaoFinal) {

        case 'Aprovado(a)':
            cxSituacao.classList.remove('reprovado')
            cxSituacao.classList.remove('recuperacao')
            cxSituacao.classList.add('aprovado')
            console.log('adicionar class aprovado')
            break
        
        case 'Reprovado(a)':
            cxSituacao.classList.remove('aprovado')
            cxSituacao.classList.remove('recuperacao')
            cxSituacao.classList.add('reprovado')
            console.log('adicionar class reprovado')
            break
        
        case 'Recuperação':
            cxSituacao.classList.remove('aprovado')
            cxSituacao.classList.remove('reprovado')
            cxSituacao.classList.add('recuperacao')
            console.log('adicionar class recuperacao')
                break

        default:
            console.log('Situação Indefinida')
    } // fim do switch case

}

// VALIDAR E GERAR FLASH MESSAGE
function validarNumero(numero) {
    let num1 = cxNota1.value
    let num2 = cxNota2.value
    let num3 = cxNota3.value
    if(num1 < 0 || num1 > 10 || num2 < 0 || num2 > 10 || num3 < 0 || num3 > 10) {
        formulario.reset() // limpar form
        cxNota3.value = "";
        cxMediaFinal.value = ""
        document.getElementById("necessidade").innerHTML = ""
        cxSituacaoRecuperacao.value = "";
        cxSituacao.value = "";
        aviso.textContent = 'Digite uma nota entre 0.0 e 10.0'
        aviso.classList.add('alerta')
        setTimeout(function(){
            aviso.textContent = ''
            aviso.classList.remove('alerta')
        }, 2000);
    }
}


// CALCULAR A MEDIA APOS O CLICK NO BOTAO
btnCalcular.addEventListener('click', function(e) {
    console.log('Calcular Média')
// pegar o valor que esta dentro das caixas
// usar metodo parseFloat p converter string p float
    let nota1 = parseFloat(cxNota1.value)
    let nota2 = parseFloat(cxNota2.value)
    let media = calcularMedia(nota1, nota2)
    
    
    console.log(nota1)
    console.log(nota2)
    console.log(media)

    if(isNaN(media) || media < 0) {
        console.log("Não é um número")
        cxSituacao.value = ''
    } else {
        cxMedia.value = parseFloat(media)
        cxSituacao.value = situacaoFinal(media)
        formatarSituacao(situacaoFinal(media))
    }
    e.preventDefault()
})




// CALULAR MEDIA FINAL 
function calcularMediaFinal(n3, n4){
    return (n3 + n4) / 2
}

// DEFINIR SITUACAO FINAL COM BASE NA MEDIA 
function situacaoRecuperacaoF(mediaRecuperacao) {
    let situacaoRecuperacaoF = ''
    
    if (mediaRecuperacao >= 5) {
        situacaoRecuperacaoF = 'Aprovado'
    } else {
        situacaoRecuperacaoF = 'Reprovado'
    }
    return situacaoRecuperacaoF
}

// FORMATAR A CAIXA DE SITUACAO FINAL
function formatarSituacaoRecuperacao(situacaoRecuperacaoF) {
    console.log('Situação Final ' + situacaoRecuperacaoF)
    switch(situacaoRecuperacaoF) {

        case 'Aprovado':
            cxSituacaoRecuperacao.classList.remove('reprovadofinal')
            cxSituacaoRecuperacao.classList.add('aprovadofinal')
            console.log('adicionar class aprovado')
            break
        
        case 'Reprovado':
            cxSituacaoRecuperacao.classList.remove('aprovadofinal')
            cxSituacaoRecuperacao.classList.add('reprovadofinal')
            console.log('adicionar class reprovado')
            break
        
        default:
            console.log('Situação Indefinida')
    } // fim do switch case

}

// CALCULAR A MEDIA APOS O CLICK NO BOTAO
btnCalcularRecuperacao.addEventListener('click', function(i) {
    console.log('Calcular Média Final')
// pegar o valor que esta dentro das caixas
// usar metodo parseFloat p converter string p float
    let nota3 = parseFloat(cxNota3.value)
    let nota4 = parseFloat(cxMedia.value)
    let mediafinal = calcularMediaFinal(nota3, nota4)
    
    console.log(nota3)
    console.log(nota4)
    console.log(mediafinal)

    if(isNaN(mediafinal) || mediafinal < 0) {
        console.log("Não é um número")
        cxSituacaoRecuperacao.value = ''
    } else {
        cxMediaFinal.value = parseFloat(mediafinal)
        cxSituacaoRecuperacao.value = situacaoRecuperacaoF(mediafinal)
        formatarSituacaoRecuperacao(situacaoRecuperacaoF(mediafinal))
    }
    i.preventDefault()
})

// APOS LIMPAR TIRAR AS CLASS DA CX SITUACAO
btnLimpar.addEventListener('click', function() {
    cxSituacao.classList.remove('aprovado')
    cxSituacao.classList.remove('reprovado')
    cxSituacao.classList.remove('recuperacao')
    cxSituacaoRecuperacao.classList.remove('aprovadofinal')
    cxSituacaoRecuperacao.classList.remove('reprovadofinal')
    cxSituacaoRecuperacao.value = "";
    document.getElementById("necessidade").innerHTML = "" 
    divOculta.style.display = "none";
    cxNota3.value = "";
    cxMediaFinal.value = "";
    
})

btnLimpar2.addEventListener('click', function() {
    cxSituacaoRecuperacao.classList.remove('aprovadofinal')
    cxSituacaoRecuperacao.classList.remove('reprovadofinal')
    cxSituacaoRecuperacao.value = "";
    cxNota3.value = "";
    cxMediaFinal.value = "";
    
})


