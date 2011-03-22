$(document).ready(function() {
    var songsJson = $("#songsJson");
    var songsJsonCookie = $.cookie("esgsongs");
    if (songsJsonCookie !== null) {
        alert(songsJsonCookie);
        songsJson.val(songsJsonCookie);
        songsJson.change();
    }
    songsJson.change(function(event) {
	var songs = $.parseJSON(songsJson.val());
	$("#numSongs").val(Object.keys(songs).length);
	$("#namesOfSongs").val(Object.keys(songs).sort().join("\n"));
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
    
    songsJson.text(JSON.stringify({
	    firsty: ['secondy', 'fourthy'], 
	    secondy: ['thirdy'],
	    thirdy: ['fourthy'],
	    fourthy: ['secondy']
	}));
    songsJson.change();
});
