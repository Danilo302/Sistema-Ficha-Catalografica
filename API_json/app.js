const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 3000;


app.use(cors()); 

app.use(express.json());

// Rota para obter o conteúdo do arquivo JSON
app.get('/api/data', (req, res) => {
    const filePath = path.join(__dirname, 'data', 'arquivo2.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao ler o arquivo JSON' });
        }
        res.json(JSON.parse(data));
    });
});

// Rota para obter palavras chaves
app.get('/api/keyword', (req, res) => {
    const filePath = path.join(__dirname, 'data', 'keywords.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao ler o arquivo JSON' });
        }
        res.json(JSON.parse(data));
    });
})

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

const dados = require('./data/arquivo2.json');


function removerAcentos(nome) {
    return nome.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function geradorCutter(sobrenome){
    let listaNomes = Object.keys(dados);
    let nomeUse = sobrenome;
    if(nomeUse.includes(" ")){
        let nomeDividido = nomeUse.trim().split(' ');
        nomeUse = nomeDividido[nomeDividido.length -1];        
    }
    
    nomeUse = nomeUse[0].toUpperCase() + nomeUse.slice(1).toLowerCase()
    nomeUse = removerAcentos(nomeUse)
    listaNomes = listaNomes.concat(nomeUse);
    listaNomes.sort()
    let nomeProximo = null
    for (let i = 0; i < listaNomes.length; i++){
      if (listaNomes[i] === nomeUse){
        nomeProximo = listaNomes[i-1]
      }
      
    }
    return nomeProximo;
  }

// Rota para buscar o nome próximo
app.post('/api/cutter', (req, res) => {
    const { sobrenome } = req.body;
    if (!sobrenome) {
        return res.status(400).json({ error: 'Sobrenome é obrigatório' });
    }

    const resultado = geradorCutter(sobrenome);
    console.log('resultado = ',resultado)
    const cod = dados[resultado]
    console.log(cod)
    res.json({ resultado,cod });
});

