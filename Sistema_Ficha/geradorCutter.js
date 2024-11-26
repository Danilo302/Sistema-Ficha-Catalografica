 // Função para remover acentos
 function removerAcentos(nome) {
    return nome.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Lidar com o envio do formulário
document.getElementById('obraForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const sobrenome = document.getElementById('sobrenome').value.trim();
    let titulo = document.getElementById('titulo').value.trim();

    // Requisição para a API
    fetch('127.0.0.1:3000/api/cutter', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sobrenome })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro na requisição');
        }
        return response.json();
    })
    .then(data => {
        const resultado = data.resultado;
        const cod = data.cod
        titulo = titulo.charAt(0).toLowerCase();
        
        // Exibir o resultado
        document.getElementById('resultado').innerText = `Resultado: ${resultado ? resultado.charAt(0) : ''}${cod}${titulo}`;
        
        console.log(resultado.charAt(0), titulo);
    })
    .catch(error => {
        console.error('Erro:', error);
        document.getElementById('resultado').innerText = 'Erro ao buscar o nome.';
    });
});