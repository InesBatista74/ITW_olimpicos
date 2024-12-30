// Função para carregar eventos a partir da API
function loadEvents() {
    // URL da sua API (substitua pelo link real)
        const apiUrl = "http://192.168.160.58/Paris2024/api/Swimmings/Events";  // Substitua com o link correto da sua API

    // Faz a solicitação à API
    fetch(apiUrl)
      .then(response => response.json()) // Converte a resposta para JSON
      .then(data => {
        const eventDropdown = document.getElementById("eventDropdown");

    // Limpa o dropdown antes de preencher com novos eventos
    eventDropdown.innerHTML = '<option value="">Select Event</option>';

        // Preenche o dropdown com os eventos
        data.forEach(event => {
          const option = document.createElement("option");
    option.value = event.EventId;
    option.textContent = event.EventName;
    eventDropdown.appendChild(option);
        });

    // Adiciona um evento para quando o usuário selecionar um evento
    eventDropdown.addEventListener('change', function () {
          const selectedEventId = this.value;
          const selectedEvent = data.find(event => event.EventId === selectedEventId);
    if (selectedEvent) {
        displayStages(selectedEvent, selectedEventId);  // Passando o eventId junto com os estágios
          }
        });
      })
      .catch(error => {
        console.error("Erro ao carregar os eventos:", error);
      });
  }

    // Função para exibir os estágios na tabela
    function displayStages(selectedEvent, eventId) {
    const tableBody = document.getElementById("stagesTableBody");
    tableBody.innerHTML = "";  // Limpa a tabela antes de adicionar as novas linhas

    selectedEvent.Stages.forEach(stage => {
      const row = `
    <tr>
        <td class="align-middle">${stage.StageId}</td>
        <td class="align-middle">${stage.StageName}</td>
        <td class="text-end">
            <a class="btn btn-light btn-xs" href="swimming_details.html?EventId=${eventId}&StageId=${stage.StageId}">
                <i class="fa fa-eye text-secundary"  title="View Details"></i>
            </a>
        </td>
    </tr>
    `;
    tableBody.insertAdjacentHTML('beforeend', row);
    });
  }

    // Chama a função de carregar eventos quando a página for carregada
    window.onload = loadEvents;

