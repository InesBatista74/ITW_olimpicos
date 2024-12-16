var vm = function () {
    console.log('ViewModel has been initiated.');
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/API/Competitions');
    self.displayName = 'Paris2024 Competitions List';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    self.competitions = ko.observableArray([]);
    self.sports = ko.observableArray([]); // Lista de desportos
    self.currentPage = ko.observable(1);
    self.pagesize = ko.observable(330);
    self.totalRecords = ko.observable(329);
    self.hasPrevious = ko.observable(false);
    self.hasNext = ko.observable(false);
    self.sportCode = ko.observable(''); // Armazena o código do desporto selecionado
    self.searchQuery = ko.observable(""); // Observable for the search input

    // Search functionality
    self.triggerSearch = function () {
        // Show loading modal when search starts (before AJAX request)
        showLoading();

        var query = self.searchQuery().toLowerCase(); // Convert to lowercase for case-insensitive matching
        if (!query) {
            self.filteredCoaches(self.coaches()); // Reset to all coaches if no search query
            hideLoading(); // Hide loading modal immediately if no query
        } else {
            // Simulate asynchronous search filtering with a timeout to ensure the modal is shown before filtering starts
            setTimeout(function () {
                var filtered = ko.utils.arrayFilter(self.coaches(), function (coach) {
                    return coach.Name.toLowerCase().includes(query); // Filter by coach name
                });
                self.filteredCoaches(filtered);
                hideLoading(); // Hide loading modal once search is complete
            }, 100); // small delay to ensure modal shows up
        }
    };


    // Pagination helpers
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

    // Page events
    self.activate = function (id) {
        console.log('CALL: getCoaches...');
        var composedUri = self.baseUri() + "?page=" + id + "&pageSize=" + self.pagesize();
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.competitions(data.Competitions);
            self.currentPage(data.CurrentPage);
            self.hasNext(data.HasNext);
            self.hasPrevious(data.HasPrevious);
            self.totalRecords(data.TotalCompetitions);
        });
    };

    // Internal functions
    function ajaxHelper(uri, method, data) {
        self.error('');
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
        });
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

    // Start
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