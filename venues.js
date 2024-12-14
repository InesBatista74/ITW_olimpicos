const map = L.map('map').setView([48.8566, 2.3522], 12); // Coordenadas iniciais (Paris)

// Adicionando camada de mapa base (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Elemento para exibir informações ao passar o mouse
const hoverInfo = document.createElement('div');
hoverInfo.id = 'hover-info';
hoverInfo.style.position = 'absolute';
hoverInfo.style.display = 'none';
hoverInfo.style.background = 'white';
hoverInfo.style.border = '1px solid #ccc';
hoverInfo.style.padding = '10px';
hoverInfo.style.borderRadius = '5px';
map.getContainer().appendChild(hoverInfo);


// URL da API
const apiUrl = 'http://192.168.160.58/Paris2024/API/Venues';

// Fetch dos dados da API e adição de marcadores ao mapa
fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar dados da API');
        }
        return response.json();
    })
    .then(data => {
        data.forEach(location => {
            const { Lat, Lon, Name, DateStart, DateEnd, NumSports } = location;

            // Criar um marcador apenas se Lat e Lon forem válidos
            if (Lat && Lon) {
                // Criar um ícone personalizado usando HTML
                const customIcon = L.divIcon({
                    html: '<i class="fa-solid fa-circle" style="font-size: 24px; color: #b457fa;"></i>',
                    iconSize: [50, 50], // Tamanho do ícone
                    className: 'custom-marker' // Classe personalizada para estilização
                });

                const marker = L.marker([parseFloat(Lat), parseFloat(Lon)], { icon: customIcon }).addTo(map);

                // Formatar datas
                const startDate = new Date(DateStart).toLocaleString();
                const endDate = new Date(DateEnd).toLocaleString();

                // Adicionar eventos de mouse (hover)
                // Adicionar eventos de mouse (hover)
                marker.on('mouseover', (e) => {
                hoverInfo.style.display = 'block';
                hoverInfo.innerHTML = `
                <strong>${Name}</strong><br>
                <strong>Start:</strong> ${startDate}<br>
                <strong>End:</strong> ${endDate}<br>
                <strong>Categories:</strong> ${NumSports} sports
                `;

                // Ajuste de posição do hoverInfo
                const latlng = e.latlng; // Pega a latitude e longitude do marcador
                const point = map.latLngToContainerPoint(latlng); // Converte para coordenadas do mapa

                hoverInfo.style.left = (point.x + 10) + 'px'; // Adiciona um pequeno deslocamento
                hoverInfo.style.top = (point.y - 20) + 'px';  // Ajusta a altura
                });

                marker.on('mouseout', () => {
                hoverInfo.style.display = 'none';
                });


                // Adicionar evento de click com popup
                marker.bindPopup(`
                    <b>${Name}</b><br>
                    Start: ${startDate}<br>
                    End: ${endDate}<br>
                    Categories: ${NumSports} sports
                `, { closeButton: false });
            }
        });
    })
    .catch(error => {
        console.error('Erro ao carregar dados:', error);
        alert('Não foi possível carregar as localizações.');
    });
