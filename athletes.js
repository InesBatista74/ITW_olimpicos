// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel has been initiated.');
    // local vars (set as ko observables)
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/API/athletes');
    self.displayName = 'Paris2024 Athletes List';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    self.athletes = ko.observableArray([]);
    self.currentPage = ko.observable(1);
    self.pagesize = ko.observable(20);
    self.totalRecords = ko.observable(50);
    self.hasPrevious = ko.observable(false);
    self.hasNext = ko.observable(false);

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
    self.totalPages = ko.observable(0);
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

    self.favorites = ko.observableArray(JSON.parse(localStorage.getItem('favorites')) || []);
    self.filterOption = ko.observable('all');

    self.filteredAthletes = ko.computed(function () {
        if (self.filterOption() === 'favorites') {
            return self.athletes().filter(function (athlete) {
                return self.isFavorite(athlete);
            });
        }
        return self.athletes();
    });
    self.isFavorite = function (athlete) {
        return self.favorites().some(function (fav) {
            return fav.Id === athlete.Id;
        });
    };
    self.toggleFavorite = function (athlete) {
        var favorites = self.favorites();
        var athleteIndex = favorites.findIndex(function (fav) {
            return fav.Id === athlete.Id;
        });
    
        if (athleteIndex === -1) {
            favorites.push(athlete);
        } else {
            favorites.splice(athleteIndex, 1);
        }
    
        self.favorites(favorites);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    
        // Adicionar o atleta à página de favoritos
        updateFavouritesTable();
    
        // Se quiser redirecionar para a página de favoritos após a ação
        // window.location.href = 'athletesFAV.html';
    };




    function updateFavouritesTable() {
        var favourites = JSON.parse(localStorage.getItem('favorites')) || [];
        var tableBody = $('#table-favourites');
        tableBody.empty(); // Limpar tabela
    
        favourites.forEach(function(athlete) {
            var row = `<tr>
                <td>${athlete.Id}</td>
                <td>${athlete.Name}</td>
                <td>${athlete.Sex}</td>
                <td><img src="${athlete.PhotoUrl || 'default.jpg'}" alt="${athlete.Name}" style="width: 50px; height: auto;"></td>
                <td><a href="./athleteDetails.html?id=${athlete.Id}" class="btn btn-light btn-xs"><i class="fa-solid fa-person" title="Show details"></i></a></td>
            </tr>`;
            tableBody.append(row);
        });
    }
    
    





    

    // page events
    self.activate = function (id) {
        console.log('CALL: getAthletes...');
        var composedUri = self.baseUri() + "?page=" + id + "&pageSize=" + self.pagesize();
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.athletes(data.Athletes);
            self.currentPage(data.CurrentPage);
            self.hasNext(data.HasNext);
            self.hasPrevious(data.HasPrevious);
            self.pagesize(data.PageSize)
            self.totalPages(data.TotalPages);
            self.totalRecords(data.TotalAhletes);
        });
    };

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
})