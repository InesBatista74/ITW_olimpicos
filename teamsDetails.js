// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/api/Teams/');
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    //--- Data Record
    self.Name = ko.observable('');
    self.Sex = ko.observable('');
    self.Athletes = ko.observableArray([]); 
    self.Coaches = ko.observableArray([]); 
    self.NOC = ko.observableArray([]); 
    self.Sport = ko.observableArray([]); 



    //--- Page Events
    self.activate = function (id) {
        console.log('CALL: getTeams...');
        var composedUri = self.baseUri() + id;
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.Name(data.Name);
            self.Sex(data.Sex);
            if (data.Athletes && Array.isArray(data.Athletes)) {
                self.Athletes(data.Athletes.map(function (athlete) {
                    return athlete.Name; // Apenas os nomes
                }));
            } else {
                self.Athletes([]); // Garante que é um array vazio se não houver dados
            }        
            if (data.Coaches && Array.isArray(data.Coaches)) {
                self.Coaches(data.Coaches.map(function (coach) {
                    return coach.Name; // Apenas os nomes
                }));
            } else {
                self.Coaches([]); // Garante que é um array vazio se não houver dados
            }        
            if (data.NOC && typeof data.NOC === 'object') {
                self.NOC(data.NOC.Name ? [data.NOC.Name] : []); // Coloca o nome num array, se existir
            } else {
                self.NOC([]); // Garante que é um array vazio se não houver dados
            }
            
            if (data.Sport && typeof data.Sport === 'object') {
                self.Sport(data.Sport.Name ? [data.Sport.Name] : []); // Coloca o nome num array, se existir
            } else {
                self.Sport([]); // Garante que é um array vazio se não houver dados
            }            
        });
    };

    //--- Internal functions
    function ajaxHelper(uri, method, data) {
        self.error(''); // Clear error message
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

    function showLoading() {
        $('#myModal').modal('show', {
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

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };

    //--- start ....
    showLoading();
    var pg = getUrlParameter('id');
    console.log(pg);
    if (pg == undefined)
        self.activate(1);
    else {
        self.activate(pg);
    }
};

$(document).ready(function () {
    console.log("document.ready!");
    ko.applyBindings(new vm());
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})