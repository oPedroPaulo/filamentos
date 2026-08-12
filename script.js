// ESTADO E LOCALSTORAGE REV MAKER
let filamentos = [];
let vendas = [];

// REFS DO DOM
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Form Cadastro Filamentos
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

// Lista e Busca Filamentos
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

// Resultados DOM Calculadora
const priceHeroCard = document.getElementById('price-hero-card');
const resHeroLabel = document.getElementById('res-hero-label');
const resPrecoVenda = document.getElementById('res-preco-venda');
const resBadgeLucro = document.getElementById('res-badge-lucro');

const boxUnitMetrics = document.getElementById('box-unit-metrics');
const unitValVenda = document.getElementById('unit-val-venda');
const unitValCusto = document.getElementById('unit-val-custo');
const unitValLucro = document.getElementById('unit-val-lucro');

const resCustoFilamento = document.getElementById('res-custo-filamento');
const resCustoEnergia = document.getElementById('res-custo-energia');
const resCustoManutencao = document.getElementById('res-custo-manutencao');
const resCustoMaoObra = document.getElementById('res-custo-mao-obra');
const resCustoTotal = document.getElementById('res-custo-total');
const resLucroLiquido = document.getElementById('res-lucro-liquido');
const btnCopiarResumo = document.getElementById('btn-copiar-resumo');
const btnLancarVenda = document.getElementById('btn-lancar-venda');

// Caixinhas Mercado Pago DOM
const resBoxInsumos = document.getElementById('res-box-insumos');
const resBoxPoupanca = document.getElementById('res-box-poupanca');
const resBoxReinvestimento = document.getElementById('res-box-reinvestimento');
const resBoxBolso = document.getElementById('res-box-bolso');

// Elementos da Aba Vendas
const formVendaManual = document.getElementById('form-venda-manual');
const inputVendaCliente = document.getElementById('venda-cliente');
const inputVendaValorTotal = document.getElementById('venda-valor-total');
const inputVendaCustoInsumos = document.getElementById('venda-custo-insumos');
const inputVendaData = document.getElementById('venda-data');

const dashTotInsumos = document.getElementById('dash-tot-insumos');
const dashTotPoupanca = document.getElementById('dash-tot-poupanca');
const dashTotReinvestimento = document.getElementById('dash-tot-reinvestimento');
const dashTotBolso = document.getElementById('dash-tot-bolso');
const dashFaturamentoTotal = document.getElementById('dash-faturamento-total');

const containerVendas = document.getElementById('container-vendas');
const countVendas = document.getElementById('count-vendas');

// Cache dos dados calculados
let calcCache = {};

// INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', () => {
    inputDataCompra.valueAsDate = new Date();
    if (inputVendaData) inputVendaData.valueAsDate = new Date();

    carregarFilamentos();
    carregarVendas();

    initTabEvents();
    initColorPickerEvent();
    initFormFilamentoEvents();
    initCalculadoraEvents();
    initVendasEvents();
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

// LOCALSTORAGE & CARREGAMENTO DE FILAMENTOS E VENDAS
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

function carregarVendas() {
    const data = localStorage.getItem('revmaker_vendas');
    if (data) {
        vendas = JSON.parse(data);
    } else {
        vendas = [];
    }
    renderizarVendas();
}

function salvarNoLocalStorage() {
    localStorage.setItem('revmaker_filamentos', JSON.stringify(filamentos));
}

function salvarVendasNoLocalStorage() {
    localStorage.setItem('revmaker_vendas', JSON.stringify(vendas));
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

// MOTOR DA CALCULADORA DE PRECIFICAÇÃO
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
    btnLancarVenda.addEventListener('click', lancarCalculoNasVendas);
    calcularOrcamento3D();
}

function calcularOrcamento3D() {
    const modoVenda = document.querySelector('input[name="tipo-venda"]:checked').value;
    const isAtacado = modoVenda === 'atacado';

    const filamentoId = selectFilamentoCalc.value;
    const filamento = filamentos.find(f => f.id === filamentoId);

    const qtdPecas = Math.max(1, parseInt(inputQtdPecas.value) || 1);
    const margemPercentual = (parseFloat(inputMargemLucro.value) || 0) / 100;

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

    // 10. PREÇOS UNITÁRIOS E TOTAIS
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

    // CÁLCULO DAS CAIXINHAS DO MERCADO PAGO PARA O TOTAL DO PEDIDO
    const boxInsumos = subtotalInsumosTotal;
    const boxPoupanca = custoManutencaoTotal;
    const boxReinvestimento = lucroLiquidoTotalLote / 2;
    const boxBolso = (lucroLiquidoTotalLote / 2) + custoMaoObraTotal;

    // CACHE DO CÁLCULO DADOS COMPLETOS
    calcCache = {
        modoVenda,
        nomeProjeto: inputNomeProjeto.value.trim() || 'Projeto 3D',
        qtdPecas,
        precoVendaUnit,
        precoVendaTotal,
        custoTotalProducaoUnit,
        custoTotalProducaoLote,
        lucroLiquidoUnit,
        lucroLiquidoTotalLote,
        margemPercentual: parseFloat(inputMargemLucro.value) || 0,
        tempoTotalHorasUnit,
        boxInsumos,
        boxPoupanca,
        boxReinvestimento,
        boxBolso
    };

    // ATUALIZAÇÃO DA TELA DO RESULTADO
    if (resHeroLabel) {
        resHeroLabel.textContent = isAtacado 
            ? `Preço Sugerido (Lote Atacado - ${qtdPecas} un)`
            : `Preço Sugerido (${qtdPecas} unidade${qtdPecas > 1 ? 's' : ''})`;
    }

    if (priceHeroCard) {
        priceHeroCard.classList.toggle('atacado-active', isAtacado);
    }

    resPrecoVenda.textContent = formatarMoeda(precoVendaTotal);
    resBadgeLucro.textContent = `Lucro Líquido: ${formatarMoeda(lucroLiquidoTotalLote)} (+${parseFloat(inputMargemLucro.value) || 0}%)`;

    // EXIBE AS MÉTRICAS UNITÁRIAS QUANDO HÁ MAIS DE 1 PEÇA
    if (qtdPecas > 1 && boxUnitMetrics) {
        unitValVenda.textContent = formatarMoeda(precoVendaUnit);
        unitValCusto.textContent = formatarMoeda(custoTotalProducaoUnit);
        unitValLucro.textContent = formatarMoeda(lucroLiquidoUnit);
        boxUnitMetrics.classList.remove('hidden');
    } else if (boxUnitMetrics) {
        boxUnitMetrics.classList.add('hidden');
    }

    // TELA DE CUSTOS INTERNOS
    resCustoFilamento.textContent = formatarMoeda(custoFilamentoTotal);
    resCustoEnergia.textContent = formatarMoeda(custoEnergiaTotal);
    resCustoManutencao.textContent = formatarMoeda(custoManutencaoTotal);
    resCustoMaoObra.textContent = formatarMoeda(custoMaoObraTotal);
    resCustoTotal.textContent = formatarMoeda(custoTotalProducaoLote);
    resLucroLiquido.textContent = formatarMoeda(lucroLiquidoTotalLote);

    // ATUALIZAÇÃO DAS CAIXINHAS
    if (resBoxInsumos) resBoxInsumos.textContent = formatarMoeda(boxInsumos);
    if (resBoxPoupanca) resBoxPoupanca.textContent = formatarMoeda(boxPoupanca);
    if (resBoxReinvestimento) resBoxReinvestimento.textContent = formatarMoeda(boxReinvestimento);
    if (resBoxBolso) resBoxBolso.textContent = formatarMoeda(boxBolso);
}

// COPIAR ORÇAMENTO PARA O CLIENTE (SEM INSUMO E SEM GRAMAS)
function copiarResumoCliente() {
    const nomeProjeto = inputNomeProjeto.value.trim() || 'Impressão Peça 3D';

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
        const detalheQtd = qtdPecas > 1 ? ` (${qtdPecas} unidades)` : '';
        const detalheUnit = qtdPecas > 1 ? `\n🏷️ *Valor Unitário:* ${formatarMoeda(precoVendaUnit)} / un` : '';

        textoCliente = `✨ *ORÇAMENTO DE IMPRESSÃO 3D - REV MAKER* ✨
--------------------------------------------------
📦 *Projeto:* ${nomeProjeto}${detalheQtd}${detalheUnit}

💰 *VALOR FINAL:* ${formatarMoeda(precoVendaTotal)}
--------------------------------------------------
📌 *Prazo Estimado de Produção:* ~${horasInt}h ${minInt}min
📌 *Validade do Orçamento:* 7 dias

🚀 *Rev Maker - Impressão 3D e Projetos*
Obrigado pelo contato! Fico à disposição para iniciar a produção.`;
    } else {
        textoCliente = `✨ *ORÇAMENTO DE IMPRESSÃO 3D - REV MAKER* ✨
--------------------------------------------------
📦 *Projeto:* ${nomeProjeto}
📦 *Quantidade:* ${qtdPecas} peças (Lote em Atacado)

🏷️ *VALOR UNITÁRIO (ATACADO):* ${formatarMoeda(precoVendaUnit)} / un
💰 *VALOR TOTAL DO LOTE:* ${formatarMoeda(precoVendaTotal)}
--------------------------------------------------
📌 *Prazo Estimado de Produção:* ~${horasInt}h ${minInt}min
📌 *Validade do Orçamento:* 7 dias

🚀 *Rev Maker - Impressão 3D e Projetos*
Obrigado pelo contato! Fico à disposição para iniciar a produção.`;
    }

    navigator.clipboard.writeText(textoCliente).then(() => {
        alert('Orçamento limpo para o CLIENTE copiado com sucesso! Pronto para colar no WhatsApp.');
    }).catch(err => {
        console.error('Erro ao copiar: ', err);
    });
}

// ABA DE GESTÃO DE VENDAS
function initVendasEvents() {
    if (formVendaManual) {
        formVendaManual.addEventListener('submit', (e) => {
            e.preventDefault();

            const valorTotal = parseFloat(inputVendaValorTotal.value) || 0;
            const custoInsumos = parseFloat(inputVendaCustoInsumos.value) || 0;
            
            const lucroReal = Math.max(0, valorTotal - custoInsumos);
            const margemPercentual = custoInsumos > 0 ? (lucroReal / custoInsumos) * 100 : 0;

            const boxInsumos = custoInsumos;
            const boxPoupanca = 0; // Depreciação não especificada manualmente
            const boxReinvestimento = lucroReal / 2;
            const boxBolso = lucroReal / 2;

            const novaVenda = {
                id: Date.now().toString(),
                cliente: inputVendaCliente.value.trim(),
                valorTotal: valorTotal,
                custoTotal: custoInsumos,
                lucroReal: lucroReal,
                margemPercentual: parseFloat(margemPercentual.toFixed(1)),
                data: inputVendaData.value,
                boxInsumos,
                boxPoupanca,
                boxReinvestimento,
                boxBolso
            };

            vendas.unshift(novaVenda);
            salvarVendasNoLocalStorage();
            renderizarVendas();

            formVendaManual.reset();
            inputVendaData.valueAsDate = new Date();
            alert('Venda registrada com sucesso!');
        });
    }
}

// LANÇAR CÁLCULO DA CALCULADORA DIRETO NAS VENDAS (REGISTRO COMPLETO)
function lancarCalculoNasVendas() {
    if (!calcCache.precoVendaTotal || calcCache.precoVendaTotal <= 0) {
        alert('Faça um cálculo válido na calculadora antes de lançar a venda!');
        return;
    }

    const novaVenda = {
        id: Date.now().toString(),
        cliente: `${calcCache.nomeProjeto} (${calcCache.qtdPecas} un - ${calcCache.modoVenda.toUpperCase()})`,
        valorTotal: calcCache.precoVendaTotal,
        custoTotal: calcCache.custoTotalProducaoLote,
        lucroReal: calcCache.lucroLiquidoTotalLote,
        margemPercentual: calcCache.margemPercentual,
        data: new Date().toISOString().split('T')[0],
        boxInsumos: calcCache.boxInsumos,
        boxPoupanca: calcCache.boxPoupanca,
        boxReinvestimento: calcCache.boxReinvestimento,
        boxBolso: calcCache.boxBolso
    };

    vendas.unshift(novaVenda);
    salvarVendasNoLocalStorage();
    renderizarVendas();

    const vendasTabBtn = document.querySelector('[data-tab="tab-vendas"]');
    if (vendasTabBtn) vendasTabBtn.click();

    alert('Venda lançada no histórico e caixinhas atualizadas!');
}

function renderizarVendas() {
    if (!containerVendas) return;

    containerVendas.innerHTML = '';
    countVendas.textContent = `${vendas.length} Vendas`;

    if (vendas.length === 0) {
        containerVendas.innerHTML = `
            <div style="text-align: center; color: var(--text-muted); padding: 30px;">
                <i class="fa-solid fa-receipt" style="font-size: 2rem; margin-bottom: 8px;"></i>
                <p>Nenhuma venda registrada ainda.</p>
            </div>
        `;
        atualizarDashboardVendas(0, 0, 0, 0, 0);
        return;
    }

    let sumInsumos = 0;
    let sumPoupanca = 0;
    let sumReinvestimento = 0;
    let sumBolso = 0;
    let sumTotalFaturado = 0;

    vendas.forEach(v => {
        sumInsumos += v.boxInsumos;
        sumPoupanca += v.boxPoupanca;
        sumReinvestimento += v.boxReinvestimento;
        sumBolso += v.boxBolso;
        sumTotalFaturado += v.valorTotal;

        const custoExibicao = v.custoTotal !== undefined ? formatarMoeda(v.custoTotal) : '-';
        const lucroExibicao = v.lucroReal !== undefined ? formatarMoeda(v.lucroReal) : '-';
        const margemExibicao = v.margemPercentual !== undefined ? `+${v.margemPercentual}%` : '';

        const card = document.createElement('div');
        card.className = 'venda-card-item';
        card.innerHTML = `
            <div class="venda-info-main">
                <div class="venda-title">${v.cliente}</div>
                <div class="venda-date">Data: ${formatarData(v.data)} | <strong>Venda Total: ${formatarMoeda(v.valorTotal)}</strong></div>
            </div>

            <div class="venda-financial-summary">
                <div class="fin-summary-item">
                    <span class="fin-summary-label">Custo:</span>
                    <span class="fin-summary-val" style="color: #f59e0b;">${custoExibicao}</span>
                </div>
                <div class="fin-summary-item">
                    <span class="fin-summary-label">Lucro Líquido:</span>
                    <span class="fin-summary-val highlight-green">${lucroExibicao} (${margemExibicao})</span>
                </div>
            </div>

            <div class="venda-caixinhas-mini">
                <div class="mini-box">
                    <span class="mini-box-label">Insumos</span>
                    <span class="mini-box-val" style="color: #60a5fa;">${formatarMoeda(v.boxInsumos)}</span>
                </div>
                <div class="mini-box">
                    <span class="mini-box-label">Poupança</span>
                    <span class="mini-box-val" style="color: #c084fc;">${formatarMoeda(v.boxPoupanca)}</span>
                </div>
                <div class="mini-box">
                    <span class="mini-box-label">Reinvest.</span>
                    <span class="mini-box-val" style="color: #ff6b4a;">${formatarMoeda(v.boxReinvestimento)}</span>
                </div>
                <div class="mini-box">
                    <span class="mini-box-label">Meu Bolso</span>
                    <span class="mini-box-val" style="color: #34d399;">${formatarMoeda(v.boxBolso)}</span>
                </div>
            </div>

            <button class="btn-icon" onclick="excluirVenda('${v.id}')" title="Excluir Venda">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;
        containerVendas.appendChild(card);
    });

    atualizarDashboardVendas(sumInsumos, sumPoupanca, sumReinvestimento, sumBolso, sumTotalFaturado);
}

function atualizarDashboardVendas(insumos, poupanca, reinvestimento, bolso, totalFaturado) {
    if (dashTotInsumos) dashTotInsumos.textContent = formatarMoeda(insumos);
    if (dashTotPoupanca) dashTotPoupanca.textContent = formatarMoeda(poupanca);
    if (dashTotReinvestimento) dashTotReinvestimento.textContent = formatarMoeda(reinvestimento);
    if (dashTotBolso) dashTotBolso.textContent = formatarMoeda(bolso);
    if (dashFaturamentoTotal) dashFaturamentoTotal.textContent = formatarMoeda(totalFaturado);
}

window.excluirVenda = function(id) {
    if (confirm('Tem certeza que deseja excluir esta venda do histórico?')) {
        vendas = vendas.filter(v => v.id !== id);
        salvarVendasNoLocalStorage();
        renderizarVendas();
    }
};

// BACKUP UNIFICADO (FILAMENTOS + HISTÓRICO DE VENDAS EM UM ÚNICO ARQUIVO JSON)
function initBackupEvents() {
    const btnExportar = document.getElementById('btn-exportar');
    const btnImportar = document.getElementById('btn-importar');
    const inputImportarJson = document.getElementById('input-importar-json');

    if (btnExportar) {
        btnExportar.addEventListener('click', exportarBackupUnificado);
    }
    
    if (btnImportar && inputImportarJson) {
        btnImportar.addEventListener('click', () => {
            inputImportarJson.click();
        });
        
        inputImportarJson.addEventListener('change', importarBackupUnificado);
    }
}

function exportarBackupUnificado() {
    if ((!filamentos || filamentos.length === 0) && (!vendas || vendas.length === 0)) {
        alert('Nenhum dado cadastrado para exportar!');
        return;
    }

    const backupData = {
        sistema: "Rev Maker - Gestão 3D",
        versao: "2.0",
        dataExportacao: new Date().toISOString(),
        filamentos: filamentos,
        vendas: vendas
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    const dataAtual = new Date().toISOString().split('T')[0];

    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `revmaker_backup_completo_${dataAtual}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

function importarBackupUnificado(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    
    reader.onload = function(event) {
        try {
            const dadosImportados = JSON.parse(event.target.result);

            // COMPATIBILIDADE BACKUP ANTIGO (APENAS ARRAY DE FILAMENTOS)
            if (Array.isArray(dadosImportados)) {
                const confirma = confirm(`Deseja importar ${dadosImportados.length} filamento(s)? O histórico de vendas atual será mantido.`);
                if (confirma) {
                    filamentos = dadosImportados;
                    salvarNoLocalStorage();
                    renderizarListaFilamentos();
                    atualizarSelectCalculadora();
                    calcularOrcamento3D();
                    alert('Filamentos importados com sucesso!');
                }
            } 
            // BACKUP UNIFICADO COMPLETO (FILAMENTOS + VENDAS)
            else if (dadosImportados && (dadosImportados.filamentos || dadosImportados.vendas)) {
                const qtdFil = dadosImportados.filamentos ? dadosImportados.filamentos.length : 0;
                const qtdVen = dadosImportados.vendas ? dadosImportados.vendas.length : 0;

                const confirma = confirm(`Deseja importar este backup unificado? (${qtdFil} filamento(s) e ${qtdVen} venda(s)).\n\nIsso substituirá seus dados atuais no sistema.`);
                
                if (confirma) {
                    if (Array.isArray(dadosImportados.filamentos)) filamentos = dadosImportados.filamentos;
                    if (Array.isArray(dadosImportados.vendas)) vendas = dadosImportados.vendas;

                    salvarNoLocalStorage();
                    salvarVendasNoLocalStorage();

                    renderizarListaFilamentos();
                    atualizarSelectCalculadora();
                    calcularOrcamento3D();
                    renderizarVendas();

                    alert('Backup unificado importado com sucesso!');
                }
            } else {
                throw new Error('O formato do arquivo JSON de backup é incompatível.');
            }
        } catch (err) {
            alert('Erro ao importar backup: ' + err.message);
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