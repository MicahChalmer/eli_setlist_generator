$(document).ready(function() {
    var songsJson = $("#songsJson");
    var songsJsonCookie = $.cookie("esgsongs");
    if (songsJsonCookie !== null) {
        alert(songsJsonCookie);
        songsJson.val(songsJsonCookie);
        songsJson.change();
    }
    songsJson.change(function(event) { $.cookie("esgsongs", event.target.value);});
    var randFunc = function(n) { return Math.floor(Math.random()*n); };
    $("#genSetlist").click(function(event) {
        try {
            var songs = $.parseJSON(songsJson.val());
            var setlist = generateSetlist(songs,songs.keys.length, randFunc);
            $.each(setlist, function(n, song) { $("#results").append("<p>"+song+"</p>"); });
        } catch(err) {
            $("#results").text(err.toString());
        }
    });
});
