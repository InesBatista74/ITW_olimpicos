var vm = function () {
    var self = this;

    self.baseUri = ko.observable('http://192.168.160.58/Paris2024/api/Canoe_Sprints/Events');
    self.resultUri = ko.observable('http://192.168.160.58/Paris2024/api/Canoe_Sprints');
    self.events = ko.observableArray([]);
    self.stages = ko.observableArray([]);
    self.results = ko.observableArray([]);
    self.selectedEventId = ko.observable('');
    self.selectedStageId = ko.observable('');

    self.activate = function () {
        ajaxHelper(self.baseUri(), 'GET').done(function (data) {
            self.events(data);
            if (data.length > 0) {
                self.selectedEventId(data[0].EventId);
            }
        });
    };

    self.selectedEventId.subscribe(function (newEventId) {
        const selectedEvent = self.events().find(event => event.EventId === newEventId);
        if (selectedEvent) {
            self.stages(selectedEvent.Stages);
            self.selectedStageId(selectedEvent.Stages[0]?.StageId || '');
        } else {
            self.stages([]);
            self.results([]);
        }
    });

    self.selectedStageId.subscribe(function (newStageId) {
        if (newStageId) {
            const eventId = self.selectedEventId();
            const uri = `${self.resultUri()}?EventId=${eventId}&StageId=${newStageId}`;
            ajaxHelper(uri, 'GET').done(function (data) {
                self.results(data);
            });
        } else {
            self.results([]);
        }
    });

    function ajaxHelper(uri, method, data) {
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

    self.activate();
};

$(document).ready(function () {
    ko.applyBindings(new vm());
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})