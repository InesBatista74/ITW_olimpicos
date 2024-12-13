const map = L.map('map').setView([48.8566, 2.3522], 5); // Coordenadas iniciais (Paris)

// Adicionando camada de mapa base (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// URL da API
const apiUrl = 'http://192.168.160.58/Paris2024/API/Torch_route';

// Criando um ícone customizado com a imagem fornecida
const torchIcon = L.icon({
    iconUrl: 'images/torch-removebg-preview.png', // Caminho para a imagem do arquivo
    iconSize: [32, 32], // Tamanho do ícone
    iconAnchor: [16, 32], // Posição do "pico" do ícone
    popupAnchor: [0, -32] // Posição do popup
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
        data.forEach(location => {
            const { Lat, Lon, Title, City, Date_start, Date_end } = location;

            // Criar um marcador apenas se Lat e Lon forem válidos
            if (Lat && Lon) {
                const marker = L.marker([parseFloat(Lat), parseFloat(Lon)], { icon: torchIcon }).addTo(map);

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

                // Adicionar evento de click com popup
                marker.bindPopup(`
                    <b>${Title}</b><br>
                    City: ${City}<br>
                    Start: ${startDate}<br>
                    End: ${endDate}
                `);
            }
        });
    })
    .catch(error => {
        console.error('Erro ao carregar dados:', error);
        alert('Não foi possível carregar as localizações.');
    });
