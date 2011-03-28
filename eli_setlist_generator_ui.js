$(document).ready(function() {
    var songsJsonBox = $("#songsJson");
    var namesOfSongsBox = $("#namesOfSongs");
    var numSongsBox = $("#numSongs");
    var checkerTable = $("#checkerTable");
    var tableWrapper = $("#tableWrapper");

    var handleTransitionCheckbox = function(event) {
	var d = event.data;
	var enabled = event.target.checked;
	var fromSong = d.from;
	var toSong = d.to;

	var songs = $.parseJSON(songsJsonBox.val());
	songs[fromSong] = $.grep(songs[fromSong], function(x) { return (x != toSong); });
	if (enabled) {
	    songs[fromSong].push(toSong);
	}

	setSongs(songs, d.all);
    };

    var setupCheckerTable = function(songs, songNames) {
	checkerTable.detach();
	checkerTable.empty();
	var numSongs = songNames.length;
	// "To" super-header
	checkerTable.append($('<tr>').append($('<td>&nbsp;</td><td>&nbsp;</td>'),$('<td>').addClass("toHeader").attr("colspan",numSongs).append("...can transition into")));
	// "From" super-header and "To" song names
	var secondRow = $('<tr>');
	checkerTable.append(secondRow);
	secondRow.append($('<td>&nbsp;</td><td>&nbsp;</td>'));
	for(var i=0; i<numSongs; ++i) {
	    secondRow.append($('<td>').addClass("toHeader").append(songNames[i]));
	    
	    var songRow = $('<tr>');
	    checkerTable.append(songRow);
	    if (i == 0) {
		songRow.append($('<td>').addClass("fromHeader").append("From..."));
	    } else {
		songRow.append($('<td>&nbsp;</td>'));
	    }
	    songRow.append($('<td>').addClass("fromHeader").append(songNames[i]));
	    for(var j=0; j<numSongs; ++j) {
		var transCB = $('<input type="checkbox">');
		var toSong = songNames[j];
		var fromSong = songNames[i];
		transCB.change({from: fromSong, to: toSong, all: songNames},handleTransitionCheckbox);
		songRow.append($('<td>').append(transCB));
		if ($.inArray(toSong, songs[fromSong]) != -1) { 
		    transCB.attr('checked', 'checked'); 
		}
	    }
	}
	
	tableWrapper.append(checkerTable);
    }

    var setSongs = function(songs, songNames) {
	if (songs) {
	    songsJsonBox.val(JSON.stringify(songs, null, "  "));
	    numSongsBox.val(Object.keys(songs).length);
	    namesOfSongsBox.val(songNames.join("\n"));
	    setupCheckerTable(songs, songNames);
	    $.cookie("esgsongs",songsJsonBox.val());
	} else {
	    checkerTable.detach();
	    songsJsonBox.val("");
	    numSongsBox.val("");
	    namesOfSongsBox.val("");
	    $.cookie("esgsongs",null);
	}
	$("#results").empty();
    }

    // When the songs & transitions changes...
    songsJsonBox.change(function(event) {
	var songs;
	try {
	    songs = $.parseJSON(songsJsonBox.val());
	} catch(err) {
	    $("#results").text("Invalid JSON code in songs and transitions box: "+err);
	    return;
	}
	setSongs(songs, (songs ? Object.keys(songs) : []));
    });

    var trim = function(s) { return s.replace(/^\s+|\s+$/g,""); }

    namesOfSongsBox.change(function(event) {
	var songNames = filter(namesOfSongsBox.val().split("\n"), function(s) { return trim(s) != ""; });
	var snl = songNames.length;
	for(var i=0; i<snl; i++) {
	    songNames[i] = trim(songNames[i]);
	}
	setSongs(changeSongNameList($.parseJSON(songsJsonBox.val()), songNames), songNames);
    });

    var randFunc = function(n) { return Math.floor(Math.random()*n); };
    $("#genSetlist").click(function(event) {
        try {
            var songs = $.parseJSON(songsJsonBox.val());
	    var desiredLength = parseInt($("#numSongs").val());
            var setlist = generateSetlist(songs,desiredLength, randFunc);
	    var resultsElem = $("#results");
	    resultsElem.text("");
	    if (setlist) {
		$.each(setlist, function(n, song) { resultsElem.append(song+"<br/>"); });
	    } else {
		resultsElem.text("Could not find any possible "+desiredLength+"-song set");
	    }
        } catch(err) {
            $("#results").text(err.toString());
        }
    });
    
    var songsJsonCookie = $.cookie("esgsongs");
    if (songsJsonCookie !== null && songsJsonCookie !== "") {
        songsJsonBox.val(songsJsonCookie);
        songsJsonBox.change();
    }

});
