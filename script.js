const menuToggle = document.getElementById('menuToggle');
const menuLateral = document.getElementById('menuLateral');

menuToggle.addEventListener('click', (e) => {
    menuLateral.classList.toggle('aberto');
    e.stopPropagation();
});

document.addEventListener('click', (e) => {
    if (!menuLateral.contains(e.target) && e.target !== menuToggle) {
        menuLateral.classList.remove('aberto');
    }
});


const ctxFrota = document.getElementById('chartFrota').getContext('2d');
const ctxRegiao = document.getElementById('chartRegiao').getContext('2d');

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { labels: { color: '#a1a1aa', font: { family: 'Segoe UI' } } }
    },
    scales: {
        x: { grid: { color: '#27272a' }, ticks: { color: '#71717a' } },
        y: { grid: { color: '#27272a' }, ticks: { color: '#71717a', stepSize: 1 } }
    }
};

const chartFrota = new Chart(ctxFrota, {
    type: 'bar',
    data: {
        labels: ['RotaMax', 'ViaCargo', 'FlashLog'],
        datasets: [{
            label: 'Remessas em Atraso',
            data: [4, 1, 2],
            backgroundColor: '#A855F7',
            borderRadius: 4
        }]
    },
    options: chartOptions
});

const chartRegiao = new Chart(ctxRegiao, {
    type: 'line',
    data: {
        labels: ['Sudeste', 'Sul', 'Nordeste'],
        datasets: [{
            label: 'Ocorrências',
            data: [5, 2, 4],
            borderColor: '#F43E4E',
            backgroundColor: 'rgba(244, 62, 78, 0.1)',
            tension: 0.3,
            fill: true
        }]
    },
    options: chartOptions
});


const filtroRegiao = document.getElementById('filtroRegiao');
const filtroEmpresa = document.getElementById('filtroEmpresa');
const tabelaLinhas = document.querySelectorAll('#tabelaLogs tbody tr');

function atualizarDashboard() {
    const regiaoSelecionada = filtroRegiao.value;
    const empresaSelecionada = filtroEmpresa.value;

    let totalRemessas = 0;
    let remessasAtrasadas = 0;

    let dadosFrota = { 'RotaMax': 0, 'ViaCargo': 0, 'FlashLog': 0 };
    let dadosRegiao = { 'Sudeste': 0, 'Sul': 0, 'Nordeste': 0 };

    tabelaLinhas.forEach(linha => {
        const regiaoLinha = linha.getAttribute('data-regiao');
        const empresaLinha = linha.getAttribute('data-empresa');
        const statusLinha = linha.getAttribute('data-status');

        const bateRegiao = (regiaoSelecionada === 'Todas' || regiaoSelecionada === regiaoLinha);
        const bateEmpresa = (empresaSelecionada === 'Todas' || empresaSelecionada === empresaLinha);

        if (bateRegiao && bateEmpresa) {
            linha.style.display = '';
            totalRemessas++;
            
            if (statusLinha === 'ATRASADO') {
                remessasAtrasadas++;
                dadosFrota[empresaLinha]++;
                dadosRegiao[regiaoLinha]++;
            }
        } else {
            linha.style.display = 'none';
        }
    });

    const indiceAtraso = totalRemessas > 0 ? Math.round((remessasAtrasadas / totalRemessas) * 100) : 0;

    document.getElementById('kpiTotal').innerText = totalRemessas;
    document.getElementById('kpiAtraso').innerText = remessasAtrasadas;
    document.getElementById('kpiIndice').innerText = `${indiceAtraso}%`;

    chartFrota.data.datasets[0].data = Object.values(dadosFrota);
    chartRegiao.data.datasets[0].data = Object.values(dadosRegiao);
    
    chartFrota.update();
    chartRegiao.update();
}

filtroRegiao.addEventListener('change', atualizarDashboard);
filtroEmpresa.addEventListener('change', atualizarDashboard);

atualizarDashboard();