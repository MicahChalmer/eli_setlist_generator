$(document).ready(function() {
    var songsJson = $("#songsJson");

    // When the songs & transitions changes...
    songsJson.change(function(event) {
	var sjv = songsJson.val();
	$.cookie("esgsongs",sjv);
	var songs = $.parseJSON(sjv);
	if (songs !== null) {
	    $("#numSongs").val(Object.keys(songs).length);
	    $("#namesOfSongs").val(Object.keys(songs).sort().join("\n"));
	} else {
	    $("#numSongs").val("");
	    $("#namesOfSongs").val("");
	}
    });

    var randFunc = function(n) { return Math.floor(Math.random()*n); };
    $("#genSetlist").click(function(event) {
        try {
            var songs = $.parseJSON(songsJson.val());
            var setlist = generateSetlist(songs,$("#numSongs").val(), randFunc);
	    $("#results").text("");
            $.each(setlist, function(n, song) { $("#results").append(song+"<br/>"); });
        } catch(err) {
            $("#results").text(err.toString());
        }
    });
    
    var songsJsonCookie = $.cookie("esgsongs");
    if (songsJsonCookie !== null && songsJsonCookie !== "") {
        songsJson.val(songsJsonCookie);
        songsJson.change();
    } else {
	songsJson.val(JSON.stringify({
	    firsty: ['secondy', 'fourthy'], 
	    secondy: ['thirdy'],
	    thirdy: ['fourthy'],
	    fourthy: ['secondy']
	}, null, "  "));
	songsJson.change();
    }

});
