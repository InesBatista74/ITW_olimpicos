function AthleteDetailsViewModel() {
    var self = this;

    // Propriedades observáveis para armazenar os detalhes do atleta
    self.Id = ko.observable();
    self.Name = ko.observable();
    self.NameShort = ko.observable();
    self.NameTV = ko.observable();
    self.BirthCountry = ko.observable();
    self.BirthDate = ko.observable();
    self.BirthPlace = ko.observable();
    self.Sex = ko.observable();
    self.Photo = ko.observable();
    self.Height = ko.observable();
    self.Weight = ko.observable();
    self.Lang = ko.observable();
    self.Function = ko.observable();
    self.Country_code = ko.observable();
    self.Country = ko.observable();
    self.Nationality_code = ko.observable();
    self.Residence_place = ko.observable();
    self.Residence_country = ko.observable();
    self.Nickname = ko.observable();
    self.Hobbies = ko.observable();
    self.Occupation = ko.observable();
    self.Education = ko.observable();
    self.Family = ko.observable();
    self.Reason = ko.observable();
    self.Hero = ko.observable();
    self.Influence = ko.observable();
    self.Philosophy = ko.observable();
    self.SportingRelatives = ko.observable();
    self.Ritual = ko.observable();
    self.OtherSports = ko.observable();
    self.Url = ko.observable();
    self.Medals = ko.observableArray([]);
    self.Sports = ko.observableArray([]);
    self.Competitions = ko.observableArray([]);

    // Função para buscar os detalhes do atleta
    self.loadAthleteDetails = function() {
        const params = new URLSearchParams(window.location.search);
        const athleteId = params.get('id');

        if (athleteId) {
            fetch(`http://192.168.160.58/Paris2024/api/Athletes/${athleteId}`, {
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
                self.Id(data.Id|| 'unknown');
                self.Name(data.Name)|| 'unknown';
                self.NameShort(data.NameShort|| 'unknown');
                self.NameTV(data.NameTV|| 'unknown');
                self.BirthCountry(data.BirthCountry|| 'unknown');
                self.BirthDate(data.BirthDate.split('T')[0]); // Formata a data
                self.BirthPlace(data.BirthPlace|| 'unknown');
                self.Sex(data.Sex|| 'unknown');
                self.Photo(data.Photo|| 'imagemDefault.png');
                self.Height(data.Height || 'unknown');
                self.Weight(data.Weight|| 'unknown');
                self.Lang(data.Lang|| 'unknown');
                self.Function(data.Function|| 'unknown');
                self.Country_code(data.Country_code|| 'unknown');
                self.Country(data.Country|| 'unknown');
                self.Nationality_code(data.Nationality_code|| 'unknown');
                self.Residence_place(data.Residence_place|| 'unknown');
                self.Residence_country(data.Residence_country|| 'unknown');
                self.Nickname(data.Nickname|| 'unknown');
                self.Hobbies(data.Hobbies|| 'unknown');
                self.Occupation(data.Occupation|| 'unknown');
                self.Education(data.Education|| 'unknown');
                self.Family(data.Family|| 'unknown');
                self.Reason(data.Reason || 'unknown');
                self.Hero(data.Hero || 'unknown');
                self.Influence(data.Influence || 'unknown');
                self.Philosophy(data.Philosophy || 'unknown');
                self.SportingRelatives(data.SportingRelatives|| 'unknown');
                self.Ritual(data.Ritual || 'unknown');
                self.OtherSports(data.OtherSports || 'unknown');
                self.Url(data.Url || 'unknown');
                self.Medals(data.Medals|| []);
                self.Sports(data.Sports || 'unknown');
                self.Competitions(data.Competitions || 'unknown');
            })
            .catch(error => {
                console.error('Houve um problema com a operação de fetch:', error);
            });
        }
    };
}

// Aplica o Knockout.js bindings
const athleteDetailsViewModel = new AthleteDetailsViewModel();
ko.applyBindings(athleteDetailsViewModel);

// Carrega os detalhes do atleta ao iniciar a página
athleteDetailsViewModel.loadAthleteDetails();