// committee = 'SSAF'
// // $(function(){
// //     var drawMap= function (committee) {
// //         console.log(committee);
//         var committeeRequest = $.ajax({
//             dataType: "json",
//             headers: "9ynWTXljOQ3Mw4vP7HMEN6ymaHxVydbh1jINFhxv",
//             url: "https://api.propublica.org/congress/v1/115/house/committees/" + "committee"+ ".json"
//
//         }).done(function(committee){
//             // listMembers(committee);
//             console.log("logging");
//             console.log("Committee results", committee.results[0]);
//         })
//     // };
// // });


committeeID = 'HSAG';
if (committeeID.charAt(0)=="H") {
    chamber = "house"
}else if (committeeID.charAt(0)=="S") {
    chamber = "senate"
}
var drawMap= function (committeeID) {
    console.log("drawMap", committeeID);
    $.ajax({
        dataType: "json",
        headers: {'X-API-Key': "9ynWTXljOQ3Mw4vP7HMEN6ymaHxVydbh1jINFhxv"},
        url: "https://api.propublica.org/congress/v1/115/" + chamber + "/committees/" + committeeID + ".json"
        // url: "https://api.propublica.org/congress/v1/115/house/committees/SSAF.json"

    }).done(function (committee) {
        // listMembers(committee);
        console.log("logging");
        console.log("Committee results", committee.results[0]);
            listMembers(committee);
        console.log("Committee results2", committee.results[0]);
            if(!committee.results[0].subcommittee){
                currentlySelectedCommittee = _.clone(committee.results[0]);
                console.log("currently", currentlySelectedCommittee);
                delete currentlySelectedCommittee.members;
            }
            var members = committee.results[0].current_members;
            console.log("done1", members);
            var states = {};
            var districtName = {};
            for (var i = 0; i < members.length; i++) {
                var member = members[i];
                    var dist = "";
                    // addLegislatorDetail(member.)
                    var membDetail = $.ajax({
                        dataType: "json",
                        headers: {'X-API-Key': "9ynWTXljOQ3Mw4vP7HMEN6ymaHxVydbh1jINFhxv"},
                        url: member.api_uri
                        // url: "https://api.propublica.org/congress/v1/members/{member-id}.json"
                    }).done(function(memberDetail) {
                        console.log(memberDetail)
                        member["detail"] = memberDetail;
                        dist = member.detail.results[0].roles[0].district;
                        console.log(dist);
                        if (member.chamber==="house") {
                            districtName = member.state + dist
                        } else {
                            districtName = member.state
                            }
                        console.log(districtName);
                    });

                    // console.log("member.district: ", member.district, "districtName: ", districtName)


                if (!states[districtName]) {
                    states[districtName] = [ member ];
                } else {
                    states[districtName].push(member);
                }
            }
            if (member.chamber==="house") {

                stateLayer.setStyle({
                    fillColor: 'white',
                    weight: 1,
                    opacity: 0.41,
                    color: 'grey',
                    dashArray: '0',
                    fillOpacity: 0.7
                });
                congressLayer.setStyle(function(shape) {
//            var abbreviation = stateName2Abbrev[stateFips2Name[shape.properties.STATE]];
//            var district = parseInt(shape.properties.CD, 10);  //04 GeoJSON; 4 Congress API
//            var match = states[abbreviation+district];
                    var match = states[shape.properties.DISTRICT];

                    return colorDistrict(match,'house');
                });

                congressLayer.bringToFront();
            } else if (member.chamber==="senate") {
                congressLayer.setStyle({
                    display: "none",
                    opacity: 0,
                    fillColor: "transparent"
                });

                stateLayer.setStyle(function(shape) {
                    var match = states[shape.properties.STATE];

//            console.log('MATCH-SENATE', match);
                    return colorDistrict(match,'senate');
                });

                stateLayer.bringToFront();
            }
    });
}

var prev_committee = null;
var prev_committee_name = null;
var currentlySelectedCommittee;
var subcomms = false;
var sortedMemberNames;
var latitude = 39.9;
var longitude = -98.5;
var latLng = new L.LatLng(latitude, longitude);
var map = L.map('map').setView(latLng, 4);

var addLegislatorDetail = function(urlMember) {
    var membDetail = $.ajax({
        dataType: "json",
        headers: {'X-API-Key': "9ynWTXljOQ3Mw4vP7HMEN6ymaHxVydbh1jINFhxv"},
        url: urlMember
        // url: "https://api.propublica.org/congress/v1/115/house/committees/SSAF.json"
    }).done(function(memberDetail) {
        console.log(memberDetail)
    });

}


var stateLayer = L.geoJson(statesMap, {
    onEachFeature:onEachFeature,
    style: {
        fillColor: 'white',
        weight: 1,
        opacity: 0.21,
        color: '#333333',
        dashArray: '0',
        fillOpacity: 0.7
    }
});

stateLayer.addTo(map);

var congressLayer = L.geoJson(congressionalDistricts,
    {
        onEachFeature:onEachFeature,
        style: {
            fillColor: 'white',
            weight: 1,
            opacity: 0.41,
            color: '#D7D7D7',
            dashArray: '0',
            fillOpacity: 0
        }
    });
congressLayer.addTo(map);


L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mroswell.i6hfjp09'
}).addTo(map);


function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: mapMemberDetail
    });
}

function highlightFeature(e) {
    // TODO: limit highlight to last-selected layer (House, senate, joint)
    // TODO: limit popup hover to committee members

    var boundary = e.target;
    var color = checkColor(e.target);
    var members = membersFromBoundary(boundary);

    info.update(members);

    // console.log(e)

    if (color === "blue" || color === "red" || color === "#84207C" || color === "#00B0A7") {
        boundary.setStyle({
            weight: 2,
            color: '#666'
        });
    }
    if (!L.Browser.ie && !L.Browser.opera) {
//      boundary.bringToFront();
    }
}

function resetHighlight(e) {
    info.update();
    var layer = e.target;
    var color = checkColor(e.target);

    // TODO: reset back to proper committee member party color
    //console.log('RESET Function');
    if (color === "blue" || color === "red" || color === "#84207C" || color ==="#00B0A7") {

        layer.setStyle({
            weight: 1,
            color: '#ffffff'
        });
    }
//  stateLayer.resetStyle(e.target);
}

function mapMemberDetail(e) {
    var boundary = e.target;

    var members = membersFromBoundary(boundary);
    memberDetailFunction(members);
}

function memberDetailFunction(mDetail){

    var memberContext = {
        members: mDetail instanceof Array ? mDetail : [mDetail]
    };

    // console.log("memberContext: ", memberContext);
    var htmlDetail = app.memberDetail(memberContext);
//  var htmlDetail = templateDetail(memberContext);
    if (memberContext.members.length>0) {
        // console.log("length > 1", memberContext.members.length);
        $('#member-detail').html(htmlDetail);
    } else {
        $('#member-detail').html('<p>Click a committee member<br />for detail. <br />Click the <i class="fa fa-link"></i> icon to visit the committee website. (It will open in a new window.) </p>');
    }
}

function checkColor(layer) {
    if (layer.options) {
        return layer.options.fillColor;
    } else if (layer._layers) {
        for (var polyID in layer._layers) {
            return layer._layers[polyID].options.fillColor;
        }
    }
}

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (members) {
    var memberContext = {
        members: members
    };

    // console.log("memberContext: ", memberContext);
    var htmlDetail = app.templateDetail(memberContext);

    // console.log("members", members);
    this._div.innerHTML = htmlDetail;
};


var app = {};

function init() {
    var source = $("#committee-member-template")
        .html();
    app.memberTemplate = Handlebars.compile(source);

    var sourceHover = $("#map-hover-template")
        .html();
    app.templateDetail = Handlebars.compile(sourceHover);

    var source2 = $("#committee-member-detail-template")
        .html();
    app.memberDetail = Handlebars.compile(source2);
    info.addTo(map);

    var committee = getQueryVariable("committee");
    var subcommittee = getQueryVariable("subcommittee");

    if (committee) {
        $('[data-committee="'+committee+'"]').click();
    }
    if (subcommittee) {
        $('#subcomms').click();
        setTimeout(function(){
            $('#subcommitteeList>option[value="' + subcommittee + '"]').prop('selected', true);
        },100)
    }
}

function membersFromBoundary(boundary) {
    var color = checkColor(boundary)
    var members = [];
    if (color === "blue" || color === "red" || color === "#84207C" || color == "#00B0A7") {
        for (var member in sortedMemberNames) {
            if (boundary.feature.properties.name) {
                var abbreviation = stateName2Abbrev[boundary.feature.properties.name];
                if (abbreviation === sortedMemberNames[member].stateAbbreviation) {
                    members.push(sortedMemberNames[member]);
                }
//      } else if (boundary.feature.properties.CD) {
            } else if (boundary.feature.properties.DISTRICT) {
                if (boundary.feature.properties.DISTRICT ===sortedMemberNames[member].stateAbbreviation+sortedMemberNames[member].district) {
                    //  console.log("member", member);
                    members.push(sortedMemberNames[member]);
                }
            }
        }
    }
    return members;
}

$("[data-committee]").on("click", function (e) {
    e.preventDefault();
    //console.log($(this));
    $("[data-committee]").removeClass('active');
    $(this).addClass('active');
    var committee = $(this).data("committee");
    queryString.push('committee', committee);
    queryString.push('subcommittee', null);
    var name = $(this).html();
    prev_committee = committee;
    prev_committee_name = name;
    getSubcommittees(committee);

    $(this).parent().parent()
        .css('left', '-99999px')
        .removeClass("open");
    drawMap(committee);
});

function colorDistrict(committee, chamber) {
    if (!committee) {
        if (chamber === "house") {
            return {
                display: "none",
                opacity: 0,
                fillColor: "transparent"
            }
        } else {
            return {
                fillColor: '#ffffff',
                weight: 1,
                opacity: 0.41,
                color: 'grey',
                dashArray: '0',
                fillOpacity: 0.7
            };
        }
    }
        console.log(member.results[0].roles[0].party);
        return member.results[0].roles[0].party;

var parties = _.map(committee, function(member){

    return member.results[0].roles[0].party;
});
    var hasDem = parties.indexOf("D") > -1;
    var hasRep = parties.indexOf("R") > -1;
    var hasInd = parties.indexOf("I") > -1;

    var color;
    if ((hasDem && hasRep) || (hasDem && hasInd)|| (hasRep && hasInd)) {
        color = "#84207C";//"#86307A";//"purple";
    } else if (hasDem) {
        color = "blue";//"#0920d3";//"#1464C8";//"#2553A8";//"#0F2CB9";//"#0B22E3";//"#1B55B9";//"#1644C7";//"#2166AC";//"#4393C3";//"#2424FF"; //80% blue
    } else if (hasInd) {
        color = "#00B0A7";
    } else {
        color = "red";//"#d30c09";//"#c81714";//"#F1100D";//"#DD2820";//"#D73027";//"#B2182B";//"red";
    }

    return {
        fillColor: color,
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '0',
        fillOpacity: 0.7
    };
}

function listMembers(committee) {

    var arrayOfCommitteeChairs = [];
    var arrayOfCommitteeMembers = [];

    _.each(committee.results[0].members, function (member) {
        var memberObject = member.legislator;
        memberObject.title = member.title;

        if (memberObject.office != null) {
            memberObject.office = memberObject.office.replace("Building", "Bldg.");
        }
        memberObject.stateAbbreviation = memberObject.state;

        if (memberObject.title) {
            arrayOfCommitteeChairs.push(memberObject);
        } else {
            arrayOfCommitteeMembers.push(memberObject);
        }

    });
    var sortedArrayOfMemberChairs = _(arrayOfCommitteeChairs).sortBy("title");
    var sortedArrayOfMemberNames = _(arrayOfCommitteeMembers).sortBy("last_name");

    sortedMemberNames = sortedArrayOfMemberChairs.concat(sortedArrayOfMemberNames);

    var result = committee.results[0];
    if(typeof result.url == 'undefined'){
        result.url = currentlySelectedCommittee.url;
//    result.subcomm = true;
        result.parentcomm = currentlySelectedCommittee.name;
        console.log("currentlySelectedCommittee", currentlySelectedCommittee);
    }
    var context = {
//    is_subcomm: result.subcomm,
        parentcomm: result.parentcomm,
        committee_abbrev: result.id,
        committee_name: result.name,
        committee_results: result,
        committee_members: result.current_members,
        sorted_members: sortedMemberNames,
        // first_name: result.current_members.legislator.first_name,
        title: result.current_members[0].title
    };


    var html = app.memberTemplate(context);
    $('#committee-list')
        .html(html);

    var memberDetail;

    $("[data-member-id]").on("click", function(e) {
        var ID = $(this).data("member-id");
        memberDetail = _.findWhere(sortedMemberNames, {bioguide_id: ID});
        memberDetailFunction(memberDetail);
    });

}

//function setQueryVariable (variable, value) {
//  window.location = '?' + variable + "=" + value;
//}

/*!
 query-string
 Parse and stringify URL query strings
 https://github.com/sindresorhus/query-string
 by Sindre Sorhus
 MIT License
 */
(function () {
    'use strict';
    var queryString = {};

    queryString.parse = function (str) {
        if (typeof str !== 'string') {
            return {};
        }

        str = str.trim().replace(/^\?/, '');

        if (!str) {
            return {};
        }

        return str.trim().split('&').reduce(function (ret, param) {
            var parts = param.replace(/\+/g, ' ').split('=');
            var key = parts[0];
            var val = parts[1];

            key = decodeURIComponent(key);
            // missing `=` should be `null`:
            // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
            val = val === undefined ? null : decodeURIComponent(val);

            if (!ret.hasOwnProperty(key)) {
                ret[key] = val;
            } else if (Array.isArray(ret[key])) {
                ret[key].push(val);
            } else {
                ret[key] = [ret[key], val];
            }

            return ret;
        }, {});
    };

    queryString.stringify = function (obj) {
        return obj ? Object.keys(obj).map(function (key) {
                var val = obj[key];

                if (Array.isArray(val)) {
                    return val.map(function (val2) {
                        return encodeURIComponent(key) + '=' + encodeURIComponent(val2);
                    }).join('&');
                }

                return encodeURIComponent(key) + '=' + encodeURIComponent(val);
            }).join('&') : '';
    };

    queryString.push = function (key, new_value) {
        var params = queryString.parse(location.search);
        if(new_value == null){
            delete params[key];
        } else {
            params[key] = new_value;
        }
        var new_params_string = queryString.stringify(params);
        history.pushState({}, "", window.location.pathname + '?' + new_params_string);
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = queryString;
    } else {
        window.queryString = queryString;
    }
})();

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}

var getSubcommittees = function(committee){
    var $select = $("#subcommitteeList");
    var $subMessage = $('#subcomm-message');
    $subMessage.hide();
    $select.hide().empty();
    if (subcomms) {
        var subcommitteeRequest = $.ajax({
            dataType: "json",
            url: "https://congress.api.sunlightfoundation.com/committees",
            data: {
                per_page: "all",
                parent_committee_id: committee,
                subcommittee: true,
                apikey: "9e3e71730ae34e1ebbf4dd0e1c346c07"
            }
        }).done(function (subcommittee) {
            if (subcommittee.count > 0) {
                $select.show();
                var select = document.getElementById('subcommitteeList');
                select.options.add(new Option("Please select a subcommittee...", ""));
                var sortedSubcommitteeNames = _(subcommittee.results).sortBy("name");
                for (var i = 0; i < sortedSubcommitteeNames.length; i++) {
                    var subname = sortedSubcommitteeNames[i].name;
                    var subabbrev = sortedSubcommitteeNames[i].committee_id;
                    select.options.add(new Option(subname, subabbrev));
                }
            } else {
                var $subcommSpan = $('#subcomm-span');
                $subcommSpan.html(prev_committee_name);
                $subMessage.show();

            }
        });
    } else {
        $select.hide();
    }
}

init();