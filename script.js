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
const radiosTipoVenda = document.querySelectorAll('input[name="tipo-venda"]');
const inputNomeProjeto = document.getElementById('nome-projeto');
const selectFilamentoCalc = document.getElementById('select-filamento-calc');
const customSelectWrapper = document.getElementById('custom-select-filamento');
const selectTrigger = document.getElementById('select-trigger');
const triggerContent = document.getElementById('trigger-content');
const customOptions = document.getElementById('custom-options');

const inputPesoUsado = document.getElementById('peso-usado');
const inputTempoHoras = document.getElementById('tempo-horas');
const inputTempoMinutos = document.getElementById('tempo-minutos');
const inputQtdPecas = document.getElementById('qtd-pecas');
const inputMargemLucro = document.getElementById('margem-lucro');
const labelMargem = document.getElementById('label-margem');

const inputPotencia = document.getElementById('potencia-watts');
const inputTarifaKwh = document.getElementById('tarifa-kwh');
const inputTaxaDepreciacao = document.getElementById('taxa-depreciacao');
const inputTaxaFalha = document.getElementById('taxa-falha');
const inputCustoMaoObra = document.getElementById('custo-mao-obra');

// Resultados DOM
const priceHeroCard = document.getElementById('price-hero-card');
const resHeroLabel = document.getElementById('res-hero-label');
const resPrecoVenda = document.getElementById('res-preco-venda');
const resBadgeLucro = document.getElementById('res-badge-lucro');

const resCustoFilamento = document.getElementById('res-custo-filamento');
const resCustoEnergia = document.getElementById('res-custo-energia');
const resCustoManutencao = document.getElementById('res-custo-manutencao');
const resCustoMaoObra = document.getElementById('res-custo-mao-obra');
const resCustoTotal = document.getElementById('res-custo-total');
const resLucroLiquido = document.getElementById('res-lucro-liquido');
const btnCopiarResumo = document.getElementById('btn-copiar-resumo');

// Caixinhas Mercado Pago DOM
const resBoxInsumos = document.getElementById('res-box-insumos');
const resBoxPoupanca = document.getElementById('res-box-poupanca');
const resBoxReinvestimento = document.getElementById('res-box-reinvestimento');
const resBoxBolso = document.getElementById('res-box-bolso');

// Cache dos dados calculados
let calcCache = {};

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

    document.querySelectorAll('.custom-option').forEach(opt => {
        opt.classList.toggle('selected', opt.getAttribute('data-id') === id);
    });

    const precoGrama = (filamento.precoPago / filamento.pesoTotal).toFixed(3);
    triggerContent.innerHTML = `
        <span class="color-swatch-circle" style="background-color: ${filamento.corHex};"></span>
        <span><strong>${filamento.corNome.toUpperCase()}</strong> | ${filamento.marca} - ${filamento.tipo} (R$ ${precoGrama}/g)</span>
    `;

    calcularOrcamento3D();
}

// MOTOR DA CALCULADORA DE PRECIFICAÇÃO DEDICADO A VAREJO x ATACADO
function initCalculadoraEvents() {
    const inputs = [
        inputNomeProjeto, inputPesoUsado, inputTempoHoras, inputTempoMinutos,
        inputQtdPecas, inputMargemLucro, inputPotencia, inputTarifaKwh,
        inputTaxaDepreciacao, inputTaxaFalha, inputCustoMaoObra
    ];

    inputs.forEach(input => {
        input.addEventListener('input', calcularOrcamento3D);
        input.addEventListener('change', calcularOrcamento3D);
    });

    radiosTipoVenda.forEach(radio => {
        radio.addEventListener('change', () => {
            // Sugestão padrão de margem dependendo do modo selecionado
            const modo = document.querySelector('input[name="tipo-venda"]:checked').value;
            if (modo === 'varejo' && inputMargemLucro.value == '100') {
                inputMargemLucro.value = '200';
            } else if (modo === 'atacado' && inputMargemLucro.value == '200') {
                inputMargemLucro.value = '100';
            }
            calcularOrcamento3D();
        });
    });

    btnCopiarResumo.addEventListener('click', copiarResumoCliente);
    calcularOrcamento3D();
}

function calcularOrcamento3D() {
    const modoVenda = document.querySelector('input[name="tipo-venda"]:checked').value; // 'varejo' ou 'atacado'
    const isAtacado = modoVenda === 'atacado';

    const filamentoId = selectFilamentoCalc.value;
    const filamento = filamentos.find(f => f.id === filamentoId);

    const qtdPecas = Math.max(1, parseInt(inputQtdPecas.value) || 1);
    const margemPercentual = (parseFloat(inputMargemLucro.value) || 0) / 100;

    // Atualiza label da margem
    if (labelMargem) {
        labelMargem.innerHTML = isAtacado 
            ? `<i class="fa-solid fa-tags icon-rev-red"></i> Margem Atacado (%)`
            : `<i class="fa-solid fa-tag icon-rev-blue"></i> Margem Varejo (%)`;
    }

    // 1. Custo de Material Unitário
    let custoFilamentoUnit = 0;
    if (filamento) {
        const custoGrama = filamento.precoPago / filamento.pesoTotal;
        const gramasUsadas = parseFloat(inputPesoUsado.value) || 0;
        custoFilamentoUnit = custoGrama * gramasUsadas;
    }

    // 2. Tempo de Impressão em Horas (Unitário)
    const horas = parseFloat(inputTempoHoras.value) || 0;
    const minutos = parseFloat(inputTempoMinutos.value) || 0;
    const tempoTotalHorasUnit = horas + (minutos / 60);

    // 3. Custo de Energia Elétrica (Unitário)
    const potenciaKW = (parseFloat(inputPotencia.value) || 0) / 1000;
    const tarifaKwh = parseFloat(inputTarifaKwh.value) || 0;
    const custoEnergiaUnit = potenciaKW * tempoTotalHorasUnit * tarifaKwh;

    // 4. Depreciação / Manutenção (Unitário)
    const taxaDepreciacaoHora = parseFloat(inputTaxaDepreciacao.value) || 0;
    const custoManutencaoUnit = taxaDepreciacaoHora * tempoTotalHorasUnit;

    // 5. Subtotal Direto Insumos
    const subtotalDiretoUnit = custoFilamentoUnit + custoEnergiaUnit;

    // 6. Taxa de Falhas (Unitário)
    const taxaFalhaPercentual = (parseFloat(inputTaxaFalha.value) || 0) / 100;
    const custoFalhasUnit = subtotalDiretoUnit * taxaFalhaPercentual;

    // 7. Mão de Obra (Unitário)
    const custoMaoObraUnit = parseFloat(inputCustoMaoObra.value) || 0;

    // 8. Base de Custo para Lucro (Unitário)
    const custoBaseMargemUnit = subtotalDiretoUnit + custoFalhasUnit + custoMaoObraUnit;

    // 9. Custo Total de Produção Unitário
    const custoTotalProducaoUnit = custoBaseMargemUnit + custoManutencaoUnit;

    // 10. PREÇO UNITÁRIO E TOTAL BASEADO NO MODO SELECIONADO
    const lucroLiquidoUnit = custoBaseMargemUnit * margemPercentual;
    const precoVendaUnit = custoBaseMargemUnit + lucroLiquidoUnit + custoManutencaoUnit;
    const precoVendaTotal = precoVendaUnit * qtdPecas;

    // Custos Totais do Lote
    const custoFilamentoTotal = custoFilamentoUnit * qtdPecas;
    const custoEnergiaTotal = custoEnergiaUnit * qtdPecas;
    const custoManutencaoTotal = custoManutencaoUnit * qtdPecas;
    const custoMaoObraTotal = custoMaoObraUnit * qtdPecas;
    const custoTotalProducaoLote = custoTotalProducaoUnit * qtdPecas;
    const subtotalInsumosTotal = (subtotalDiretoUnit + custoFalhasUnit) * qtdPecas;
    const lucroLiquidoTotalLote = lucroLiquidoUnit * qtdPecas;

    // 11. CÁLCULO DAS CAIXINHAS DO MERCADO PAGO RECALCULADAS COM BASE NA VENDA SELECIONADA
    const boxInsumos = subtotalInsumosTotal;
    const boxPoupanca = custoManutencaoTotal;
    const boxReinvestimento = lucroLiquidoTotalLote / 2;
    const boxBolso = (lucroLiquidoTotalLote / 2) + custoMaoObraTotal;

    // CACHE DE CÁLCULO
    calcCache = {
        modoVenda,
        qtdPecas,
        precoVendaUnit,
        precoVendaTotal,
        lucroLiquidoTotalLote,
        tempoTotalHorasUnit
    };

    // ATUALIZAÇÃO DA TELA DO RESULTADO
    if (resHeroLabel) {
        resHeroLabel.textContent = isAtacado 
            ? `Preço Sugerido (Lote Atacado - ${qtdPecas} un)`
            : `Preço Sugerido (Varejo - ${qtdPecas} un)`;
    }

    if (priceHeroCard) {
        priceHeroCard.classList.toggle('atacado-active', isAtacado);
    }

    resPrecoVenda.textContent = formatarMoeda(precoVendaTotal);
    resBadgeLucro.textContent = `Lucro Líquido: ${formatarMoeda(lucroLiquidoTotalLote)} (+${parseFloat(inputMargemLucro.value) || 0}%)`;

    // TELA DE CUSTOS INTERNOS
    resCustoFilamento.textContent = formatarMoeda(custoFilamentoTotal);
    resCustoEnergia.textContent = formatarMoeda(custoEnergiaTotal);
    resCustoManutencao.textContent = formatarMoeda(custoManutencaoTotal);
    resCustoMaoObra.textContent = formatarMoeda(custoMaoObraTotal);
    resCustoTotal.textContent = formatarMoeda(custoTotalProducaoLote);
    resLucroLiquido.textContent = formatarMoeda(lucroLiquidoTotalLote);

    // ATUALIZAÇÃO RECALCULADA DAS CAIXINHAS
    if (resBoxInsumos) resBoxInsumos.textContent = formatarMoeda(boxInsumos);
    if (resBoxPoupanca) resBoxPoupanca.textContent = formatarMoeda(boxPoupanca);
    if (resBoxReinvestimento) resBoxReinvestimento.textContent = formatarMoeda(boxReinvestimento);
    if (resBoxBolso) resBoxBolso.textContent = formatarMoeda(boxBolso);
}

// COPIAR ORÇAMENTO PARA O CLIENTE
function copiarResumoCliente() {
    const nomeProjeto = inputNomeProjeto.value.trim() || 'Impressão Peça 3D';
    const filamentoId = selectFilamentoCalc.value;
    const filamento = filamentos.find(f => f.id === filamentoId);
    
    const materialTexto = filamento ? `${filamento.tipo} (${filamento.corNome})` : 'Material Especial 3D';
    const peso = inputPesoUsado.value;

    const {
        modoVenda,
        qtdPecas,
        precoVendaUnit,
        precoVendaTotal,
        tempoTotalHorasUnit
    } = calcCache;

    const tempoTotalHoras = tempoTotalHorasUnit * qtdPecas;
    const horasInt = Math.floor(tempoTotalHoras);
    const minInt = Math.round((tempoTotalHoras - horasInt) * 60);

    let textoCliente = '';

    if (modoVenda === 'varejo') {
        // VAREJO LIMPO: Sem menção à palavra varejo nem tabelas
        const detalheQtd = qtdPecas > 1 ? ` (${qtdPecas} unidades)` : '';
        textoCliente = `✨ *ORÇAMENTO DE IMPRESSÃO 3D - REV MAKER* ✨
--------------------------------------------------
📦 *Projeto:* ${nomeProjeto}
🧵 *Material:* ${materialTexto}
⚖️ *Especificação:* aprox. ${peso}g por peça${detalheQtd}

💰 *VALOR FINAL:* ${formatarMoeda(precoVendaTotal)}
--------------------------------------------------
📌 *Prazo de Produção:* ~${horasInt}h ${minInt}min
📌 *Validade do Orçamento:* 7 dias

🚀 *Rev Maker - Impressão 3D e Projetos*
Obrigado pelo contato! Fico à disposição para iniciar a produção.`;
    } else {
        // ATACADO: Bonitinho, com destaque para a quantidade de peças e lote em atacado
        textoCliente = `✨ *ORÇAMENTO DE IMPRESSÃO 3D - REV MAKER* ✨
--------------------------------------------------
📦 *Projeto:* ${nomeProjeto}
🧵 *Material:* ${materialTexto}
📦 *Quantidade:* ${qtdPecas} peças (Lote em Atacado)

🏷️ *VALOR UNITÁRIO (ATACADO):* ${formatarMoeda(precoVendaUnit)} / un
💰 *VALOR TOTAL DO LOTE:* ${formatarMoeda(precoVendaTotal)}
--------------------------------------------------
📌 *Prazo de Produção:* ~${horasInt}h ${minInt}min
📌 *Validade do Orçamento:* 7 dias

🚀 *Rev Maker - Impressão 3D e Projetos*
Obrigado pelo contato! Fico à disposição para iniciar a produção.`;
    }

    navigator.clipboard.writeText(textoCliente).then(() => {
        alert(`Orçamento de ${modoVenda.toUpperCase()} copiado com sucesso! Pronto para enviar no WhatsApp.`);
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