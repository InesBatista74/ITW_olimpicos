const map = L.map('map').setView([48.8566, 2.3522], 12); // Coordenadas iniciais (Paris)


// Adicionando camada de mapa base (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// URL da API
const apiUrl = 'http://192.168.160.58/Paris2024/API/Torch_route';

// Ícone personalizado padrão (cor: #4175f0 e tamanho aumentado)
const defaultTorchIcon = L.divIcon({
    className: 'custom-torch-icon',
    html: '<i class="fa-solid fa-location-pin" style="font-size: 40px; color:#5f4bb8"></i>', // Azul #4175f0
    iconSize: [10, 10], // Aumentando o tamanho do ícone
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});

// Ícone para o primeiro marcador (azul)
const firstTorchIcon = L.divIcon({
    className: 'custom-torch-icon',
    html: '<i class="fa-solid fa-location-pin" style="font-size: 40px; color:#5f4bb8"></i>', // Azul #4175f0
    iconSize: [10, 10], // Aumentando o tamanho do ícone
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});

// Ícone para o último marcador (vermelho)
const lastTorchIcon = L.divIcon({
    className: 'custom-torch-icon',
    html: '<i class="fa-solid fa-location-pin" style="font-size: 40px; color:#5f4bb8"></i>', // Azul #4175f0
    iconSize: [10, 10], // Aumentando o tamanho do ícone
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});

// Array para armazenar coordenadas dos pontos
let torchRoute = [];

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
                // Adicionar as coordenadas ao array do percurso
                torchRoute.push([parseFloat(Lat), parseFloat(Lon)]);

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

        // Depois de adicionar todos os marcadores, adicionar a linha conectando-os
        if (torchRoute.length > 1) {
            const torchLine = L.polyline(torchRoute, { color: '#e878f5', weight: 4 }).addTo(map);

            // Ajusta o mapa para que a linha e os pontos fiquem visíveis
            map.fitBounds(torchLine.getBounds());
        }
    })
    .catch(error => {
        console.error('Erro ao carregar dados:', error);
        alert('Não foi possível carregar as localizações.');
    });



// Definir o ícone vermelho para o marcador clicado
const clickedTorchIcon = L.divIcon({
    className: 'custom-torch-icon',
    html: '<i class="fa-solid fa-map-pin" style="font-size: 40px; color:#ff0000"></i>', // Vermelho
    iconSize: [10, 10],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});
