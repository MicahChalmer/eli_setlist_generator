$(document).ready(function() {
    var songsJsonBox = $("#songsJson");
    var namesOfSongsBox = $("#namesOfSongs");
    var numSongsBox = $("#numSongs");

    var setSongs = function(songs, songNames) {
	if (songs !== null) {
	    songsJsonBox.val(JSON.stringify(songs, null, "  "));
	    numSongsBox.val(Object.keys(songs).length);
	    namesOfSongsBox.val(songNames.join("\n"));
	} else {
	    songsJsonBox.val("");
	    numSongsBox.val("");
	    namesOfSongsBox.val("");
	}
    }

    // When the songs & transitions changes...
    songsJsonBox.change(function(event) {
	var sjv = songsJsonBox.val();
	$.cookie("esgsongs",sjv);
	var songs = $.parseJSON(sjv);
	setSongs(songs, Object.keys(songs));
    });

    namesOfSongsBox.change(function(event) {
	var songNames = namesOfSongsBox.val().split("\n");
	var snl = songNames.length;
	for(var i=0; i<snl; i++) {
	    songNames[i] = songNames[i].replace(/^\s+|\s+$/g,"");
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
	    if (setlist !== undefined) {
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
    } else {
	songsJsonBox.val(JSON.stringify({
	    firsty: ['secondy', 'fourthy'], 
	    secondy: ['thirdy'],
	    thirdy: ['fourthy'],
	    fourthy: ['secondy']
	}, null, "  "));
	songsJsonBox.change();
    }

});
