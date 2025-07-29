// Função para calcular a entropia da senha (adaptada do código Python)
function calcularEntropia(senha) {
    let tamanhoAlfabeto = 0;
    let temMinusculas = /[a-z]/.test(senha);
    let temMaiusculas = /[A-Z]/.test(senha);
    let temNumeros = /[0-9]/.test(senha);
    // Caracteres especiais/símbolos comuns. Expanda se precisar de mais.
    let temSimbolos = /[!@#$%^&*()-_+=\[\]{}|;:,.<>?/~`]/.test(senha);

    if (temMinusculas) {
        tamanhoAlfabeto += 26; // a-z
    }
    if (temMaiusculas) {
        tamanhoAlfabeto += 26; // A-Z
    }
    if (temNumeros) {
        tamanhoAlfabeto += 10; // 0-9
    }
    if (temSimbolos) {
        // Contamos um número razoável de símbolos comuns. Pode ser ajustado.
        tamanhoAlfabeto += 33; // !@#$%^&*()-_+=[]{}\|;:',.<>?/~` (aproximadamente)
    }

    if (tamanhoAlfabeto === 0 || senha.length === 0) {
        return 0;
    }

    // Fórmula da entropia: comprimento * log2(tamanho_do_alfabeto)
    let entropia = senha.length * (Math.log(tamanhoAlfabeto) / Math.log(2)); // log2(x) = log(x) / log(2)

    return entropia;
}

// Função para gerar uma senha aleatória
function gerarSenha(comprimento, incluirMaiusculas, incluirNumeros, incluirSimbolos) {
    let caracteres = 'abcdefghijklmnopqrstuvwxyz';
    if (incluirMaiusculas) caracteres += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (incluirNumeros) caracteres += '0123456789';
    if (incluirSimbolos) caracteres += '!@#$%^&*()-_+=[]{}|;:,.<>?/~`';

    if (caracteres.length === 0) {
        return ''; // Retorna vazio se não houver caracteres para usar
    }

    let senhaGerada = '';
    for (let i = 0; i < comprimento; i++) {
        const randomIndex = Math.floor(Math.random() * caracteres.length);
        senhaGerada += caracteres[randomIndex];
    }
    return senhaGerada;
}

// Função para atualizar o medidor de força da senha
function atualizarForcaSenha(senha) {
    const entropia = calcularEntropia(senha);
    const forcaTexto = document.getElementById('forca-senha');
    const barraForca = document.getElementById('barra-forca');

    let cor = 'red';
    let texto = 'Muito Fraca';
    let larguraBarra = 0;

    if (entropia >= 80) {
        cor = 'green';
        texto = 'Excelente';
        larguraBarra = 100;
    } else if (entropia >= 60) {
        cor = 'lightgreen';
        texto = 'Forte';
        larguraBarra = 75;
    } else if (entropia >= 40) {
        cor = 'orange';
        texto = 'Média';
        larguraBarra = 50;
    } else if (entropia >= 20) {
        cor = 'yellow';
        texto = 'Fraca';
        larguraBarra = 25;
    }

    forcaTexto.textContent = `Força da Senha: ${texto} (${entropia.toFixed(2)} bits)`;
    barraForca.style.width = `${larguraBarra}%`;
    barraForca.style.backgroundColor = cor;
}

// Quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    const inputSenha = document.getElementById('input-senha');
    const btnGerar = document.getElementById('btn-gerar-senha');
    const btnCopiar = document.getElementById('btn-copiar-senha');
    const sliderComprimento = document.getElementById('comprimento-senha');
    const spanComprimento = document.getElementById('valor-comprimento');
    const checkMaiusculas = document.getElementById('incluir-maiusculas');
    const checkNumeros = document.getElementById('incluir-numeros');
    const checkSimbolos = document.getElementById('incluir-simbolos');

    // Inicializa o valor do comprimento no span
    spanComprimento.textContent = sliderComprimento.value;

    // Atualiza o valor do comprimento quando o slider é movido
    sliderComprimento.addEventListener('input', () => {
        spanComprimento.textContent = sliderComprimento.value;
    });

    // Gera a senha quando o botão é clicado
    btnGerar.addEventListener('click', () => {
        const comprimento = parseInt(sliderComprimento.value);
        const incluirMaiusculas = checkMaiusculas.checked;
        const incluirNumeros = checkNumeros.checked;
        const incluirSimbolos = checkSimbolos.checked;
        const senha = gerarSenha(comprimento, incluirMaiusculas, incluirNumeros, incluirSimbolos);
        inputSenha.value = senha;
        atualizarForcaSenha(senha); // Atualiza a força da senha gerada
    });

    // Atualiza a força da senha ao digitar
    inputSenha.addEventListener('input', () => {
        atualizarForcaSenha(inputSenha.value);
    });

    // Copia a senha para a área de transferência
    btnCopiar.addEventListener('click', () => {
        inputSenha.select();
        document.execCommand('copy');
        alert('Senha copiada para a área de transferência!');
    });

    // Gera uma senha inicial ao carregar a página
    // e atualiza a força da senha inicial
    const senhaInicial = gerarSenha(
        parseInt(sliderComprimento.value),
        checkMaiusculas.checked,
        checkNumeros.checked,
        checkSimbolos.checked
    );
    inputSenha.value = senhaInicial;
    atualizarForcaSenha(senhaInicial);
});