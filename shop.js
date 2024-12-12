// Elementos globais
const inputPrecoTotal = document.getElementById("total");
const inputQtdTotal = document.getElementById("quantidades");

// Variáveis para cálculo
let precoTotal = 0;
let qtdTotal = 0;

// Função para adicionar um produto
function addProduct(number) {
    const quantidadeProdutoSelecionado = document.getElementById("qty" + number);
    quantidadeProdutoSelecionado.value = parseInt(quantidadeProdutoSelecionado.value) + 1; // Incrementa corretamente
    calculate(); // Atualiza os totais
}

// Função para calcular o total de preços e quantidades
function calculate() {
    precoTotal = 0;
    qtdTotal = 0;

    for (let i = 1; i <= 6; i++) {
        const precAtual = parseFloat(document.getElementById('price' + i)?.value || 0); // Obtém o preço atual
        const qtdAtual = parseInt(document.getElementById('qty' + i)?.value || 0); // Obtém a quantidade atual
        precoTotal += precAtual * qtdAtual;
        qtdTotal += qtdAtual;
    }

    // Atualiza os campos de totais
    inputQtdTotal.value = qtdTotal;
    inputPrecoTotal.value = precoTotal.toFixed(2);
}

// Função para validar o carrinho
function valid() {
    if (precoTotal <= 0 && qtdTotal <= 0) {
        alert("Erro! O carrinho está vazio.");
        return false;
    }
    return true;
}

// Função para limpar o carrinho
function clean() {
    for (let i = 1; i <= 6; i++) {
        const quantidadeProduto = document.getElementById('qty' + i);
        if (quantidadeProduto) {
            quantidadeProduto.value = 0;
        }
    }

    // Reseta os totais
    precoTotal = 0;
    qtdTotal = 0;
    inputPrecoTotal.value = "0.00";
    inputQtdTotal.value = 0;
}

// Função para validar o formulário de cadastro
function validate() {
    let retVal = true;

    // Valida o campo de nome
    const name = document.getElementById('Name');
    const nameError = document.getElementById('NameError');
    if (name.value.trim().length < 3) {
        retVal = false;
        nameError.style.display = 'block';
    } else {
        nameError.style.display = 'none';
    }

    // Valida o campo de email
    const email = document.getElementById('Email').value.trim();
    const emailError = document.getElementById('EmailError');
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
        retVal = false;
        emailError.style.display = 'block';
    } else {
        emailError.style.display = 'none';
    }

    // Valida o campo de senha
    const password = document.getElementById('Password');
    const passwordError = document.getElementById('PasswordError');
    if (password.value.trim().length < 3) {
        retVal = false;
        passwordError.style.display = 'block';
    } else {
        passwordError.style.display = 'none';
    }

    // Valida os termos de uso
    const termsChecked = document.querySelectorAll('input[name="Terms"]:checked').length;
    const termsError = document.getElementById("termsError");
    if (termsChecked < 1) {
        retVal = false;
        termsError.classList.add("d-block");
        termsError.classList.remove("d-none");
    } else {
        termsError.classList.remove("d-block");
        termsError.classList.add("d-none");
    }

    return retVal;
}

// Função para validar o formulário de login
function validateLogin() {
    let retVal = true;

    // Valida o nome de usuário
    const userName = document.getElementById('NameLogin');
    const userError = document.getElementById('UserError');
    if (userName.value.trim().length < 3) {
        retVal = false;
        userError.style.display = 'block';
    } else {
        userError.style.display = 'none';
    }

    // Valida a senha
    const userPassword = document.getElementById('PasswordLogin');
    const passError = document.getElementById('PassError');
    if (userPassword.value.trim().length < 3) {
        retVal = false;
        passError.style.display = 'block';
    } else {
        passError.style.display = 'none';
    }

    return retVal;
}

// Função para validar o email no formulário de recuperação
function validateEmailRecovery() {
    let retVal = true;

    const email = document.getElementById('email2').value.trim();
    const emailError = document.getElementById('emailError2');
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
        emailError.style.display = 'block';
        retVal = false;
    } else {
        emailError.style.display = 'none';
    }

    return retVal;
}
