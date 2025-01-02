var vm = function() {

    var self = this;

    self.athletes = ko.observableArray();
    self.coaches = ko.observableArray();
    self.teams = ko.observableArray();
    self.sports = ko.observableArray();

    self.activate = (node) => {
        console.log(node.value);
        
        const fav_arr = JSON.parse(localStorage.getItem('fav')) || [];
        console.log(fav_arr);

        switch (node.value){
            case 'Athletes':
                self.athletes([]);
                for(let item of fav_arr){
                    if(item.Athletes){
                        ajaxHelper(`http://192.168.160.58/Paris2024/api/Athletes/${item.Athletes}`, 'GET').done((data) => {
                            console.log('Getting athletes by id...');
                            self.athletes.push(data);
                        });
                    }

                    sleep(50);
                }
                $('#table_coach').hide();
                $('#table_t').hide();
                $('#table_s').hide();
                $('#table_a').show();

                break;
            case 'Coaches':
                self.coaches([]);
                for(let item of fav_arr){
                    if(item.coach){
                        ajaxHelper(`http://192.168.160.58/Paris2024/api/Coaches/${item.coach}`, 'GET').done( (data) => {
                            console.log('Getting coaches by id...');
                            self.coaches.push(data);
                        });
                    }

                    sleep(50);
                }
                $('#table_a').hide();
                $('#table_t').hide();
                $('#table_s').hide();
                $('#table_coach').show();

                break;
            case 'Teams':
                self.teams([]);
                for(let item of fav_arr){
                    if(item.team){
                        ajaxHelper(`http://192.168.160.58/Paris2024/api/Teams/${item.team}`, 'GET').done( (data) => {
                            console.log('Getting teams by id...');
                            self.teams.push(data);
                        });
                    }

                    sleep(50);
                }

                $('#table_a').hide();
                $('#table_coach').hide();
                $('#table_s').hide();
                $('#table_t').show();

                break;

        }
    };

    self.remove = function(id, type) {
        console.log(id);
        let fav_arr = JSON.parse(localStorage.getItem('fav'));
    
        // Localizar e remover o item correspondente no array
        let indexToRemove = fav_arr.findIndex(item => 
            (type === 'Athletes' && item.Athletes === id) ||
            (type === 'Coaches' && item.coach === id) ||
            (type === 'Teams' && item.team === id) ||
            (type === 'Sports' && item.sport === id)
        );
    
        if (indexToRemove !== -1) {
            fav_arr.splice(indexToRemove, 1);
            localStorage.setItem('fav', JSON.stringify(fav_arr));
        }
    
        // Atualizar a aba correspondente
        self.activate({ value: type });
    }
};

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
        }
    });
}

function sleep(milliseconds) {
    const start = Date.now();
    while (Date.now() - start < milliseconds);
}

function hideLoading() {
    $('#myModal').on('shown.bs.modal', function (e) {
        $("#myModal").modal('hide');
    })
}

$(document).ready(() => {
    $('#table_a').hide();
    $('#table_coach').hide();
    $('#table_t').hide();
    $('#table_s').hide();
    console.log("ready!");
    ko.applyBindings(new vm());
});