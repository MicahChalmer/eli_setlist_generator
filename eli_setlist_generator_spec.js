var checkUntouched = function(desc, songsFunc, actualTest) {
    describe(desc, function() {
	var songs = songsFunc();
	
	it("actual test", function() { actualTest.call(this, songs) });
	it("Should not have modified the songs during the test", function() { expect(songs).toEqual(songsFunc()); });
    });
};



describe("Setlist generator specs", function() {
    var checkGSLUntouched = function(desc, songsFunc, numSongs, randGen, expectedSetlist) { 
	return checkUntouched(desc, songsFunc, function(songs) {
	    expect(generateSetlist(songs, numSongs, randGen)).toEqual(expectedSetlist);
	});
    };
    
    describe("Three songs linear", function() {
	var threeSongsLinear = function() { return {
	    firsty: ['secondy'],
	    secondy: ['thirdy'],
	    thirdy: ['firsty']
	}; };

	checkGSLUntouched("Should return a linear list", 
			  threeSongsLinear, 
			  3, 
			  function() { return 0; }, 
			  ['firsty','secondy','thirdy']);

	checkGSLUntouched("Should return how many songs asked for", 
			  threeSongsLinear, 
			  2, 
			  function() { return 0; }, 
			  ['firsty','secondy']);

	checkGSLUntouched("Should return a list starting in the middle", 
			  threeSongsLinear, 
			  3, 
			  function(n) { if (n >= 2) { return 1; } else { return 0; } }, 
			  ['secondy','thirdy','firsty']);
    });

    describe("Skip false path", function() {
	// Here the only possible path is thirdy -> secondy -> firsty, but
	// the rand gen will make it try firsty -> secondy first before having to fall back
	var falsePath = function() { return {
	    firsty: ['secondy'],
	    secondy: ['firsty'],
	    thirdy: ['secondy']
	}; };

	checkGSLUntouched("Should skip a bad path to find a good one",
			  falsePath,
			  3,
			  function() { return 0; },
			  ['thirdy','secondy','firsty']);

	checkGSLUntouched("Should find a small enough path",
			  falsePath,
			  2,
			  function() { return 0; },
			  ['firsty','secondy']);
    });

    describe("Fail to find a 3-song path", function() {
	var no3Path = function() { return {
	    firsty: ['secondy'], 
	    secondy: [],
	    thirdy: ['secondy']
	}; };
	
	checkGSLUntouched("Should fail to find a three-path",
			  no3Path,
			  3,
			  function() { return 0; },
			  undefined);

	checkGSLUntouched("Should still find a 2-song path",
			  no3Path,
			  2,
			  function() { return 0; },
			  ['firsty', 'secondy']);

	checkGSLUntouched("Should find the other 2-song path",
			  no3Path,
			  2,
			  function(n) { return 2 % n; },
			  ['thirdy','secondy']); 
    });

    describe("Four-song list", function() {
	var fourSongList = function() { return {
	    firsty: ['secondy', 'fourthy'], 
	    secondy: ['thirdy'],
	    thirdy: ['fourthy'],
	    fourthy: ['secondy']
	}; };

	checkGSLUntouched("Should find the first 4-path",
			  fourSongList,
			  4,
			  function() { return 0; },
			  ['firsty','secondy','thirdy','fourthy']);

	checkGSLUntouched("Should find the second 4-path",
			  fourSongList,
			  4,
			  function(n) { return 3 % n; },
			  ['firsty','fourthy','secondy','thirdy']);
    });

    describe("6-song path", function() {
	var sixSongList = function()  { return {
	    "firsty": [
		"fourthy"
	    ],
	    "thirdy": [
		"fourthy"
	    ],
	    "fourthy": [
		"firsty"
	    ],
	    "fifthy": [
		"chumba"
	    ],
	    "afafa": [
		"firsty"
	    ],
	    "chumba": [
		"afafa"
	    ]
	}; }
	
	var incr=0;
	var randFunc = function(n) { return (++incr) % n; }
	checkGSLUntouched("Fail to find a six-song path",
			  sixSongList,
			  6,
			  randFunc,
			  undefined);
    });

});

describe("Handling changes to the list of songs", function() {
    var threeSongsLinear = function() { return {
	firsty: ['secondy'],
	secondy: ['thirdy'],
	thirdy: ['firsty']
    }; };
    
    checkUntouched("Handles the same list it already has", threeSongsLinear, function(songs) {
	expect(changeSongNameList(songs, ["secondy","firsty","thirdy"])).toEqual(threeSongsLinear());
    });

    checkUntouched("Handles adding a song to the list", threeSongsLinear, function(songs) {
	expect(changeSongNameList(songs, ["firsty","secondy","thirdy","fourthy"])).toEqual({
	    firsty: ['secondy'],
	    secondy: ['thirdy'],
	    thirdy: ['firsty'],
	    fourthy: []
	});
    });

    checkUntouched("Handles removing a song from the list", threeSongsLinear, function(songs) {
	expect(changeSongNameList(songs, ["firsty","thirdy"])).toEqual({
	    firsty: [],
	    thirdy: ['firsty']
	});
    });

    checkUntouched("Handles both adding and removing", threeSongsLinear, function(songs) {
	expect(changeSongNameList(songs, ["firsty","secondy","thirdy","fourthy"])).toEqual({
	    firsty: ['secondy'],
	    secondy: ['thirdy'],
	    thirdy: ['firsty'],
	    fourthy: []
	});
    });

    checkUntouched("Handles an empty list", threeSongsLinear, function(songs) {
	expect(changeSongNameList(songs, [])).toBeUndefined();
    });
});