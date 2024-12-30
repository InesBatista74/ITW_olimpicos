
const apiURL = "http://192.168.160.58/Paris2024/api/Basketballs/Events"; // Insira aqui o link da sua API

$(document).ready(function () {
    const $dropdown = $('#eventDropdown');
    const $tableBody = $('#stagesTableBody');
    const $selectedEventName = $('#selectedEventName');

    // Carregar eventos da API
    function loadEvents() {
        $.ajax({
            url: apiURL,
            method: "GET",
            dataType: "json",
            success: function (data) {
                populateDropdown(data);
                if (data.length > 0) {
                    // Carregar os stages do primeiro evento por padrão
                    $dropdown.val(data[0].EventId);
                    loadStages(data[0].EventId, data);
                }
            },
            error: function () {
                alert("Erro ao carregar os dados da API.");
                $dropdown.html('<option value="">Failed to load events</option>');
            }
        });
    }

    // Preencher o dropdown com eventos
    function populateDropdown(events) {
        $dropdown.empty(); // Limpar dropdown
        events.forEach(event => {
            $dropdown.append(`<option value="${event.EventId}">${event.EventName}</option>`);
        });
    }

    // Carregar estágios na tabela
    function loadStages(eventId, allEvents) {
        $tableBody.empty(); // Limpar tabela

        const selectedEvent = allEvents.find(event => event.EventId === eventId);
        if (!selectedEvent) return;

        $selectedEventName.text(selectedEvent.EventName);

        selectedEvent.Stages.forEach(stage => {
            const row = `
                        <tr>
                            <td class="align-middle">${stage.StageId}</td>
                            <td class="align-middle">${stage.StageName}</td>
                            <td class="text-end">
                                <a class="btn btn-light btn-xs" href="basketball_details.html?EventId=${eventId}&StageId=${stage.StageId}">
                                    <i class="fa fa-eye text-secundary" title="View Details"></i>
                                </a>
                            </td>
                        </tr>
                    `;
            $tableBody.append(row);
        });
    }

    // Evento para mudança de dropdown
    $dropdown.on('change', function () {
        const selectedEventId = $(this).val();
        $.ajax({
            url: apiURL,
            method: "GET",
            dataType: "json",
            success: function (data) {
                loadStages(selectedEventId, data);
            },
            error: function () {
                alert("Erro ao carregar os stages.");
            }
        });
    });

    // Inicializar
    loadEvents();
});

