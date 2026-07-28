// ESTADO E LOCALSTORAGE REV MAKER
let filamentos = [];

// REFS DO DOM
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Form Cadastro
const formFilamento = document.getElementById('form-filamento');
const inputId = document.getElementById('filamento-id');
const inputMarca = document.getElementById('marca');
const selectTipo = document.getElementById('tipo');
const inputCorNome = document.getElementById('cor-nome');
const inputCorHex = document.getElementById('cor-hex');
const colorHexText = document.getElementById('color-hex-text');
const inputDataCompra = document.getElementById('data-compra');
const inputPesoTotal = document.getElementById('peso-total');
const inputPrecoPago = document.getElementById('preco-pago');
const btnSalvarFilamento = document.getElementById('btn-salvar-filamento');
const btnCancelarEdicao = document.getElementById('btn-cancelar-edicao');

// Lista e Busca
const containerFilamentos = document.getElementById('container-filamentos');
const countFilamentos = document.getElementById('count-filamentos');
const inputBuscaFilamento = document.getElementById('input-busca-filamento');

// Calculadora & Custom Select
const inputNomeProjeto = document.getElementById('nome-projeto');
const selectFilamentoCalc = document.getElementById('select-filamento-calc'); // Hidden Input
const customSelectWrapper = document.getElementById('custom-select-filamento');
const selectTrigger = document.getElementById('select-trigger');
const triggerContent = document.getElementById('trigger-content');
const customOptions = document.getElementById('custom-options');

const inputPesoUsado = document.getElementById('peso-usado');
const inputTempoHoras = document.getElementById('tempo-horas');
const inputTempoMinutos = document.getElementById('tempo-minutos');
const inputPotencia = document.getElementById('potencia-watts');
const inputTarifaKwh = document.getElementById('tarifa-kwh');
const inputTaxaDepreciacao = document.getElementById('taxa-depreciacao');
const inputTaxaFalha = document.getElementById('taxa-falha');
const inputCustoMaoObra = document.getElementById('custo-mao-obra');
const inputMargemLucro = document.getElementById('margem-lucro');

// Resultados
const resPrecoVenda = document.getElementById('res-preco-venda');
const resBadgeLucro = document.getElementById('res-badge-lucro');
const resCustoFilamento = document.getElementById('res-custo-filamento');
const resCustoEnergia = document.getElementById('res-custo-energia');
const resCustoManutencao = document.getElementById('res-custo-manutencao');
const resSubtotalDireto = document.getElementById('res-subtotal-direto');
const resCustoFalhas = document.getElementById('res-custo-falhas');
const resCustoMaoObra = document.getElementById('res-custo-mao-obra');
const resCustoTotal = document.getElementById('res-custo-total');
const resLucroLiquido = document.getElementById('res-lucro-liquido');
const btnCopiarResumo = document.getElementById('btn-copiar-resumo');

// Caixinhas Mercado Pago DOM
const resBoxInsumos = document.getElementById('res-box-insumos');
const resBoxPoupanca = document.getElementById('res-box-poupanca');
const resBoxReinvestimento = document.getElementById('res-box-reinvestimento');
const resBoxBolso = document.getElementById('res-box-bolso');

// INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', () => {
    inputDataCompra.valueAsDate = new Date();
    carregarFilamentos();
    initTabEvents();
    initColorPickerEvent();
    initFormFilamentoEvents();
    initCalculadoraEvents();
    initBackupEvents();
    initCustomSelectEvents();
});

// ALTERNÂNCIA DE ABAS
function initTabEvents() {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// SELETOR DE COR
function initColorPickerEvent() {
    inputCorHex.addEventListener('input', (e) => {
        colorHexText.textContent = e.target.value.toUpperCase();
    });
}

// LOCALSTORAGE & CARREGAMENTO DE DADOS
function carregarFilamentos() {
    const data = localStorage.getItem('revmaker_filamentos');
    if (data) {
        filamentos = JSON.parse(data);
    } else {
        filamentos = [
            {
                id: '1',
                marca: 'Creality',
                tipo: 'PLA',
                corNome: 'Preto Cadilac',
                corHex: '#1e293b',
                dataCompra: '2026-01-10',
                pesoTotal: 1000,
                precoPago: 110.00
            },
            {
                id: '2',
                marca: 'eSUN',
                tipo: 'PETG',
                corNome: 'Azul Celeste',
                corHex: '#0022ff',
                dataCompra: '2026-02-15',
                pesoTotal: 1000,
                precoPago: 125.00
            }
        ];
        salvarNoLocalStorage();
    }
    renderizarListaFilamentos();
    atualizarSelectCalculadora();
}

function salvarNoLocalStorage() {
    localStorage.setItem('revmaker_filamentos', JSON.stringify(filamentos));
}

// FORMULÁRIO DE FILAMENTOS
function initFormFilamentoEvents() {
    formFilamento.addEventListener('submit', (e) => {
        e.preventDefault();

        const id = inputId.value || Date.now().toString();
        const novoFilamento = {
            id: id,
            marca: inputMarca.value.trim(),
            tipo: selectTipo.value,
            corNome: inputCorNome.value.trim(),
            corHex: inputCorHex.value,
            dataCompra: inputDataCompra.value,
            pesoTotal: parseFloat(inputPesoTotal.value),
            precoPago: parseFloat(inputPrecoPago.value)
        };

        const index = filamentos.findIndex(f => f.id === id);
        if (index > -1) {
            filamentos[index] = novoFilamento;
        } else {
            filamentos.unshift(novoFilamento);
        }

        salvarNoLocalStorage();
        resetarFormFilamento();
        renderizarListaFilamentos();
        atualizarSelectCalculadora();
    });

    btnCancelarEdicao.addEventListener('click', resetarFormFilamento);

    inputBuscaFilamento.addEventListener('input', (e) => {
        renderizarListaFilamentos(e.target.value.toLowerCase());
    });
}

function resetarFormFilamento() {
    inputId.value = '';
    formFilamento.reset();
    inputCorHex.value = '#0022FF';
    colorHexText.textContent = '#0022FF';
    inputDataCompra.valueAsDate = new Date();
    btnSalvarFilamento.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Salvar Filamento';
    btnCancelarEdicao.classList.add('hidden');
}

// RENDERIZAR LISTA NO ESTOQUE
function renderizarListaFilamentos(filtro = '') {
    containerFilamentos.innerHTML = '';

    const filtrados = filamentos.filter(f => 
        f.marca.toLowerCase().includes(filtro) ||
        f.tipo.toLowerCase().includes(filtro) ||
        f.corNome.toLowerCase().includes(filtro)
    );

    countFilamentos.textContent = `${filtrados.length} Cadastrados`;

    if (filtrados.length === 0) {
        containerFilamentos.innerHTML = `
            <div style="text-align: center; color: var(--text-muted); padding: 30px; grid-column: 1/-1;">
                <i class="fa-solid fa-box-open" style="font-size: 2rem; margin-bottom: 8px;"></i>
                <p>Nenhum filamento encontrado.</p>
            </div>
        `;
        return;
    }

    filtrados.forEach(f => {
        const precoPorGrama = (f.precoPago / f.pesoTotal).toFixed(3);
        const isDarkHex = isColorDark(f.corHex);
        const textColor = isDarkHex ? '#ffffff' : '#0f172a';

        const card = document.createElement('div');
        card.className = 'filament-card';
        card.innerHTML = `
            <div class="filament-card-header">
                <div>
                    <div class="filament-title">${f.marca} - ${f.tipo}</div>
                    <div class="filament-brand">Comprado em: ${formatarData(f.dataCompra)}</div>
                </div>
                <span class="color-tag-badge" style="background-color: ${f.corHex}; color: ${textColor};">
                    <span class="color-dot" style="background-color: ${textColor}"></span>
                    ${f.corNome}
                </span>
            </div>

            <div class="filament-metrics">
                <div class="metric-item">
                    <span class="metric-label">Peso / Preço</span>
                    <span class="metric-value">${f.pesoTotal}g / R$ ${f.precoPago.toFixed(2)}</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">Custo por Grama</span>
                    <span class="metric-value" style="color: #60a5fa;">R$ ${precoPorGrama}/g</span>
                </div>
            </div>

            <div class="filament-card-actions">
                <button class="btn-select-calc" onclick="usarNaCalculadora('${f.id}')">
                    <i class="fa-solid fa-calculator"></i> Precificar Peça
                </button>
                <div>
                    <button class="btn-icon" onclick="editarFilamento('${f.id}')" title="Editar">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="btn-icon" onclick="excluirFilamento('${f.id}')" title="Excluir">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        containerFilamentos.appendChild(card);
    });
}

// AÇÕES DO ESTOQUE
window.editarFilamento = function(id) {
    const f = filamentos.find(item => item.id === id);
    if (!f) return;

    inputId.value = f.id;
    inputMarca.value = f.marca;
    selectTipo.value = f.tipo;
    inputCorNome.value = f.corNome;
    inputCorHex.value = f.corHex;
    colorHexText.textContent = f.corHex.toUpperCase();
    inputDataCompra.value = f.dataCompra;
    inputPesoTotal.value = f.pesoTotal;
    inputPrecoPago.value = f.precoPago;

    btnSalvarFilamento.innerHTML = '<i class="fa-solid fa-check"></i> Atualizar Filamento';
    btnCancelarEdicao.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.excluirFilamento = function(id) {
    if (confirm('Tem certeza que deseja excluir este filamento?')) {
        filamentos = filamentos.filter(item => item.id !== id);
        salvarNoLocalStorage();
        renderizarListaFilamentos();
        atualizarSelectCalculadora();
        calcularOrcamento3D();
    }
};

window.usarNaCalculadora = function(id) {
    const calcTabBtn = document.querySelector('[data-tab="tab-calculadora"]');
    calcTabBtn.click();
    selecionarFilamentoCustom(id);
};

// CONTROLE DO DROPDOWN CUSTOMIZADO COM BOLINHAS DE COR
function initCustomSelectEvents() {
    selectTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        customSelectWrapper.classList.toggle('open');
        customOptions.classList.toggle('hidden');
    });

    document.addEventListener('click', () => {
        customSelectWrapper.classList.remove('open');
        customOptions.classList.add('hidden');
    });
}

function atualizarSelectCalculadora() {
    customOptions.innerHTML = '';

    if (filamentos.length === 0) {
        triggerContent.innerHTML = '<span>Nenhum filamento disponível no estoque</span>';
        selectFilamentoCalc.value = '';
        return;
    }

    filamentos.forEach((f) => {
        const precoGrama = (f.precoPago / f.pesoTotal).toFixed(3);
        const optionDiv = document.createElement('div');
        optionDiv.className = 'custom-option';
        optionDiv.setAttribute('data-id', f.id);

        optionDiv.innerHTML = `
            <span class="color-swatch-circle" style="background-color: ${f.corHex};"></span>
            <span><strong>${f.corNome.toUpperCase()}</strong> | ${f.marca} - ${f.tipo} (R$ ${precoGrama}/g)</span>
        `;

        optionDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            selecionarFilamentoCustom(f.id);
            customSelectWrapper.classList.remove('open');
            customOptions.classList.add('hidden');
        });

        customOptions.appendChild(optionDiv);
    });

    // Mantém a seleção atual se existir, ou seleciona o primeiro
    const valorAtual = selectFilamentoCalc.value;
    if (valorAtual && filamentos.some(f => f.id === valorAtual)) {
        selecionarFilamentoCustom(valorAtual);
    } else if (filamentos.length > 0) {
        selecionarFilamentoCustom(filamentos[0].id);
    }
}

function selecionarFilamentoCustom(id) {
    const filamento = filamentos.find(f => f.id === id);
    if (!filamento) return;

    selectFilamentoCalc.value = filamento.id;

    // Destaca a opção selecionada na lista
    document.querySelectorAll('.custom-option').forEach(opt => {
        opt.classList.toggle('selected', opt.getAttribute('data-id') === id);
    });

    // Atualiza o Gatilho com a Bolinha da Cor + Texto
    const precoGrama = (filamento.precoPago / filamento.pesoTotal).toFixed(3);
    triggerContent.innerHTML = `
        <span class="color-swatch-circle" style="background-color: ${filamento.corHex};"></span>
        <span><strong>${filamento.corNome.toUpperCase()}</strong> | ${filamento.marca} - ${filamento.tipo} (R$ ${precoGrama}/g)</span>
    `;

    calcularOrcamento3D();
}

// MOTOR DA CALCULADORA DE PRECIFICAÇÃO
function initCalculadoraEvents() {
    const inputs = [
        inputNomeProjeto, inputPesoUsado, inputTempoHoras, inputTempoMinutos,
        inputPotencia, inputTarifaKwh, inputTaxaDepreciacao, inputTaxaFalha,
        inputCustoMaoObra, inputMargemLucro
    ];

    inputs.forEach(input => {
        input.addEventListener('input', calcularOrcamento3D);
        input.addEventListener('change', calcularOrcamento3D);
    });

    btnCopiarResumo.addEventListener('click', copiarResumoCliente);
    calcularOrcamento3D();
}

function calcularOrcamento3D() {
    const filamentoId = selectFilamentoCalc.value;
    const filamento = filamentos.find(f => f.id === filamentoId);

    // 1. Custo de Material
    let custoFilamento = 0;
    if (filamento) {
        const custoGrama = filamento.precoPago / filamento.pesoTotal;
        const gramasUsadas = parseFloat(inputPesoUsado.value) || 0;
        custoFilamento = custoGrama * gramasUsadas;
    }

    // 2. Tempo de Impressão em Horas
    const horas = parseFloat(inputTempoHoras.value) || 0;
    const minutos = parseFloat(inputTempoMinutos.value) || 0;
    const tempoTotalHoras = horas + (minutos / 60);

    // 3. Custo de Energia Elétrica
    const potenciaKW = (parseFloat(inputPotencia.value) || 0) / 1000;
    const tarifaKwh = parseFloat(inputTarifaKwh.value) || 0;
    const custoEnergia = potenciaKW * tempoTotalHoras * tarifaKwh;

    // 4. Depreciação / Manutenção (Seco)
    const taxaDepreciacaoHora = parseFloat(inputTaxaDepreciacao.value) || 0;
    const custoManutencao = taxaDepreciacaoHora * tempoTotalHoras;

    // 5. Subtotal Direto de Insumos
    const subtotalDireto = custoFilamento + custoEnergia;

    // 6. Taxa de Falhas
    const taxaFalhaPercentual = (parseFloat(inputTaxaFalha.value) || 0) / 100;
    const custoFalhas = subtotalDireto * taxaFalhaPercentual;

    // 7. Mão de Obra
    const custoMaoObra = parseFloat(inputCustoMaoObra.value) || 0;

    // 8. Base de Custo para Lucro
    const custoBaseMargem = subtotalDireto + custoFalhas + custoMaoObra;

    // 9. Custo Total de Produção
    const custoTotalProducao = custoBaseMargem + custoManutencao;

    // 10. Lucro Líquido
    const margemLucroPercentual = (parseFloat(inputMargemLucro.value) || 0) / 100;
    const lucroLiquido = custoBaseMargem * margemLucroPercentual;

    // 11. Preço de Venda Final
    const precoVendaFinal = custoBaseMargem + lucroLiquido + custoManutencao;

    // 12. CÁLCULO DAS CAIXINHAS DO MERCADO PAGO
    const boxInsumos = subtotalDireto + custoFalhas;
    const boxPoupanca = custoManutencao;
    const boxReinvestimento = lucroLiquido / 2;
    const boxBolso = (lucroLiquido / 2) + custoMaoObra;

    // ATUALIZAÇÃO DA TELA DA CALCULADORA
    resCustoFilamento.textContent = formatarMoeda(custoFilamento);
    resCustoEnergia.textContent = formatarMoeda(custoEnergia);
    resCustoManutencao.textContent = formatarMoeda(custoManutencao);
    resSubtotalDireto.textContent = formatarMoeda(subtotalDireto);
    resCustoFalhas.textContent = formatarMoeda(custoFalhas);
    resCustoMaoObra.textContent = formatarMoeda(custoMaoObra);
    resCustoTotal.textContent = formatarMoeda(custoTotalProducao);
    resLucroLiquido.textContent = formatarMoeda(lucroLiquido);
    resPrecoVenda.textContent = formatarMoeda(precoVendaFinal);

    // ATUALIZAÇÃO DOS VALORES DAS CAIXINHAS
    if (resBoxInsumos) resBoxInsumos.textContent = formatarMoeda(boxInsumos);
    if (resBoxPoupanca) resBoxPoupanca.textContent = formatarMoeda(boxPoupanca);
    if (resBoxReinvestimento) resBoxReinvestimento.textContent = formatarMoeda(boxReinvestimento);
    if (resBoxBolso) resBoxBolso.textContent = formatarMoeda(boxBolso);

    const margemExibicao = (parseFloat(inputMargemLucro.value) || 0);
    resBadgeLucro.textContent = `Lucro Líquido: ${formatarMoeda(lucroLiquido)} (+${margemExibicao}%)`;
}

// COPIAR ORÇAMENTO EXCLUSIVO PARA O CONSUMIDOR FINAL
function copiarResumoCliente() {
    const nomeProjeto = inputNomeProjeto.value.trim() || 'Impressão Peça 3D';
    const filamentoId = selectFilamentoCalc.value;
    const filamento = filamentos.find(f => f.id === filamentoId);
    
    const materialTexto = filamento ? `${filamento.tipo} (${filamento.corNome})` : 'Material Especial 3D';
    const precoVenda = resPrecoVenda.textContent;
    const peso = inputPesoUsado.value;
    const tempoH = inputTempoHoras.value;
    const tempoM = inputTempoMinutos.value;

    const textoCliente = `✨ *ORÇAMENTO DE IMPRESSÃO 3D - REV MAKER* ✨
--------------------------------------------------
📦 *Projeto:* ${nomeProjeto}
🧵 *Material:* ${materialTexto}
⚖️ *Especificação:* aprox. ${peso}g

💰 *VALOR FINAL:* ${precoVenda}
--------------------------------------------------
📌 *Prazo de Produção:* ~${tempoH}h ${tempoM}min
📌 *Validade do Orçamento:* 7 dias

🚀 *Rev Maker - Impressão 3D e Projetos*
Obrigado pelo contato! Fico à disposição para iniciar a produção.`;

    navigator.clipboard.writeText(textoCliente).then(() => {
        alert('Orçamento para o CLIENTE copiado com sucesso! Pronto para colar no WhatsApp.');
    }).catch(err => {
        console.error('Erro ao copiar: ', err);
    });
}

// LÓGICA DE BACKUP E IMPORTAÇÃO
function initBackupEvents() {
    const btnExportar = document.getElementById('btn-exportar');
    const btnImportar = document.getElementById('btn-importar');
    const inputImportarJson = document.getElementById('input-importar-json');

    if (btnExportar) {
        btnExportar.addEventListener('click', exportarFilamentos);
    }
    
    if (btnImportar && inputImportarJson) {
        btnImportar.addEventListener('click', () => {
            inputImportarJson.click();
        });
        
        inputImportarJson.addEventListener('change', importarFilamentos);
    }
}

function exportarFilamentos() {
    if (!filamentos || filamentos.length === 0) {
        alert('Nenhum filamento cadastrado para exportar!');
        return;
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filamentos, null, 2));
    const downloadAnchor = document.createElement('a');
    const dataAtual = new Date().toISOString().split('T')[0];

    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `revmaker_filamentos_${dataAtual}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

function importarFilamentos(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    
    reader.onload = function(event) {
        try {
            const dadosImportados = JSON.parse(event.target.result);

            if (!Array.isArray(dadosImportados)) {
                throw new Error('O arquivo precisa conter uma lista de filamentos.');
            }

            const estruturaValida = dadosImportados.every(item => 
                item.hasOwnProperty('marca') && 
                item.hasOwnProperty('tipo') && 
                item.hasOwnProperty('precoPago')
            );

            if (!estruturaValida) {
                throw new Error('O formato do arquivo JSON é incompatível.');
            }

            const confirma = confirm(`Deseja importar ${dadosImportados.length} filamento(s)? Isso substituirá o seu estoque atual.`);
            
            if (confirma) {
                filamentos = dadosImportados;
                salvarNoLocalStorage();
                renderizarListaFilamentos();
                atualizarSelectCalculadora();
                calcularOrcamento3D();
                alert('Filamentos importados com sucesso!');
            }
        } catch (err) {
            alert('Erro ao importar arquivo: ' + err.message);
        }

        e.target.value = '';
    };

    reader.readAsText(file);
}

// UTILITÁRIOS
function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatarData(dataIso) {
    if (!dataIso) return '-';
    const [ano, mes, dia] = dataIso.split('-');
    return `${dia}/${mes}/${ano}`;
}

function isColorDark(hex) {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substr(0, 2), 16);
    const g = parseInt(cleanHex.substr(2, 2), 16);
    const b = parseInt(cleanHex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
}