require(
	[
		'dojox/mobile/parser', 
		'dojox/mobile/deviceTheme', 
		'dojox/mobile', 
		'dojox/mobile/Heading',	
		'dojox/mobile/View',
		'dojox/mobile/ScrollableView',
		'dojox/mobile/ScrollablePane',
		'dojox/mobile/ToolBarButton',
		'dojox/mobile/ContentPane',
		'dojox/mobile/Container',
		'dojox/mobile/TabBar', 
		'dojox/mobile/compat',
		'dojox/mobile/deviceTheme',
		'dojox/mobile/RoundRectList',
		'dojox/mobile/ListItem',
		'dijit/registry',
		'dojo/dom',
		'dojo/ready',
		'dojo/dom-construct',
		'dojo/_base/window'
	],
	function (
		parser,
		deviceTheme,
		mobile,
		Heading,
		View,
		ScrollableView,
		ScrollablePane,
		ToolBarButton,
		ContentPane,
		Container,
		TabBar,
		compat,
		deviceTheme,
		RoundRectList,
		ListItem,
		registry,
		dom,
		ready,
		domConstruct,
		win
	) {
	
		ready(_init);
		
		function _init() {
			parser.parse();
			
			var Team = function(number) {
				this.number = number;
				this.QS = 0;
				this.HP = 0;
				this.BP = 0;
				this.TP = 0;
				this.CP = 0;
				this.wins = 0;
				this.losses = 0;
				this.ties = 0;
				this.played = 0;
				this.matchRecords = [];
			};
			var teams = [];
			var matchesPerTeam = 5;
			
			/**
			 * Return the Team with the specified number from the list.
			 * If the team isn't found, it is added to the list.
			 */
			function getTeam(number) {
				for (var i = 0; i < teams.length; i++) {
					if (teams[i].number === number) {
						return teams[i];
					}
				}
				var newTeam = new Team(number);
				teams.push(newTeam);
				return newTeam;
			}
			
			function refreshRankings() {
				$.ajax( {
					url: "getMatchResults.php",
					type: "GET",
					dataType: 'json',
					success: function( matchResults ) {
						// First get all the team data
						teams = [];
						for (var i = 0; i < matchResults.length; i++) {
						
							// Add match results to match result view
							var match = matchResults[(matchResults.length - 1) - i];	// Most recent first
							var matchResultWidget = registry.byId("matchResultsList");
							var matchWidget = new dojox.mobile.ListItem({
								icon: "",
								moveTo: "",
								label: match.type + '' + match.matchNumber,
								rightText: 
									"<span class='matchResultSpan'>"+
									"<table class='alliances'><tr class='redAlliance'><td>" + match.red[0] + "</td><td>" + match.red[1] + "</td><td>" + match.red[2] + "</td></tr>" +
									"<tr class='blueAlliance'><td>" + match.blue[0] + "</td><td> " + match.blue[1] + "</td><td> " + match.blue[2] + "</td></tr></table>" +
									"<span class='matchScore'><span class='redScore'>" + match.redFinal + "</span> - <span class='blueScore'>" + match.blueFinal + "</span></span>" +
									"<span class='matchCP'>CP: " + match.CP + "</span>" +
									"</span>"
							});
							matchResultWidget.addChild(matchWidget);
							
							// Do stuff for sorting rankings
							if (matchResults[i].type === 'Q') {
								var j;
								var team;
								var redQS, blueQS;
								if (matchResults[i].redFinal > matchResults[i].blueFinal) {
									redQS = 2;
									blueQS = 0;
								} else if (matchResults[i].redFinal < matchResults[i].blueFinal) {
									redQS = 0;
									blueQS = 2;
								} else {
									redQS = 1;
									blueQS = 1;
								}
								
								var redTeams = matchResults[i].red;
								for (j = 0; j < redTeams.length; j++) {
									team = getTeam(redTeams[j]);
									team.matchRecords.push(matchResults[i]);
									team.QS += redQS + matchResults[i].CP;
									team.HP += matchResults[i].redHybrid;
									team.BP += matchResults[i].redBridge;
									team.TP += matchResults[i].redTeleop;
									team.CP += matchResults[i].CP;
									if (matchResults[i].redFinal > matchResults[i].blueFinal) {
										team.wins += 1;
									} else if (matchResults[i].redFinal < matchResults[i].blueFinal) {
										team.losses += 1;
									} else {
										team.ties += 1;
									}
									team.played++;
								}
								
								var blueTeams = matchResults[i].blue;
								for (j = 0; j < blueTeams.length; j++) {
									team = getTeam(blueTeams[j]);
									team.matchRecords.push(matchResults[i]);
									team.QS += blueQS + matchResults[i].CP;
									team.HP += matchResults[i].blueHybrid;
									team.BP += matchResults[i].blueBridge;
									team.TP += matchResults[i].blueTeleop;
									team.CP += matchResults[i].CP;
									if (matchResults[i].redFinal < matchResults[i].blueFinal) {
										team.wins += 1;
									} else if (matchResults[i].redFinal > matchResults[i].blueFinal) {
										team.losses += 1;
									} else {
										team.ties += 1;
									}
									team.played++;
								}
							} else if(matchResults[i].type === 'E') {
								var redTeams = matchResults[i].red;
								for (j = 0; j < redTeams.length; j++) {
									team = getTeam(redTeams[j]);
									team.matchRecords.push(matchResults[i]);
								}
								
								var blueTeams = matchResults[i].blue;
								for (j = 0; j < blueTeams.length; j++) {
									team = getTeam(blueTeams[j]);
									team.matchRecords.push(matchResults[i]);
								}
							}
						}
						
						// Remove surrogate matches
						for (var i = 0; i < teams.length; i++) {
							if (teams[i].played > matchesPerTeam) {
								var surrogateMatch = teams[i].matchRecords[2];
								teams[i].CP -= surrogateMatch.CP;
								
								if (surrogateMatch.redFinal > surrogateMatch.blueFinal) {
									redQS = 2;
									blueQS = 0;
								} else if (surrogateMatch.redFinal < surrogateMatch.blueFinal) {
									redQS = 0;
									blueQS = 2;
								} else {
									redQS = 1;
									blueQS = 1;
								}
								
								if (surrogateMatch.red.indexOf(teams[i].number) !== -1) {
									// the team was red
									teams[i].QS -= (redQS + surrogateMatch.CP);
									teams[i].HP -= surrogateMatch.redHybrid;
									teams[i].TP -= surrogateMatch.redTeleop;
									teams[i].BP -= surrogateMatch.redBridge;
								} else {
									teams[i].QS -= (blueQS + surrogateMatch.CP);
									teams[i].HP -= surrogateMatch.blueHybrid;
									teams[i].TP -= surrogateMatch.blueTeleop;
									teams[i].BP -= surrogateMatch.blueBridge;
								}
							}
						}
						
						// Then sort
						teams.sort(function(a, b) {
							if (a.QS === b.QS && a.HP === b.HP && a.BP === b.BP) {
								return a.TP - b.TP;
							} else if (a.QS === b.QS && a.HP === b.HP) {
								return a.BP - b.BP;
							} else if (a.QS === b.QS) { 
								return a.HP - b.HP;
							} else {
								return a.QS - b.QS;
							}
							return 0;
						});

						//Then display the rankings
						for (var i = teams.length - 1; i >= 0; i--) {
							var listWidget = registry.byId("rankingsList");
							var itemWidget = new dojox.mobile.ListItem({
								icon: "",
								rightIcon: "mblDomButtonBlueCircleArrow",
								transition: "slide",
								moveTo: "matches" + teams[i].number,
								label: teams[i].number,
								rightText: 
									"<span class='rankSpan'>" +
									"<span class='rankRecord' >Rank: " + (teams.length - i) + " (" + teams[i].wins + "-" + teams[i].losses + "-" + teams[i].ties + ")</span>" +
									"<span class='rankingPoints'>" + teams[i].QS + " QS, " + teams[i].HP + " HP, " + teams[i].BP + " BP, " + teams[i].TP + " TP </span>" +
									"</span>"
							});
							listWidget.addChild(itemWidget);
							
							
							
							var list1 = registry.byId('matches' + teams[i].number + 'List');
							var list2 = registry.byId('homematches' + teams[i].number + 'List');
							
							list1.destroyDescendants();
							list2.destroyDescendants();
			
							for(var j = 0; j < teams[i].matchRecords.length; j++){
								var match = teams[i].matchRecords[j];
								var item1 = new dojox.mobile.ListItem({
									label: match.type + '' + match.matchNumber,
									rightText: "<span class='matchResultSpan'>"+
									"<table class='alliances'><tr class='redAlliance'><td>" + match.red[0] + "</td><td>" + match.red[1] + "</td><td>" + match.red[2] + "</td></tr>" +
									"<tr class='blueAlliance'><td>" + match.blue[0] + "</td><td> " + match.blue[1] + "</td><td> " + match.blue[2] + "</td></tr></table>" +
									"<span class='matchScore'><span class='redScore'>" + match.redFinal + "</span> - <span class='blueScore'>" + match.blueFinal + "</span></span>" +
									"<span class='matchCP'>CP: " + match.CP + "</span>" +
									"</span>"
								});
								var item2 = new dojox.mobile.ListItem({
									label: match.type + '' + match.matchNumber,
									rightText: "<span class='matchResultSpan'>"+
									"<table class='alliances'><tr class='redAlliance'><td>" + match.red[0] + "</td><td>" + match.red[1] + "</td><td>" + match.red[2] + "</td></tr>" +
									"<tr class='blueAlliance'><td>" + match.blue[0] + "</td><td> " + match.blue[1] + "</td><td> " + match.blue[2] + "</td></tr></table>" +
									"<span class='matchScore'><span class='redScore'>" + match.redFinal + "</span> - <span class='blueScore'>" + match.blueFinal + "</span></span>" +
									"<span class='matchCP'>CP: " + match.CP + "</span>" +
									"</span>"
								});
								list1.addChild(item1);
								list2.addChild(item2);
							}
						}
					}	
				});
			}
			
			function refreshMatchResults() {
				$.ajax( {
					url: "getMatchResults.php",
					type: "GET",
					dataType: 'json',
					success: function( matchResults ) {
						// First get all the team data
						for (var i = 0; i < matchResults.length; i++) {
						
							// Add match results to match result view
							var match = matchResults[(matchResults.length - 1) - i];	// Most recent first
							var matchResultWidget = registry.byId("matchResultsList");
							var matchWidget = new dojox.mobile.ListItem({
								icon: "",
								moveTo: "",
								label: match.type + '' + match.matchNumber,
								rightText: 
									"<span class='matchResultSpan'>"+
									"<table class='alliances'><tr class='redAlliance'><td>" + match.red[0] + "</td><td>" + match.red[1] + "</td><td>" + match.red[2] + "</td></tr>" +
									"<tr class='blueAlliance'><td>" + match.blue[0] + "</td><td> " + match.blue[1] + "</td><td> " + match.blue[2] + "</td></tr></table>" +
									"<span class='matchScore'><span class='redScore'>" + match.redFinal + "</span> - <span class='blueScore'>" + match.blueFinal + "</span></span>" +
									"<span class='matchCP'>CP: " + match.CP + "</span>" +
									"</span>"
							});
							matchResultWidget.addChild(matchWidget);	
						}
					}	
				});
			}
			
			$("document").ready( function() {						  					
				$.ajax( {
					url: "getMatchResults.php",
					type: "GET",
					dataType: 'json',
					success: function( matchResults ) {
						// First get all the team data
						for (var i = 0; i < matchResults.length; i++) {
						
							// Add match results to match result view
							var match = matchResults[(matchResults.length - 1) - i];	// Most recent first
							var matchResultWidget = registry.byId("matchResultsList");
							var matchWidget = new dojox.mobile.ListItem({
								icon: "",
								moveTo: "",
								label: match.type + '' + match.matchNumber,
								rightText: 
									"<span class='matchResultSpan'>"+
									"<table class='alliances'><tr class='redAlliance'><td>" + match.red[0] + "</td><td>" + match.red[1] + "</td><td>" + match.red[2] + "</td></tr>" +
									"<tr class='blueAlliance'><td>" + match.blue[0] + "</td><td> " + match.blue[1] + "</td><td> " + match.blue[2] + "</td></tr></table>" +
									"<span class='matchScore'><span class='redScore'>" + match.redFinal + "</span> - <span class='blueScore'>" + match.blueFinal + "</span></span>" +
									"<span class='matchCP'>CP: " + match.CP + "</span>" +
									"</span>"
							});
							matchResultWidget.addChild(matchWidget);
						
							// Do stuff for sorting rankings
							if (matchResults[i].type === 'Q') {
								var j;
								var team;
								var redQS, blueQS;
								if (matchResults[i].redFinal > matchResults[i].blueFinal) {
									redQS = 2;
									blueQS = 0;
								} else if (matchResults[i].redFinal < matchResults[i].blueFinal) {
									redQS = 0;
									blueQS = 2;
								} else {
									redQS = 1;
									blueQS = 1;
								}
								
								var redTeams = matchResults[i].red;
								for (j = 0; j < redTeams.length; j++) {
									team = getTeam(redTeams[j]);
									team.matchRecords.push(matchResults[i]);
									team.QS += redQS + matchResults[i].CP;
									team.HP += matchResults[i].redHybrid;
									team.BP += matchResults[i].redBridge;
									team.TP += matchResults[i].redTeleop;
									team.CP += matchResults[i].CP;
									if (matchResults[i].redFinal > matchResults[i].blueFinal) {
										team.wins += 1;
									} else if (matchResults[i].redFinal < matchResults[i].blueFinal) {
										team.losses += 1;
									} else {
										team.ties += 1;
									}
									team.played++;
								}
								
								var blueTeams = matchResults[i].blue;
								for (j = 0; j < blueTeams.length; j++) {
									team = getTeam(blueTeams[j]);
									team.matchRecords.push(matchResults[i]);
									team.QS += blueQS + matchResults[i].CP;
									team.HP += matchResults[i].blueHybrid;
									team.BP += matchResults[i].blueBridge;
									team.TP += matchResults[i].blueTeleop;
									team.CP += matchResults[i].CP;
									if (matchResults[i].redFinal < matchResults[i].blueFinal) {
										team.wins += 1;
									} else if (matchResults[i].redFinal > matchResults[i].blueFinal) {
										team.losses += 1;
									} else {
										team.ties += 1;
									}
									team.played++;
								}
							} else if(matchResults[i].type === 'E') {
								var redTeams = matchResults[i].red;
								for (j = 0; j < redTeams.length; j++) {
									team = getTeam(redTeams[j]);
									team.matchRecords.push(matchResults[i]);
								}
								
								var blueTeams = matchResults[i].blue;
								for (j = 0; j < blueTeams.length; j++) {
									team = getTeam(blueTeams[j]);
									team.matchRecords.push(matchResults[i]);
								}
							}
						}
						
						// Remove surrogate matches
						for (var i = 0; i < teams.length; i++) {
							if (teams[i].played > matchesPerTeam) {
								var surrogateMatch = teams[i].matchRecords[2];
								teams[i].CP -= surrogateMatch.CP;
								
								if (surrogateMatch.redFinal > surrogateMatch.blueFinal) {
									redQS = 2;
									blueQS = 0;
								} else if (surrogateMatch.redFinal < surrogateMatch.blueFinal) {
									redQS = 0;
									blueQS = 2;
								} else {
									redQS = 1;
									blueQS = 1;
								}
								
								if (surrogateMatch.red.indexOf(teams[i].number) !== -1) {
									// the team was red
									teams[i].QS -= (redQS + surrogateMatch.CP);
									teams[i].HP -= surrogateMatch.redHybrid;
									teams[i].TP -= surrogateMatch.redTeleop;
									teams[i].BP -= surrogateMatch.redBridge;
								} else {
									teams[i].QS -= (blueQS + surrogateMatch.CP);
									teams[i].HP -= surrogateMatch.blueHybrid;
									teams[i].TP -= surrogateMatch.blueTeleop;
									teams[i].BP -= surrogateMatch.blueBridge;
								}
							}
						}
						
						// Then sort
						teams.sort(function(a, b) {
							if (a.QS === b.QS && a.HP === b.HP && a.BP === b.BP) {
								return a.TP - b.TP;
							} else if (a.QS === b.QS && a.HP === b.HP) {
								return a.BP - b.BP;
							} else if (a.QS === b.QS) { 
								return a.HP - b.HP;
							} else {
								return a.QS - b.QS;
							}
							return 0;
						});

						//Then display the rankings
						for (var i = teams.length - 1; i >= 0; i--) {
							var listWidget = registry.byId("rankingsList");
							var itemWidget = new dojox.mobile.ListItem({
								icon: "",
								rightIcon: "mblDomButtonBlueCircleArrow",
								transition: "slide",
								moveTo: "matches" + teams[i].number,
								label: teams[i].number,
								rightText: 
									"<span class='rankSpan'>" +
									"<span class='rankRecord' >Rank: " + (teams.length - i) + " (" + teams[i].wins + "-" + teams[i].losses + "-" + teams[i].ties + ")</span>" +
									"<span class='rankingPoints'>" + teams[i].QS + " QS, " + teams[i].HP + " HP, " + teams[i].BP + " BP, " + teams[i].TP + " TP </span>" +
									"</span>"
							});
							listWidget.addChild(itemWidget);
							
							var view1 = new dojox.mobile.ScrollableView({
								id: 'matches' + teams[i].number,
								selected: false
							}, domConstruct.create("div", null, "rankings", "after"));
							view1.startup();
							
							var view2 = new dojox.mobile.ScrollableView({
								id: 'homematches' + teams[i].number,
								selected: false
							}, domConstruct.create("div", null, "rankings", "after"));
							view2.startup();
							
							var heading1 = new dojox.mobile.Heading({
								label: "Team " + teams[i].number + "\'s Matches",
								back: "Back",
								moveTo: "rankings",
								fixed: "top"
							});
							view1.addChild(heading1);
							
							var heading2 = new dojox.mobile.Heading({
								label: "Team " + teams[i].number + "\'s Matches",
								back: "Back",
								moveTo: "teamList",
								fixed: "top"
							});
							view2.addChild(heading2);
										
							var list1 = new dojox.mobile.RoundRectList({
								id: 'matches' + teams[i].number + 'List'
							});
							view1.addChild(list1);
							var list2 = new dojox.mobile.RoundRectList({
								id: 'homematches' + teams[i].number + 'List'
							});
							view2.addChild(list2);
			
							for(var j = 0; j < teams[i].matchRecords.length; j++){
								var match = teams[i].matchRecords[j];
								var item1 = new dojox.mobile.ListItem({
									label: match.type + '' + match.matchNumber,
									rightText: "<span class='matchResultSpan'>"+
									"<table class='alliances'><tr class='redAlliance'><td>" + match.red[0] + "</td><td>" + match.red[1] + "</td><td>" + match.red[2] + "</td></tr>" +
									"<tr class='blueAlliance'><td>" + match.blue[0] + "</td><td> " + match.blue[1] + "</td><td> " + match.blue[2] + "</td></tr></table>" +
									"<span class='matchScore'><span class='redScore'>" + match.redFinal + "</span> - <span class='blueScore'>" + match.blueFinal + "</span></span>" +
									"<span class='matchCP'>CP: " + match.CP + "</span>" +
									"</span>"
								});
								var item2 = new dojox.mobile.ListItem({
									label: match.type + '' + match.matchNumber,
									rightText: "<span class='matchResultSpan'>"+
									"<table class='alliances'><tr class='redAlliance'><td>" + match.red[0] + "</td><td>" + match.red[1] + "</td><td>" + match.red[2] + "</td></tr>" +
									"<tr class='blueAlliance'><td>" + match.blue[0] + "</td><td> " + match.blue[1] + "</td><td> " + match.blue[2] + "</td></tr></table>" +
									"<span class='matchScore'><span class='redScore'>" + match.redFinal + "</span> - <span class='blueScore'>" + match.blueFinal + "</span></span>" +
									"<span class='matchCP'>CP: " + match.CP + "</span>" +
									"</span>"
								});
								list1.addChild(item1);
								list2.addChild(item2);
							}
						}
					}	
				});
			});
			
			document.getElementById('loader').style.display = 'none';
			
			var refreshMatchesButton = registry.byId('refreshMatchResults');
			refreshMatchesButton.on("click", function() {
				registry.byId('matchResultsList').destroyDescendants();
				refreshMatchResults();
			});
			
			var refreshRankingsButton = registry.byId('refreshRankings');
			refreshRankingsButton.on("click", function() {
				registry.byId('rankingsList').destroyDescendants();
				refreshRankings();
			});
		}
		
	});