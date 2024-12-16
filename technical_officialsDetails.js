// ViewModel Knockout.js
function TechnicalOfficialViewModel() {
    var self = this;

    // Variáveis observáveis para os detalhes do técnico oficial
    self.Id = ko.observable();
    self.Name = ko.observable();
    self.Sex = ko.observable();
    self.BirthDate = ko.observable();
    self.Photo = ko.observable();
    self.Category = ko.observable();
    self.Function = ko.observable();
    self.Organisation = ko.observable();

    // Variável para armazenar esportes
    self.Sports = ko.observableArray([]);

    // URL base da API
    const API_URL = "http://192.168.160.58/Paris2024/api/Athletes/";

    // Função para obter o ID da URL
    function getIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get("id");
    }

    // Função para buscar detalhes do técnico oficial
    self.loadTechnicalOfficialDetails = function () {
        const id = getIdFromUrl();

        if (!id) {
            alert("ID do Técnico Oficial não encontrado na URL.");
            return;
        }

        fetch(API_URL + id)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erro ao buscar dados da API: " + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                // Preencher os observáveis com os dados recebidos
                self.Id(data.Id);
                self.Name(data.Name);
                self.Sex(data.Sex);
                self.BirthDate(new Date(data.BirthDate).toLocaleDateString());
                self.Photo(data.Photo || "images/default_photo.png");
                self.Category(data.Category);
                self.Function(data.Function);
                self.Organisation(data.Organisation);

                // Preencher a lista de esportes
                self.Sports(data.Sports || []);
            })
            .catch(error => {
                console.error("Erro:", error);
                alert("Erro ao carregar os detalhes do Técnico Oficial.");
            });
    };

    // Carregar dados ao iniciar
    self.loadTechnicalOfficialDetails();
}

// Aplicar os bindings quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", function () {
    ko.applyBindings(new TechnicalOfficialViewModel());
});
