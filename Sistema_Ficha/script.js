document.getElementById('titulo').onchange = CriarCodigo;
document.getElementById('sobrenomeAutor').onchange = CriarCodigo;

function CriarCodigo() {
    const sobrenome = document.getElementById('sobrenomeAutor').value;
    const titulo = document.getElementById('titulo').value;
    console.log('titulo = ', titulo);
    fetch('http://127.0.0.1:3000/api/cutter', {
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
        const cod = data.cod;
        const tituloCutter = titulo.charAt(0).toLowerCase();
        
        document.getElementById('cutter').value = `${resultado ? resultado.charAt(0) : ''}${cod}${titulo.charAt(0).toLowerCase()}`;
        
        console.log(resultado.charAt(0), cod, tituloCutter);
    })
    .catch(error => {
        console.error('Erro:', error);
        document.getElementById('cutter').innerText = 'Erro ao buscar o nome.';
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('http://127.0.0.1:3000/api/keyword');
        const temas = await response.json();

        let temasSelect = document.getElementById("cdd");

        //const temasMap = {};

        for (const codigo in temas) {
            if (temas.hasOwnProperty(codigo)) {
                option = new Option(`${temas[codigo]} - ${codigo} `,codigo);
                temasSelect.options[temasSelect.options.length] = option;


            }
        }
        

    } catch (error) {
        console.error('Erro ao buscar os temas:', error);
    }
});






document.getElementById('catalogForm').onsubmit = function(event) {
    event.preventDefault();  

    const nomeAutor = document.getElementById('nomeAutor').value;
    const sobrenomeAutor = document.getElementById('sobrenomeAutor').value;
    const nomeCoautor = document.getElementById('nomeCoautor').value;
    const sobrenomeCoautor = document.getElementById('sobrenomeCoautor').value;
    const titulo = document.getElementById('titulo').value;
    const subtitulo = document.getElementById('subtitulo').value;
    const curso = document.getElementById('curso').value;
    const ano = document.getElementById('ano').value;
    const instituicao = document.getElementById('instituicao').value;
    const cidade = document.getElementById('cidade').value;
    const paginas = document.getElementById('paginas').value;
    const ilustracao = document.getElementById('ilustracao').value || '';
    const tabela = document.getElementById('tabela').value || '';
    const tamanho = document.getElementById('tamanho').value;
    const bibliografia = document.getElementById('bibliografia').value;
    const keywords = document.getElementById('keywords').value;
    const cdd = document.getElementById('cdd').value;
    const cutter = document.getElementById('cutter').value;

    function formatarAutor(nome, sobrenome) {
        const sobrenomes = sobrenome.split(' ');
        const ultimoSobrenome = sobrenomes.pop(); 
        const demaisSobrenomes = sobrenomes.join(' '); 
        return `${ultimoSobrenome}, ${nome}${demaisSobrenomes ? ' ' + demaisSobrenomes : ''}`;
    }

    const autorFormatado = formatarAutor(nomeAutor, sobrenomeAutor);
    let coautorFormatado = '';
    if (nomeCoautor && sobrenomeCoautor) {
        coautorFormatado = ` e ${formatarAutor(nomeCoautor, sobrenomeCoautor)}`;
    }

    let preview = `
                Ficha Catalográfica
                ------------------------------------
                Autor: ${autorFormatado}${coautorFormatado}
                Título: ${titulo}${subtitulo ? `: ${subtitulo}` : ''}
                Curso: ${curso}
                Ano: ${ano}
                Instituição: ${instituicao}
                Cidade: ${cidade}
                Páginas: ${paginas} f.
                Ilustrações: ${ilustracao} il.
                Tabelas: ${tabela} tb.
                Tamanho: ${tamanho} cm
                Bibliografia: ${bibliografia}
                Palavras-chave: ${keywords}
                Código Cutter: ${cutter}
                Código CDD: ${cdd}
            `;
            
    document.getElementById('result').textContent = preview;
    document.getElementById('downloadPdf').style.display = 'block';

    document.getElementById('downloadPdf').onclick = function() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'cm',
            format: 'a4'
        });

        doc.setFont('Times', 'normal');
        doc.setFontSize(11);

        const marginLeft = 3.0;  
        const marginRight = 2.0;  
        const pageWidth = doc.internal.pageSize.getWidth() - marginLeft - marginRight;
        let positionY = 13;  

        const fichaHeight = 14.5; 
        const fichaWidth = 14.5; 

        doc.setLineWidth(0.03);
        doc.rect(marginLeft, positionY, fichaWidth, fichaHeight);
        
        positionY += 1.2;

        doc.text(`${cutter}`, pageWidth - marginRight - 10.5, positionY);

        const nomeAutorText = `${autorFormatado}${coautorFormatado}`;
        positionY = addJustifiedText(doc, nomeAutorText, marginLeft + 2.2, positionY, fichaWidth - 2.5);

        const fullTitle = `${titulo}${subtitulo ? ': ' + subtitulo : ''}. ${nomeAutor} ${sobrenomeAutor} ${nomeCoautor ? ' e ' + nomeCoautor + " " + sobrenomeCoautor : ''} - ${ano}.`;
        positionY = addJustifiedText(doc, fullTitle, marginLeft + 2.2, positionY + 0.9, fichaWidth - 2.5);

        const details = `${paginas} f.; ${tabela ? tabela + ' tb.;' : ''} ${ilustracao ? ilustracao + ' il.;' : ''}  ${tamanho} cm.`;
        doc.text(details, marginLeft + 2.2, positionY + 0.7);

        positionY += 0.7;

        const courseInfo = `Trabalho de Conclusão de Curso (Tecnólogo em ${curso}) - Fundação de Apoio à Escola Técnica do Estado do Rio de Janeiro - FAETERJ (${instituicao}) ${cidade}, Rio de Janeiro, ${ano}.`;
        positionY = addJustifiedText(doc, courseInfo, marginLeft + 2.2, positionY + 0.9, fichaWidth - 2.5);

        positionY += 0.5;

        const bibliography = `  Bibliografia: f. ${bibliografia}`;
        doc.text(bibliography, marginLeft + 2.2, positionY + 0.5);

        positionY += 0.7;

        const keywordsList = keywords.split(', ').map((keyword, index) => `${index + 1}.  ${keyword}`).join('  ');
        positionY = addJustifiedText(doc, keywordsList, marginLeft + 2.2, positionY + 0.9, fichaWidth - 2.5);

        positionY += 0.7;
        
        doc.text('       I. Título.', marginLeft + 2.2, positionY);

        positionY = 27;
        doc.text(`CDD  ${cdd}`, pageWidth + marginRight - 3.5, positionY);

        doc.save('ficha_catalografica.pdf');
    };
};

const recuo = '   '; 

function addJustifiedText(doc, text, x, y, maxWidth) {
    const words = text.split(' ');
    const lineHeight = 0.7; 
    let line = ''; 
    let isFirstLine = true; 

    const totalWidth = doc.getTextWidth(recuo + text);
    if (totalWidth <= maxWidth) {
        doc.text(recuo + text, x, y); 
        return y ; 
    }

    for (const word of words) {
        const testLine = line + word + ' ';
        const testWidth = doc.getTextWidth(testLine);

        if (testWidth > maxWidth - doc.getTextWidth(recuo)) { 
            if (line.trim()) {
                const wordsInLine = line.trim().split(' ').length;
                const justifiedLine = wordsInLine <= 5 ? line.trim() : justifyLine(line.trim(), maxWidth, doc);
                doc.text(isFirstLine ? recuo + justifiedLine : justifiedLine, x, y); 
                y += lineHeight;
                isFirstLine = false; 
            }
            line = word + ' '; 
        } else {
            line = testLine; 
        }
    }

    if (line.trim()) {
        const wordsInLine = line.trim().split(' ').length;
        const justifiedLine = wordsInLine <= 5 ? line.trim() : justifyLine(line.trim(), maxWidth, doc);
        doc.text(isFirstLine ? recuo + justifiedLine : justifiedLine, x, y); 
    }

    return y; 
}

function justifyLine(line, maxWidth, doc) {
    const words = line.split(' ');
    const totalWidth = doc.getTextWidth(line);
    const totalSpaces = words.length - 1;

    if (totalSpaces <= 0 || totalWidth >= maxWidth) return line;

    const extraSpace = (maxWidth - totalWidth) / totalSpaces;
    let justifiedLine = '';
    
    for (let i = 0; i < words.length; i++) {
        justifiedLine += words[i];
        if (i < totalSpaces) {
            const spaceWidth = doc.getTextWidth(' '); 
            const numExtraSpaces = Math.ceil(extraSpace / spaceWidth); 
            justifiedLine += ' '.repeat(numExtraSpaces); 
        }
    }

    return justifiedLine;
}
