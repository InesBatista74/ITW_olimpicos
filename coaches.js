// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/api/Coaches'); // Alterado para Coaches
    self.displayName = 'Paris2024 Coaches List'; // Alterado para Coaches
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    self.coaches = ko.observableArray([]); // Alterado para Coaches
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

    self.toggleFavourite = function (id) {
        // Verifica se o array já contém um objeto com chave `team` e valor `id`
        const existingIndex = self.favourites().findIndex(item => item.coach === id);
    
        if (existingIndex === -1) {
            // Se não existe, adiciona um novo objeto com chave `team` e o ID
            self.favourites.push({ coach: id });
        } else {
            // Se já existe, remove o objeto do array
            self.favourites.splice(existingIndex, 1);
        }
    
        // Atualiza o localStorage com o array modificado
        localStorage.setItem("fav", JSON.stringify(self.favourites()));
    };
    
    self.SetFavourites = function () {
        let storage;
        try {
            // Tenta carregar os favoritos armazenados no localStorage
            storage = JSON.parse(localStorage.getItem("fav"));
        } catch (e) {
            console.error("Erro ao carregar favoritos:", e);
        }
    
        // Se o dado armazenado for um array, inicializa o observable com ele
        if (Array.isArray(storage)) {
            self.favourites(storage);
        }
    };
    
    // Inicializa o observable como um array vazio
    self.favourites = ko.observableArray([]);

    // Função de busca para treinadores
    self.search = function () {
        console.log("searching...");
        var searchQuery = document.getElementById('searchbar').value.toLowerCase();
        if (!searchQuery) {
            self.activate(1);
            return;
        }

        var searchUrl = self.baseUri() + "/Search?q=" + searchQuery;
        ajaxHelper(searchUrl, 'GET').done(function (data) {
            if (data.length === 0) {
                alert('No results found');
                return;
            }

            // Certifique-se de que cada objeto tenha as propriedades necessárias para treinadores
            var enrichedData = data.filter(function (coach) {
                return coach.Name.toLowerCase().includes(searchQuery);
            }).map(function (coach) {
                return {
                    Id: coach.Id,
                    Name: coach.Name,
                    Function: coach.Function || "",
                    Sex: coach.Sex || ""
                };
            });

            self.coaches(enrichedData); // Alterado para Coaches
            self.totalRecords(enrichedData.length);
            self.currentPage(1);
        });
    };

    self.onEnter = function (event) {
        if (event.keyCode === 13) {
            self.search();
        }
        return true;
    };

    // Autocomplete configurado para treinadores
    $.ui.autocomplete.filter = function (array, term) {
        var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(term), "i");
        return $.grep(array, function (value) {
            return matcher.test(value.label || value.value || value);
        });
    };

    $("#searchbar").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: self.baseUri() + "/Search?q=" + request.term,
                dataType: "json",
                success: function (data) {
                    var coachNames = data.map(function (coach) {
                        return coach.Name;
                    });

                    response($.grep(coachNames, function (name) {
                        return name.toLowerCase().includes(request.term.toLowerCase());
                    }));
                }
            });
        },
        minLength: 3
    });

    //--- Page Events
    self.activate = function (id) {
        console.log('CALL: getCoaches...');
        var composedUri = self.baseUri() + "?page=" + id + "&pageSize=" + self.pagesize();
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.coaches(data.Coaches); // Alterado para Coaches
            self.currentPage(data.CurrentPage);
            self.hasNext(data.HasNext);
            self.hasPrevious(data.HasPrevious);
            self.pagesize(data.PageSize);
            self.totalPages(data.TotalPages);
            self.totalRecords(data.TotalCoaches); // Alterado para Coaches
            self.SetFavourites();
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

    //--- start ....
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
});
