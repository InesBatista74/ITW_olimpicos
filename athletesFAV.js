$(document).ready(function () {
    console.log("Página de favoritos carregada!");

    // Função para carregar e exibir os favoritos na tabela
    function updateFavouritesTable() {
        // Recuperar os favoritos do localStorage
        var favourites = JSON.parse(localStorage.getItem('favorites')) || [];
        
        // Selecionar o corpo da tabela onde os favoritos serão inseridos
        var tableBody = $('#table-favourites');
        tableBody.empty(); // Limpar a tabela antes de inserir os novos dados

        // Verificar se há favoritos
        if (favourites.length === 0) {
            tableBody.append('<tr><td colspan="5" class="text-center">No favourite athletes added yet.</td></tr>');
        } else {
            // Inserir cada atleta favorito na tabela
            favourites.forEach(function (athlete) {
                var row = `<tr>
                    <td>${athlete.Id}</td>
                    <td>${athlete.Name}</td>
                    <td>${athlete.Sex}</td>
                    <td><a href="./athleteDetails.html?id=${athlete.Id}" class="btn btn-light btn-xs"><i class="fa-solid fa-person" title="Show details"></i></a></td>
                </tr>`;
                tableBody.append(row);
            });
        }
    }

    // Atualizar a tabela de favoritos ao carregar a página
    updateFavouritesTable();
});
