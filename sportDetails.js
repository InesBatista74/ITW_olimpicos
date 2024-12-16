function SportDetailsViewModel() {
    var self = this;

    // Propriedades observáveis para armazenar os detalhes do desporto
    self.Id = ko.observable();
    self.Name = ko.observable();
    self.Sport_url = ko.observable();
    self.Pictogram = ko.observable();
    self.Athletes = ko.observableArray([]);
    self.NumAthletes = ko.observable();

    // Função para buscar os detalhes do desporto
    self.loadSportDetails = function () {
        const params = new URLSearchParams(window.location.search);
        const sportId = params.get('id');

        if (sportId) {
            fetch(`http://192.168.160.58/Paris2024/api/Sports/${sportId}`, {
                method: "GET"
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('A resposta da rede não foi ok: ' + response.statusText);
                    }
                    return response.json();
                })
                .then(data => {
                    // Atualiza as propriedades observáveis com os dados do desporto
                    self.Id(data.Id || 'unknown');
                    self.Name(data.Name) || 'unknown';
                    self.Sport_url(data.Sport_url) || 'unknown';
                    self.Pictogram(data.Pictogram) || 'unknown';
                    self.Athletes(data.Athletes) || 'unknown';
                    // number of athletes
                    self.NumAthletes(data.Athletes.length) || 'unknown';
                })
                .catch(error => {
                    console.error('Houve um problema com a operação de fetch:', error);
                });
        }
    };
}

// Aplica o Knockout.js bindings
const sportDetailsViewModel = new SportDetailsViewModel();
ko.applyBindings(sportDetailsViewModel);

// Carrega os detalhes do atleta ao iniciar a página
sportDetailsViewModel.loadSportDetails();