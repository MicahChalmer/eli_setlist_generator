Eli's Setlist Generator
=======================

My brother Eli, and his band [Durians](http://www.myspace.com/duriansmusic), wanted a way to generate set lists for their gigs.  They play without interruption between songs, but they don't have smooth transitions for every possible pair of songs.  So Eli wanted a way to generate a random set list using only the transitions they can play smoothly.  I decided to give him one, and here it is.

There is no server side component at all--just static HTML and javascript that runs in your browser.  There is also no "build"--the source is laid out exactly as it sits on the server.

The file uses [jQuery](http://jquery.com/), served up from its own CDN.  In thirdparty/ there are some other javascript goodies that it uses.  They are:

 * json2.js (to add the JSON object to browsers that are missing it) from <http://www.json.org/>
 * jquery cookie plugin by Klaus Hartl from <http://plugins.jquery.com/project/Cookie>
 * Jasmine for unit tests from <https://github.com/pivotal/jasmine>

Everything outside of thirdparty (other than SpecRunner.html which mostly comes from Jasmine) is written by me, Micah Chalmer, and released under the MIT license.
