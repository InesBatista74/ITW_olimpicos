function TechnicalOfficialsDetailsViewModel() {
    var self = this;

    // Propriedades observáveis para armazenar os detalhes do oficial técnico
    self.Id = ko.observable();
    self.Name = ko.observable();
    self.Sex = ko.observable();
    self.BirthDate = ko.observable();
    self.Function = ko.observable();
    self.Photo = ko.observable();
    self.Url = ko.observable();
    self.Organisation = ko.observable();
    self.OrganisationCode = ko.observable();
    self.Sports = ko.observable();

    // Função para buscar os detalhes do atleta
    self.loadTechnicalOfficialDetails = function () {
        const params = new URLSearchParams(window.location.search);
        const technicalOfficialId = params.get('id');

        if (technicalOfficialId) {
            fetch(`http://192.168.160.58/Paris2024/api/Technical_officials/${technicalOfficialId}`, {
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
                    const photoUrl = data.Photo || 'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG.png';
                    self.Photo(photoUrl);
                    self.Url(data.Url) || 'unknown';
                    self.Organisation(data.Organisation) || 'unknown';
                    self.OrganisationCode(data.OrganisationCode) || 'unknown';
                    self.Sports(data.Sports) || 'unknown';
                })
                .catch(error => {
                    console.error('Houve um problema com a operação de fetch:', error);
                });
        }
    };
}

// Aplica o Knockout.js bindings
const technicalOfficialsDetailsViewModel = new TechnicalOfficialsDetailsViewModel();
ko.applyBindings(technicalOfficialsDetailsViewModel);

// Carrega os detalhes do atleta ao iniciar a página
technicalOfficialsDetailsViewModel.loadTechnicalOfficialDetails();