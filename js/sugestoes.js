document.getElementById("suggestion-form").addEventListener("submit", function(event) {
  event.preventDefault();
  let formulario = document.querySelector('form');
  var nome = document.getElementById("nome").value;
  var email = document.getElementById("email").value;
  var sugestao = document.getElementById("sugestao").value;
  let aviso = document.querySelector('#aviso');
  var val1 = email.indexOf("@");
  var val2 = email.lastIndexOf(".");
    

  if (!nome || val1<1 || val2<val1+2 || val2+2>=email.length || !sugestao) {
    aviso.textContent = 'Campo não preenchido ou invalido!'
    aviso.classList.add('alerta')
    setTimeout(function(){
    aviso.textContent = ''
    aviso.classList.remove('alerta')
    }, 2000);
    return false;
  }

  aviso.textContent = 'Sugestão enviado com sucesso!'
  aviso.classList.add('sucesso')
  setTimeout(function(){
    aviso.textContent = ''
    aviso.classList.remove('sucesso')
    }, 2000);
  formulario.reset() // limpar form
});