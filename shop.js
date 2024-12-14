$('document').ready(function () {
    const carousel = new bootstrap.Carousel('#myCarousel', {
        interval: 5000
    });
})

let inputPrecoTotal = document.getElementById("total");
let inputQtdTotal = document.getElementById("quantidades");
let precoTotal = 0;
let qtdTotal = 0;


function addProduct(number) {
    let quantidadeProdutoSelecionado = document.getElementById("qty" + number);
    quantidadeProdutoSelecionado.value++;
    calculate();
}

function calculate() {
    let precAtual, qtdAtual;
    precoTotal = 0;
    qtdTotal = 0;

    for (let i = 1; i <= 6; i++) {
        precAtual = parseFloat(document.getElementById('price' + i).value);
        qtdAtual = parseFloat(document.getElementById('qty' + i).value);
        precoTotal += precAtual * qtdAtual;
        qtdTotal += qtdAtual;
    }

    inputQtdTotal.innerText = qtdTotal;
    inputPrecoTotal.innerText = precoTotal.toFixed(2);
}

function valid() {
    if (precoTotal <= 0 && qtdTotal <= 0) {
        alert("Erro! O carrinho está vazio");
        return false;
    } else {
        return true
    }
}

function clean() {
    for (let i = 1; i <= 6; i++) {
        qtdAtual = document.getElementById('qty' + i).value = 0;
    }
    precoTotal = 0;
    qtdTotal = 0;
    inputPrecoTotal.innerText = "0.00";
    inputQtdTotal.innerText = 0;
}

function validate() {
    var retVal = true;
    if ($('#Name').val().trim().length < 3) {
        retVal = false;
        $('#NameError').show();
    } else {
        $('#NameError').hide();
    }
    var re = /\S+@\S+\.\S+/;
    var email = $('#Email').val().trim()
    if (!re.test(email)) {
        $('#EmailError').show();
        retVal = false;
    }
    else $('#EmailError').hide();

    if ($('#Password').val().trim().length < 3) {
        retVal = false;
        $('#PasswordError').show();
    } else {
        $('#PasswordError').hide();
    }

    var terms = document.querySelectorAll('input[name="Terms"]:checked').length;
            var termsError = document.getElementById("termsError")
            if (terms < 1) {
                retVal = false;
                termsError.classList.add("d-block")
                termsError.classList.remove("d-none");
            }
            else {
                termsError.classList.remove("d-block")
                termsError.classList.add("d-none");
            }
            return retVal;
}

function validate1() {
    var retVal = true;
    if ($('#NameLogin').val().trim().length < 3) {
        retVal = false;
        $('#UserError').show();
    } else {
        $('#UserError').hide();
    }
    if ($('#PasswordLogin').val().trim().length < 3) {
        retVal = false;
        $('#PassError').show();
    } else {
        $('#PassError').hide();
    }
    return retVal;
}

function validate2() {
    var retVal = true;
    var re = /\S+@\S+\.\S+/;
    var email = $('#email2').val().trim()
    if (!re.test(email)) {
        $('#emailError2').show();
        retVal = false;
    }
    else $('#emailError2').hide();
    return retVal;
}