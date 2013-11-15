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


// create variable called committeeRequest that asks Congress API for the members of the
// House Agriculture Committee
var committeeRequest = $.ajax({
    dataType: "json",
    url: "http://congress.api.sunlightfoundation.com/committees?per_page=all&chamber=house&committee_id=HSAG&subcommittee=false&fields=name,committee_id,office,subcommittee,phone,url,members&apikey=9e3e71730ae34e1ebbf4dd0e1c346c07"})
    //when this request is done, run an anonymous function that takes the committee...
  .done(function(committee){
  var parseCongressionalCommitteeResponse = function (congressionalCommittee) {
      // create array that will be populated with state names
	var arrayOfStateNamesForThisCommittee = [];
      // log the congressionalCommittee
	console.log(congressionalCommittee);
		_.each(congressionalCommittee.results[0].members, function(data, index){ 
			arrayOfStateNamesForThisCommittee.push(data.legislator.state_name);
		})
		return arrayOfStateNamesForThisCommittee;
	}
    // determine FIPS Code from state name from the results array of parseCongressionalCommitteeResponse
	var parsedCommitteeStatesArray = parseCongressionalCommitteeResponse(committee);
	window.APP.changeThisVariableCommitteeData = _.map(parsedCommitteeStatesArray, function(statename){
		var stateNumber = statesToFips[statename];
		return stateNumber;
	})
});



// +++++++++++
// create variable called committeeRequest that asks Congress API for the members of the
// House Agriculture Committee
var committeeRequest = $.ajax({
    dataType: "json",
    url: "http://congress.api.sunlightfoundation.com/committees?per_page=all&chamber=house&committee_id=HSAG&subcommittee=false&fields=name,committee_id,office,subcommittee,phone,url,members&apikey=9e3e71730ae34e1ebbf4dd0e1c346c07"})





// +++++++++++
// create variable called committeeRequest that asks Congress API for the members of the
// House Agriculture Committee, and log "done."
var committeeRequest = $.ajax({
    dataType: "json",
    url: "http://congress.api.sunlightfoundation.com/committees?per_page=all&chamber=house&committee_id=HSAG&subcommittee=false&fields=name,committee_id,office,subcommittee,phone,url,members&apikey=9e3e71730ae34e1ebbf4dd0e1c346c07"}).done(function(committee){ console.log("done")});


        var parseCongressionalCommitteeResponse = function (congressionalCommittee) {
            // create array that will be populated with state names
            var arrayOfStateNamesForThisCommittee = [];

            _.each(congressionalCommittee.results[0].members, function(data, index){
                arrayOfStateNamesForThisCommittee.push(data.legislator.state_name);
            })
            return arrayOfStateNamesForThisCommittee;
        };
        console.log(arrayOfStateNamesForThisCommittee);
        // determine FIPS Code from state name from the results array of parseCongressionalCommitteeResponse
        var parsedCommitteeStatesArray = parseCongressionalCommitteeResponse(committee);
    });








// create variable called committeeRequest that asks Congress API for the members of the
// House Agriculture Committee
var committeeRequest = $.ajax({
    dataType: "json",
    url: "http://congress.api.sunlightfoundation.com/committees?per_page=all&chamber=house&committee_id=HSAG&subcommittee=false&fields=name,committee_id,office,subcommittee,phone,url,members&apikey=9e3e71730ae34e1ebbf4dd0e1c346c07"})
    //when this request is done, run an anonymous function that takes the committee...
    .done(function(committee){
        var parseCongressionalCommitteeResponse = function (congressionalCommittee) {
            // create array that will be populated with state names
            var arrayOfStateNamesForThisCommittee = [];
            // print congressionalCommittee
            console.log(congressionalCommittee); //why are these the same?
            console.log(committee);              //why are these the same?
            _.each(congressionalCommittee.results[0].members, function(data, index){
                arrayOfStateNamesForThisCommittee.push(data.legislator.state_name);
            })
            return arrayOfStateNamesForThisCommittee;
        }
        console.log(arrayOfStateNamesForThisCommittee)
        // determine FIPS Code from state name from the results array of parseCongressionalCommitteeResponse
        var parsedCommitteeStatesArray = parseCongressionalCommitteeResponse(committee);
    });








