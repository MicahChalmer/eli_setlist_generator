// Via Andy E at http://stackoverflow.com/questions/208016/how-to-list-the-properties-of-a-javascript-object/3937321#3937321
Object.keys = Object.keys || (function () {
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !{toString:null}.propertyIsEnumerable("toString"),
        DontEnums = [
            'toString',
            'toLocaleString',
            'valueOf',
            'hasOwnProperty',
            'isPrototypeOf',
            'propertyIsEnumerable',
            'constructor'
        ],
        DontEnumsLength = DontEnums.length;
 
    return function (o) {
        if (typeof o != "object" && typeof o != "function" || o === null)
            throw new TypeError("Object.keys called on a non-object");
    
        var result = [];
        for (var name in o) {
            if (hasOwnProperty.call(o, name))
                result.push(name);
        }
    
        if (hasDontEnumBug) {
            for (var i = 0; i < DontEnumsLength; i++) {
                if (hasOwnProperty.call(o, DontEnums[i]))
                    result.push(DontEnums[i]);
            }   
        }
    
        return result;
    };
})();

// a is an array.  Return an array of the elements of a for which f returns true
var filter = function(a,f) {
    var r = [];
    var l = a.length;
    for(var i=0; i<l; ++i) {
	var e = a[i];
	if (f(e)) {
	    r.push(e);
	}
    }
    return r;
};

var arrayClone = function(a) { return filter(a,function() {return true;}); };

var contains = function(a,e) {
    var l = a.length;
    for(var i=0; i<l; ++i) {
	if (a[i] == e)
	    return true;
    }
    return false;
}

// songs is an object { song name: [ list of songs it can segue to ] }
// numSongs is how many songs you want in the setlist
// randGen is a function that should return random integers >= 0 and < the integer passed in
function generateSetlist(songs, numSongs, randGen) {
    if (numSongs < 1) {
	throw "number of songs must be at least 1: got "+numSongs;
    }
    
    return (function(availableSongs, setList) {
	var result;
	var numAvail = availableSongs.length;
	var firstSongIndex = randGen(numAvail);
	for (var i = firstSongIndex; (!result) && (i-firstSongIndex)<numAvail; ++i) {
	    var nsi = i % numAvail;
	    var newSong = availableSongs[nsi];
	    var newSetList = arrayClone(setList);
	    newSetList.push(newSong);
	    if (newSetList.length == numSongs) {
		result = newSetList;
	    } else {
		var newAvailableSongs = filter(songs[newSong], function(x) { return !contains(newSetList,x); });
		if (newAvailableSongs.length) {
		    result = arguments.callee(newAvailableSongs, newSetList);
		}
	    }
	    // At this point either we've set result (in which case we'll drop
	    // out of the loop and return it) or we go on to the next song
	    // in the available list
	}
	return result;
    })(
	Object.keys(songs), // initial availableSongs
	[]                  // initial setList
    );
}

