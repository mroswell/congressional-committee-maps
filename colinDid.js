var statesToFips = {
	"Alabama": "01",
	"Alaska": "02",
	"Arizona": "04",
	"Arkansas": "05",
	"California": "06",
	"Colorado": "08",
	"Connecticut": "09",
	"Delaware": "10",
	"District of Columbia": "11",
	"Florida": "12",
	"Georgia": "13",
	"Hawaii": "15",
	"Idaho": "16",
	"Illinois": "17",
	"Indiana": "18",
	"Iowa": "19",
	"Kansas": "20",
	"Kentucky": "21",
	"Louisiana": "22",
	"Maine": "23",
	"Maryland": "24",
	"Massachusetts": "25",
	"Michigan": "26",
	"Minnesota": "27",
	"Mississippi": "28",
	"Missouri": "29",
	"Montana": "30",
	"Nebraska": "31",
	"Nevada": "32",
	"New Hampshire": "33",
	"New Jersey": "34",
	"New Mexico": "35",
	"New York": "36",
	"North Carolina": "37",
	"North Dakota": "38",
	"Ohio": "39",
	"Oklahoma": "40",
	"Oregon": "41",
	"Pennsylvania": "42",
	"Puerto Rico": "72",
	"Rhode Island": "44",
	"South Carolina": "45",
	"South Dakota": "46",
	"Tennessee": "47",
	"Texas": "48",
	"Utah": "49",
	"Vermont": "50",
	"Virginia": "51",
	"Washington": "53",
	"West Virginia": "54",
	"Wisconsin": "55",
	"Wyoming": "56"
}



var committeeRequest = $.ajax({
    dataType: "json",
    url: "http://congress.api.sunlightfoundation.com/committees?per_page=all&chamber=house&committee_id=HSAG&subcommittee=false&fields=name,committee_id,office,subcommittee,phone,url,member_ids,members&apikey=9e3e71730ae34e1ebbf4dd0e1c346c07"})
  .done(function(committee){

  var parseCongressionalCommitteeResponse = function (congressionalCommittee) {
	var arrayOfStateNamesForThisCommittee = [];
	console.log(congressionalCommittee)
		_.each(congressionalCommittee.results[0].members, function(data, index){ 
			arrayOfStateNamesForThisCommittee.push(data.legislator.state_name);
		})
		return arrayOfStateNamesForThisCommittee;
	}
	var parsedCommitteeStatesArray = parseCongressionalCommitteeResponse(committee)
	window.APP.changeThisVariableCommitteeData = _.map(parsedCommitteeStatesArray, function(statename){
		var stateNumber = statesToFips[statename]
		return stateNumber; 
	})
});










