// ESTADO E LOCALSTORAGE
let filamentos = [];

// REFS DO DOM
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Formulário de Cadastro
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

// Backup (Importar / Exportar)
const btnExportar = document.getElementById('btn-exportar');
const btnImportar = document.getElementById('btn-importar');
const inputImportarJson = document.getElementById('input-importar-json');

// Calculadora
const selectFilamentoCalc = document.getElementById('select-filamento-calc');
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

// INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', () => {
    inputDataCompra.valueAsDate = new Date();
    carregarFilamentos();
    initTabEvents();
    initColorPickerEvent();
    initFormFilamentoEvents();
    initCalculadoraEvents();
    initBackupEvents();
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

// LOCALSTORAGE & DADOS
function carregarFilamentos() {
    const data = localStorage.getItem('print3d_filamentos');
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
                corHex: '#2563eb',
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
    localStorage.setItem('print3d_filamentos', JSON.stringify(filamentos));
}

// CADASTRO DE FILAMENTOS
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
    inputCorHex.value = '#2563eb';
    colorHexText.textContent = '#2563EB';
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
    selectFilamentoCalc.value = id;
    calcularOrcamento3D();
};

function atualizarSelectCalculadora() {
    selectFilamentoCalc.innerHTML = '<option value="">-- Selecione um filamento do estoque --</option>';

    filamentos.forEach(f => {
        const precoGrama = (f.precoPago / f.pesoTotal).toFixed(3);
        const option = document.createElement('option');
        option.value = f.id;
        option.textContent = `${f.marca} - ${f.tipo} (${f.corNome}) - R$ ${precoGrama}/g`;
        selectFilamentoCalc.appendChild(option);
    });
}

// MOTOR DA CALCULADORA DE PRECIFICAÇÃO
function initCalculadoraEvents() {
    const inputs = [
        selectFilamentoCalc, inputPesoUsado, inputTempoHoras, inputTempoMinutos,
        inputPotencia, inputTarifaKwh, inputTaxaDepreciacao, inputTaxaFalha,
        inputCustoMaoObra, inputMargemLucro
    ];

    inputs.forEach(input => {
        input.addEventListener('input', calcularOrcamento3D);
        input.addEventListener('change', calcularOrcamento3D);
    });

    btnCopiarResumo.addEventListener('click', copiarResumoTexto);
    calcularOrcamento3D();
}

function calcularOrcamento3D() {
    const filamentoId = selectFilamentoCalc.value;
    const filamento = filamentos.find(f => f.id === filamentoId);

    let custoFilamento = 0;
    if (filamento) {
        const custoGrama = filamento.precoPago / filamento.pesoTotal;
        const gramasUsadas = parseFloat(inputPesoUsado.value) || 0;
        custoFilamento = custoGrama * gramasUsadas;
    }

    const horas = parseFloat(inputTempoHoras.value) || 0;
    const minutos = parseFloat(inputTempoMinutos.value) || 0;
    const tempoTotalHoras = horas + (minutos / 60);

    const potenciaKW = (parseFloat(inputPotencia.value) || 0) / 1000;
    const tarifaKwh = parseFloat(inputTarifaKwh.value) || 0;
    const custoEnergia = potenciaKW * tempoTotalHoras * tarifaKwh;

    const taxaDepreciacaoHora = parseFloat(inputTaxaDepreciacao.value) || 0;
    const custoManutencao = taxaDepreciacaoHora * tempoTotalHoras;

    const subtotalDireto = custoFilamento + custoEnergia + custoManutencao;

    const taxaFalhaPercentual = (parseFloat(inputTaxaFalha.value) || 0) / 100;
    const custoFalhas = subtotalDireto * taxaFalhaPercentual;

    const custoMaoObra = parseFloat(inputCustoMaoObra.value) || 0;

    const custoTotalProducao = subtotalDireto + custoFalhas + custoMaoObra;

    const margemLucroPercentual = (parseFloat(inputMargemLucro.value) || 0) / 100;
    const lucroLiquido = custoTotalProducao * margemLucroPercentual;
    const precoVendaFinal = custoTotalProducao + lucroLiquido;

    // ATUALIZAÇÃO DA TELA
    resCustoFilamento.textContent = formatarMoeda(custoFilamento);
    resCustoEnergia.textContent = formatarMoeda(custoEnergia);
    resCustoManutencao.textContent = formatarMoeda(custoManutencao);
    resSubtotalDireto.textContent = formatarMoeda(subtotalDireto);
    resCustoFalhas.textContent = formatarMoeda(custoFalhas);
    resCustoMaoObra.textContent = formatarMoeda(custoMaoObra);
    resCustoTotal.textContent = formatarMoeda(custoTotalProducao);
    resLucroLiquido.textContent = formatarMoeda(lucroLiquido);
    resPrecoVenda.textContent = formatarMoeda(precoVendaFinal);

    const margemExibicao = (parseFloat(inputMargemLucro.value) || 0);
    resBadgeLucro.textContent = `Lucro Líquido: ${formatarMoeda(lucroLiquido)} (+${margemExibicao}%)`;
}

function copiarResumoTexto() {
    const filamentoSel = selectFilamentoCalc.options[selectFilamentoCalc.selectedIndex]?.text || 'N/A';
    const precoVenda = resPrecoVenda.textContent;
    const custoTotal = resCustoTotal.textContent;
    const peso = inputPesoUsado.value;
    const tempoH = inputTempoHoras.value;
    const tempoM = inputTempoMinutos.value;

    const texto = `📦 *ORÇAMENTO DE IMPRESSÃO 3D*
-----------------------------------
🧵 *Material:* ${filamentoSel}
⚖️ *Peso Estimado:* ${peso}g
⏱️ *Tempo de Impressão:* ${tempoH}h ${tempoM}min
💰 *Custo de Produção:* ${custoTotal}
🏷️ *VALOR FINAL SUGERIDO:* ${precoVenda}
-----------------------------------
Gerado por Print3D Control`;

    navigator.clipboard.writeText(texto).then(() => {
        alert('Orçamento copiado para a área de transferência!');
    });
}

// BACKUP (EXPORTAR / IMPORTAR)
function initBackupEvents() {
    btnExportar.addEventListener('click', exportarFilamentos);
    btnImportar.addEventListener('click', () => inputImportarJson.click());
    inputImportarJson.addEventListener('change', importarFilamentos);
}

function exportarFilamentos() {
    if (filamentos.length === 0) {
        alert('Nenhum filamento cadastrado para exportar!');
        return;
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filamentos, null, 2));
    const downloadAnchor = document.createElement('a');
    const dataAtual = new Date().toISOString().split('T')[0];

    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `backup_filamentos_${dataAtual}.json`);
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
                throw new Error('O arquivo precisa conter uma lista válida de filamentos.');
            }

            const estruturaValida = dadosImportados.every(item => item.marca && item.tipo && item.precoPago);
            if (!estruturaValida) {
                throw new Error('O formato dos dados do arquivo é inválido.');
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

        inputImportarJson.value = '';
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