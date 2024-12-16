function CoachDetailsViewModel() {
    var self = this;

    // Propriedades observáveis para armazenar os detalhes do coach
    self.Id = ko.observable();
    self.Name = ko.observable();
    self.Sex = ko.observable();
    self.BirthDate = ko.observable();
    self.Function = ko.observable();
    self.Photo = ko.observable();
    self.Country_code = ko.observable();
    self.Country = ko.observable();
    self.Url = ko.observable();
    self.Sports = ko.observableArray([]);
    self.SportName = ko.observable();

    // Função para buscar os detalhes do atleta
    self.loadCoachDetails = function () {
        const params = new URLSearchParams(window.location.search);
        const coachId = params.get('id');

        if (coachId) {
            fetch(`http://192.168.160.58/Paris2024/api/coaches/${coachId}`, {
                method: "GET"
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('A resposta da rede não foi ok: ' + response.statusText);
                    }
                    return response.json();
                })
                .then(data => {
                    // Atualiza as propriedades observáveis com os dados do atleta
                    self.Id(data.Id || 'unknown');
                    self.Name(data.Name) || 'unknown';
                    self.Sex(data.Sex) || 'unknown';
                    self.BirthDate(data.BirthDate) || 'unknown';
                    self.Function(data.Function) || 'unknown';
                    self.Photo(data.Photo) || 'unknown';
                    self.Country_code(data.Country_code) || 'unknown';
                    self.Country(data.Country) || 'unknown';
                    self.Url(data.URL) || 'unknown';
                    self.Sports(data.Sports) || 'unknown';
                    // gets the name of the sport
                    self.SportName(data.Sports[0].Name) || 'unknown';
                })
                .catch(error => {
                    console.error('Houve um problema com a operação de fetch:', error);
                });
        }
    };
}

// Aplica o Knockout.js bindings
const coachDetailsViewModel = new CoachDetailsViewModel();
ko.applyBindings(coachDetailsViewModel);

// Carrega os detalhes do atleta ao iniciar a página
coachDetailsViewModel.loadCoachDetails();






