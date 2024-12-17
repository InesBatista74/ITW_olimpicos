// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel has been initiated.');
    // local vars (set as ko observables)
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/API/Competitions');
    self.displayName = 'Paris2024 Competitions List';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    self.competitions = ko.observableArray([]);
    self.sports = ko.observableArray([]); // Lista de desportos
    self.currentPage = ko.observable(1);
    self.pagesize = ko.observable(20);
    self.totalRecords = ko.observable(329);
    self.hasPrevious = ko.observable(false);
    self.hasNext = ko.observable(false);
    self.totalPages = ko.observable(0);
    self.sportCode = ko.observable(''); // Armazena o código do desporto selecionado

    self.previousPage = ko.computed(function () {
        return self.currentPage() * 1 - 1;
    }, self);
    self.nextPage = ko.computed(function () {
        return self.currentPage() * 1 + 1;
    }, self);
    self.fromRecord = ko.computed(function () {
        return self.previousPage() * self.pagesize() + 1;
    }, self);
    self.toRecord = ko.computed(function () {
        return Math.min(self.currentPage() * self.pagesize(), self.totalRecords());
    }, self);
    
    self.pageArray = function () {
        var list = [];
        var size = Math.min(self.totalPages(), 9);
        var step;
        if (size < 9 || self.currentPage() === 1)
            step = 0;
        else if (self.currentPage() >= self.totalPages() - 4)
            step = self.totalPages() - 9;
        else
            step = Math.max(self.currentPage() - 5, 0);

        for (var i = 1; i <= size; i++)
            list.push(i + step);
        return list;
    };

    self.totalPages = ko.computed(function () {
        return Math.ceil(self.totalRecords() / self.pagesize());
    });


    // Função para carregar competições, com filtro opcional pelo SportId
    self.activate = function (page, sportCode = '') {
        console.log('CALL: getCompetitions...');
        var composedUri = self.baseUri() + "?page=" + page + "&pageSize=" + self.pagesize();
        if (sportCode) {
            composedUri += "&sportCode=" + sportCode; // Adiciona o filtro de esporte
        }
        showLoading();
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log("Data received:", data);
            hideLoading();
            self.competitions(data.Competitions);
            self.currentPage(data.CurrentPage);
            self.hasNext(data.HasNext);
            self.hasPrevious(data.HasPrevious);
            self.totalRecords(data.TotalCompetitions);
            console.log("total pages: " + self.totalPages);
            console.log("total comps: " + data.TotalCompetitions);
        });
    };
    
    // Função para carregar os desportos disponíveis
    self.loadSports = function () {
        console.log('CALL: getSports...');
        var sportsUri = self.baseUri() + "/Sports"; // Presume que existe uma rota para obter desportos
        ajaxHelper(sportsUri, 'GET').done(function (data) {
            console.log(data);
            self.sports(data); // Supondo que a API retorna uma lista de desportos
        });
    };


    self.sportCode.subscribe(function (newSportCode) {
        console.log("Sport code changed:", newSportCode);
        self.activate(1, newSportCode); // Passa o código do esporte para a função de carregamento
    });
    

    // internal funcs
    function ajaxHelper(uri, method, data) {
        self.error(''); // clears the error msg
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null,
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("AJAX Call[" + uri + "] Fail...");
                hideLoading();
                self.error(errorThrown);
            }
        });
    }

    function sleep(milliseconds) {
        const start = Date.now();
        // the while loop (empty) will run for the desired duration
        // essentially fullfilling the role of a sleep function 
        while (Date.now() - start < milliseconds);
    }

    function showLoading() {
        $("#myModal").modal('show', {
            backdrop: 'static',
            keyboard: false
        });
    }
    function hideLoading() {
        $('#myModal').on('shown.bs.modal', function (e) {
            $("#myModal").modal('hide');
        })
    }

    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;
        console.log("sPageURL=", sPageURL);
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };

    // start
    showLoading();
    self.loadSports(); // Carrega os desportos
    var pg = getUrlParameter('page');
    console.log(pg);
    if (pg == undefined)
        self.activate(1);
    else {
        self.activate(pg);
    }
    console.log("VM initialized!");
};

$(document).ready(function () {
    console.log("ready!");
    ko.applyBindings(new vm());
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
});







