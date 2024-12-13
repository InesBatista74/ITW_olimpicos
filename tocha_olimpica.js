// Inicializando o mapa
const map = L.map('map').setView([48.8566, 2.3522], 5); // Coordenadas iniciais (Paris)

// Adicionando camada de mapa base (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// URL da API
const apiUrl = 'http://192.168.160.58/Paris2024/API/Torch_route';

// Ícone personalizado padrão (lilás)
const defaultTorchIcon = L.divIcon({
    className: 'custom-torch-icon',
    html: '<i class="fa-solid fa-fire-flame-simple" style="font-size: 32px; color:#e9a8f0;"></i>', // Lilás
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

// Ícone para o primeiro marcador (azul)
const firstTorchIcon = L.divIcon({
    className: 'custom-torch-icon',
    html: '<i class="fa-solid fa-fire-flame-simple" style="font-size: 32px; color:#3498db;"></i>', // Azul
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

// Ícone para o último marcador (vermelho)
const lastTorchIcon = L.divIcon({
    className: 'custom-torch-icon',
    html: '<i class="fa-solid fa-fire-flame-simple" style="font-size: 32px; color:#e74c3c;"></i>', // Vermelho
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

// Fetch dos dados da API e adição de marcadores ao mapa
fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar dados da API');
        }
        return response.json();
    })
    .then(data => {
        data.forEach((location, index) => {
            const { Lat, Lon, Title, City, Date_start, Date_end } = location;

            // Verifica se as coordenadas são válidas
            if (Lat && Lon) {
                // Determinar o ícone baseado na posição (primeiro, último ou padrão)
                let iconToUse = defaultTorchIcon;
                if (index === 0) iconToUse = firstTorchIcon; // Primeiro marcador
                if (index === data.length - 1) iconToUse = lastTorchIcon; // Último marcador

                const marker = L.marker([parseFloat(Lat), parseFloat(Lon)], { icon: iconToUse }).addTo(map);

                // Formatar datas
                const startDate = new Date(Date_start).toLocaleString();
                const endDate = new Date(Date_end).toLocaleString();

                // Adicionar eventos de mouse (hover)
                marker.on('mouseover', (e) => {
                    hoverInfo.style.display = 'block';
                    hoverInfo.innerHTML = `
                        <strong>${Title}</strong><br>
                        <strong>City:</strong> ${City}<br>
                        <strong>Start:</strong> ${startDate}<br>
                        <strong>End:</strong> ${endDate}
                    `;
                    hoverInfo.style.left = e.originalEvent.pageX + 'px';
                    hoverInfo.style.top = e.originalEvent.pageY + 'px';
                });

                marker.on('mouseout', () => {
                    hoverInfo.style.display = 'none';
                });

                // Adicionar evento de click com popup sem botão de fechar
                marker.bindPopup(`
                    <b>${Title}</b><br>
                    City: ${City}<br>
                    Start: ${startDate}<br>
                    End: ${endDate}
                    `, { closeButton: false });
            }
        });
    })
    .catch(error => {
        console.error('Erro ao carregar dados:', error);
        alert('Não foi possível carregar as localizações.');
    });
