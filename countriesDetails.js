function CountryDetailsViewModel() {
    var self = this;

    // Propriedades observáveis para armazenar os detalhes do país
    self.Id = ko.observable();
    self.Name = ko.observable();
    self.Url = ko.observable();
    self.Photo = ko.observable();
    self.Athletes = ko.observableArray([]);
    self.Coaches = ko.observableArray([]);
    self.Medals = ko.observableArray([]);
    self.Teams = ko.observableArray([]);

    // Função para buscar os detalhes do país
    self.loadCountryDetails = function () {
        const params = new URLSearchParams(window.location.search);
        const nocId = params.get('id');

        if (nocId) {
            fetch(`http://192.168.160.58/Paris2024/api/NOCs/${nocId}`, {
                method: "GET"
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('A resposta da rede não foi ok: ' + response.statusText);
                    }
                    return response.json();
                })
                .then(data => {
                    // Atualiza as propriedades observáveis com os dados do país
                    self.Id(data.Id || 'unknown');
                    self.Name(data.Name) || 'unknown';
                    self.Url(data.Url) || 'unknown';
                    self.Photo(data.Photo) || 'unknown';
                    self.Athletes(data.Athletes) || 'unknown';
                    self.Coaches(data.Coaches) || 'unknown';
                    self.Medals(data.Medals) || 'unknown';
                    self.Teams(data.Teams) || 'unknown';
                })
                .catch(error => {
                    console.error('Houve um problema com a operação de fetch:', error);
                });
        }
    };
}

// Aplica o Knockout.js bindings
const countryDetailsViewModel = new CountryDetailsViewModel();
ko.applyBindings(countryDetailsViewModel);

// Carrega os detalhes do atleta ao iniciar a página
countryDetailsViewModel.loadCountryDetails();