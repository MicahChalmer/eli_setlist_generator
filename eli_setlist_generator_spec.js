describe("Setlist generator specs", function() {
    var checkGSLUntouched = function(desc, songsFunc, numSongs, randGen, expectedSetlist) {
	describe(desc, function() {
	    var songs = songsFunc();
	    var setList = generateSetlist(songs, numSongs, randGen);
	    it("actual test", function() { expect(setList).toEqual(expectedSetlist); });
	    it("Should not have modified the songs during the test", function() { expect(songs).toEqual(songsFunc()); });
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
});
