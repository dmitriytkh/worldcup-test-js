function toggleMenu() {
    document.getElementById('dropdown-menu').classList.toggle('open');
}

function showGroups() {
    const main = document.getElementById('groups-list');
    main.innerHTML = '';
    document.getElementById('group-container').innerHTML = '';
    document.getElementById('country-info').innerHTML = '';

    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://worldcup.sfg.io/teams/');
    xhr.responseType = 'json';
    xhr.send(null);
    xhr.onload = function () {
        if (xhr.status === 200) {
            let teams = xhr.response;
            let groups = teams.map(function (item) {
                return item.group_letter;
            });
            let filteredGroups = groups.filter(function (item, pos) {
                return groups.indexOf(item) == pos;
            });
            let list = document.createElement('ul');
            filteredGroups.sort().forEach(function (item) {
                let listElementLi = document.createElement('li');
                let inputElement = document.createElement('input');
                let name = document.createElement('span');
                name.innerHTML = item;
                inputElement.type = 'checkbox';
                inputElement.value = item;

                inputElement.addEventListener('change', showGroup);

                listElementLi.appendChild(inputElement);
                listElementLi.appendChild(name);
                list.appendChild(listElementLi);
                main.appendChild(list);
            });
        }
    }
}

function showGroup() {
    const group = this.value;
    const main = document.getElementById('group-container');
    if (this.checked) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://worldcup.sfg.io/teams/');
        xhr.responseType = 'json';
        xhr.send(null);
        xhr.onload = function () {
            if (xhr.status === 200) {
                let teams = xhr.response;
                let filteredTeams = teams.filter(function (item) {
                    return item.group_letter == group;
                });
                let table = document.createElement('table');
                table.id = group;
                let fieldList = ['fifa_code','group_id','fifa_code','id'];
                filteredTeams.forEach(function (item) {
                    let tableElementTr = document.createElement('tr');
                    let tableElementTd = document.createElement('td');
                    let tableElementLink = document.createElement('a');
                    tableElementLink.addEventListener('click', function () {
                        showDetailInfo(item.fifa_code);
                    });
                    tableElementLink.innerHTML = item.country;
                    tableElementTd.appendChild(tableElementLink);
                    tableElementTr.appendChild(tableElementTd);
                    fieldList.forEach(function(field) {
                        let tableElementTd = document.createElement('td');
                        tableElementTd.innerHTML = item[field];
                        tableElementTr.appendChild(tableElementTd);
                    });
                    table.appendChild(tableElementTr);
                });
                main.appendChild(table);
            }
        }
    } else {
        main.removeChild(document.getElementById(group));
    }
}

function showDetailInfo(fifaCode) {
    const main = document.getElementById('country-info');
    main.innerHTML = '';
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `http://worldcup.sfg.io/matches/country?fifa_code=${fifaCode}`);
    xhr.responseType = 'json';
    xhr.send(null);
    xhr.onload = function () {
        if (xhr.status === 200) {
            let teamDetails = xhr.response;
            let table = document.createElement('table');
            table.id = fifaCode;
            let tableElementTr = document.createElement('tr');
            let fieldList = ['venue','away_team_country','goals_away_team','home_team_country','goals_home_team','location','datetime'];
            fieldList.forEach(function (item) {
                let tableElementTd = document.createElement('td');
                tableElementTd.innerHTML = item;
                tableElementTr.appendChild(tableElementTd);
            });
            table.appendChild(tableElementTr);
            teamDetails.forEach(function (item) {
                let tableElementTr = document.createElement('tr');
                fieldList.forEach(function (field) {
                    let tableElementTd = document.createElement('td');
                    if (field === 'goals_away_team') {
                        tableElementTd.innerHTML = item.away_team.goals;
                    } else if (field === 'goals_home_team') {
                        tableElementTd.innerHTML = item.home_team.goals;
                    } else {
                        tableElementTd.innerHTML = item[field];
                    }
                    tableElementTr.appendChild(tableElementTd);
                });
                table.appendChild(tableElementTr);
            });
            main.appendChild(table);
        }
    }
}