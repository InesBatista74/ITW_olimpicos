const apiBaseURL = "http://192.168.160.58/Paris2024/api/Basketballs/%7Bid%7D";

$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('EventId');
    const stageId = urlParams.get('StageId');

    if (!eventId || !stageId) {
        alert("EventId ou StageId não encontrados!");
        return;
    }

    // Função para carregar detalhes do Stage
    function loadStageDetails(eventId, stageId) {
        const requestURL = `${apiBaseURL}?EventId=${eventId}&StageId=${stageId}`;

        $.ajax({
            url: requestURL,
            method: "GET",
            dataType: "json",
            success: function (data) {
                populateDetailsTable(data);
            },
            error: function () {
                alert("Erro ao carregar os detalhes do Stage.");
            }
        });
    }

    // Preenche a tabela com os dados recebidos
    function populateDetailsTable(details) {
        const $tableBody = $("#detailsTableBody");
        $tableBody.empty();

        if (details.length === 0) {
            $tableBody.append("<tr><td colspan='9' class='text-center'>Nenhum detalhe encontrado!</td></tr>");
            return;
        }

        $("#stageTitle").text(`Details for Stage: ${details[0].StageName}`);

        details.forEach(item => {
            const row = `
                        <tr>
                            <td>${item.Id}</td>
                            <td>${item.Name}</td>
                            <td>${item.EventName} (${item.EventId})</td>
                            <td>${item.StageName} (${item.StageId})</td>
                            <td>${item.Sex}</td>
                            <td>${item.ParticipantType}</td>
                            <td>${item.ParticipantCode}</td>
                            <td>${item.ParticipantName}</td>
                            <td>${item.CountryName} (${item.CountryCode})</td>
                        </tr>
                    `;
            $tableBody.append(row);
        });
    }

    // Botão "Back to List"
    $("#backButton").click(function () {
        window.history.back();
    });

    // Carregar detalhes ao abrir a página
    loadStageDetails(eventId, stageId);
});

