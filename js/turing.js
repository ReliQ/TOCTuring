/**
 *	TOCTuring
 *	A Theory of Computation Assignment
 *
 * 	@author Patrick Reid
 * 	@link http://www.reliqartz.com
 */

var alphabet = "acer";
var tape = $('input[type="text"]');
var lag = $('input[name="lag"]');
var conclusion = $('#conclusion');
var display = $('#display');
var sWrapper = $('#wrapper');
var sScreen = $('#screen');
var sLog = $('#screen p');
var sim = $('input[type="submit"]');
var SPEED = 30, WAIT = 0, END = "#";
var R = "right", L = "left", N = "nada";
var data = "", string = "";
var anagramWord = "raccare";
var sym = {'a': "@", 'c': "^", 
	'e': "%", 'r': "*"};
 
$(function(){
	init();
});


function allowOnlyAlphabet() {
	tape.keyup(function(e){
	   var string = tape.val();
	   var patt = "^["+alphabet+"]*$";
	   if ( !string.match(patt) && string.length > 0 ) {
	      tell("Character '" + string.substring(string.length-1, string.length) 
	      	+ "' not allowed.");
	      tape.val(string.substring(0, string.length-1));
	   }
	});
}

function simulate() {
	if (SPEED >= 5 && tape.val().length > 0) {
		data = tape.val();
		SPEED = parseInt(lag.val());
		WAIT = SPEED*(data.length+2)
		tell("START");
		display.show("fast");
		display.html(data);
		string = data;
		
		var choice = $('input[name="do"]')
			.filter(':checked').val();
		if (choice == "anag"){
			isAnagram();
		} else if (choice == "pali"){
			isPalindrome();
		}
	} else {
		display.show("fast");
		display.html("Please enter a word.");
	}
}

function tell(string) {
	console.log(string);
	
	if ($('input[name="trace"]').is(':checked')) {
		sWrapper.css('width', '800px');
		sScreen.show("fast");
		sLog.show("fast");
	} else {
		sLog.hide();
		sScreen.hide();
		sWrapper.css('width', '400px');
	}
	if (string.indexOf('READ') >= 0) {
		string = '<span class="r">'+string+'</span>';
	} else if (string.indexOf('Current Focus') >= 0) { 
		string = '<span class="i">'+string+'</span>';
	} else if (string.indexOf('START') >= 0 || string.indexOf('DONE') >= 0) { 
		string = '<span class="s">'+string+'</span>';
	} else if (string.indexOf('REJECTED') >= 0 || string.indexOf('not allowed') >= 0) { 
		string = '<span class="e">'+string+'</span>';
	} else if (string.indexOf('ACCEPTED') >= 0) { 
		string = '<span class="a">'+string+'</span>';
	}

	sLog.html(sLog.html() +"<br/>"+ string);
	sLog.scrollTo('100%');	
}

function readI(string, index) {
	var dataBuffer = "";
	var c = string.charAt(index);
	dataBuffer += string.substring(0, index);
	dataBuffer += "<mark>"+c+"</mark>";
	dataBuffer += string.substring(index+1, string.length);
	display.html(dataBuffer);	
	return string.charAt(index);
}

function changeI(string, index, to) {
	var dataBuffer = "";
	var c = string.charAt(index);
	dataBuffer += string.substring(0, index);
	dataBuffer += to;
	dataBuffer += string.substring(index+1, string.length);
	string = dataBuffer;	
	return string;
}

function readToEnd() {
	var end = 0;
	if(string.length > 0) {
		var interval = setInterval(function(){ 
			readI(string, end);
			end ++;
			if (end >= string.length) {
				if (string.charAt(end-1) != END) {
					string += END;
				} else {
					readI(string, end-1);
					clearInterval(interval);
				}
			}
		}, SPEED);
	}
}

function move(at, dir) {
	if (dir == L) {
		return at-1;
	} else if (dir == R) {
		return at+1;
	} else {
		return at;
	}
}

function init() {
	allowOnlyAlphabet();
	conclusion.hide();
	display.hide();
	sLog.hide();
	sScreen.hide();
	sWrapper.css('width', '400px');
}

// =====================================================
// ANAGRAM:
function isAnagram() {
	tell("isAnagram? "+string);
	var point = 0;
	var origin = string;
	// initial configuration
	// read to end
	readToEnd(); 
	// append raccare
	setTimeout(function(){
		var end = string.length;
		point = end + 1;
		var interval = setInterval(function(){ 
			var str = string.substring(end-1, point);
			switch (str) {
				case END:
					string += "r";
					break;
				case "#r":
					string += "a";
					break;
				case "#ra":
					string += "c";
					break;
				case "#rac":
					string += "c";
					break;
				case "#racc":
					string += "a";
					break;
				case "#racca":
					string += "r";
					break;
				case "#raccar":
					string += "e";
					break;
				default:
					clearInterval(interval);
					readI(string, point-1);
					break;
			}
			point++;
			readI(string, point-2);
		}, SPEED);
	}, WAIT);

	// from the beginning
	// ACTION: cross off..
	// this will be done after the string is initialized
	setTimeout(function(){
		at = string.length-1;
		var accept = true;
		var currentFocus;
		var dir = L; // next direction
		var endPassed = false;
		var done = false;
		var cross = setInterval( function(){
			readI(string, at);
			tell("READ: "+string.charAt(at));

			if(done) {
				// STOP: we a done crossing off
				clearInterval(cross);
				readI(string, origin.length);
				tell("DONE");
				if (!string.match("^[x"+END+"]*$")) {
					accept = false;
				}
				conclusion.show("fast");
				if ( accept ) {
					conclusion.html("<div class=\"success\">ACCEPTED! <span>\""
						+origin+"\" is an anagram of \""+anagramWord+"\".</span></div>");
					tell("ACCEPTED! \""+origin+"\" is an anagram.");
				} else {
					conclusion.html("<div class=\"failure\">REJECTED! <span>\""
						+origin+"\" is NOT an anagram of \""+anagramWord+"\".</span></div>");
					tell("REJECTED! \""+origin+"\" is NOT an anagram.");
				}
			}
			if (string.charAt(at)=="x" || string.charAt(at)=="") {
				if (at >= string.length) {
					dir = L;
				} else if (endPassed==false) {
					dir = R;
				}
			} else if (string.charAt(at)==END 
				&& ((currentFocus==null) && dir==R) 
					|| (currentFocus!=null) && dir==L) {
				done = true;
			} else {
				if (at <= string.length) {
					if (!endPassed) {
						// ---------------------------------
						// we are in the given string
						if (currentFocus == null) {
							if (dir == R) {
								currentFocus = string.charAt(at);
								string = changeI(string, at, "x");
								if(!done) {
									tell("Current Focus: " +currentFocus);
								}
							} else {
								dir = L;
							}
						} else {
							dir = R;
						}
						// ---------------------------------
					} else {
						// ---------------------------------
						// we are in the added part of the string
						if (currentFocus != null) {
							if (string.charAt(at) == currentFocus) {
								string = changeI(string, at, "x");
								currentFocus = null;
								dir = L;
							}
						} else {
							console.log("Right side got no focus!");
						}
						// ---------------------------------
					}
					// gatekeeper: we are on the "end" symbol
					if (string.charAt(at) == END) {
						if(dir == R) {
							endPassed = true;
							console.log("on extra");
						} else {
							endPassed = false;
							console.log("off extra");
						}
					} 
				} else {
					dir = L;
					endPassed = true;
				}	
			}
		
			at = move(at, dir);
		}, SPEED);
		
	}, WAIT+(8*SPEED)); 
}

// =====================================================
// PALINDROME:
function isPalindrome() {
	tell("isPalindrome? "+string);
	var point = 0;
	var origin = string;
	// initial configuration
	// read to end
	readToEnd(); 

	setTimeout(function(){
		at = string.length-1;
		var accept = true;
		var currentFocus, checking;
		var dir = L; // next direction
		var endPassed = false, stopAtEnd = false;
		var done = false, stay = false;
		var cross = setInterval( function(){
			readI(string, at);
			tell("READ: "+string.charAt(at));

			if(done) {
				// STOP: we a done crossing off
				clearInterval(cross);
				if (!stay) {
					readI(string, origin.length);
				}
				tell("DONE");
				if (!string.match("^[x"+END+"]*$")) {
					accept = false;
				}
				conclusion.show("fast");
				if ( accept ) {
					conclusion.html("<div class=\"success\">ACCEPTED! <span>\""
						+origin+"\" is a palindrome.</span></div>");
					tell("ACCEPTED! \""+origin+"\" is a palindrome.");
				} else {
					conclusion.html("<div class=\"failure\">REJECTED! <span>\""
						+origin+"\" is NOT a palindrome.</span></div>");
					tell("REJECTED! \""+origin+"\" is not a palindrome.");
				}
			}
			if (string.charAt(at)=="x" || string.charAt(at)=="") {
				
				if (checking && string.charAt(at)=="x") {
					// we are in the checking phase
					if (dir == L) {
						// don't change direction
						if (currentFocus == null) {
							dir = L;
						} else {
							dir = R;
						}
					} else {
						// continue
						dir = R;
					}

				} else if (checking && string.charAt(at)=="") {
					// we've reached the front of the given string
					stopAtEnd = true; 
					dir = R;
				} else {
					// we are not in the checking phase
					if(currentFocus != null && at == string.length && !checking) {
						string += currentFocus;
						currentFocus = null;
						endPassed = true;
					} else {
						if (at >= string.length) {
							dir = L;
						} else {
							dir = R;
						}
					}
				}
			
			} else if (string.charAt(at)==END 
					&& (checking==null && dir==R 
						&& currentFocus==null)
					|| stopAtEnd) {

				if (checking==null && dir==R) {
					checking = true;
					tell("CHECKING...");
					dir = L;
				} else {
					done = true;
				}
			
			} else {

				if (at <= string.length) {
					if (!endPassed) {
						// ---------------------------------
						// we are in the given string
						if (currentFocus == null) {
							if (checking) {
								// we are doing checking
								if (dir == L) {
									currentFocus = string.charAt(at);
									switch (currentFocus) {
										case "@":
											currentFocus = "a";
											break;
										case "^":
											currentFocus = "c";
											break;
										case "%":
											currentFocus = "e";
											break;
										case "*":
											currentFocus = "r";
											break;
										default:
											currentFocus = null;
											break;
									}
									if(sym[currentFocus] == string.charAt(at)) {
										string = changeI(string, at,"x");
									}
									tell("Current Focus: " +currentFocus);
									dir = R;
								}

							} else {
								// we are not ready to check yet
								if (dir == R) {
									currentFocus = string.charAt(at);
									if (currentFocus in sym) {
										string = changeI(string, at, sym[currentFocus]);
									} else {
										currentFocus = null;
									}
									tell("Current Focus: " +currentFocus);
								} else {
									dir = L;
								}

							}


						} else {
							dir = R;
						}
						// ---------------------------------
					} else {
						// ---------------------------------
						// we are in the added part of the string
						if (currentFocus != null) {
							
							if (!checking) {
								if (string.charAt(at) == "") {
									string += string.charAt(at);
									currentFocus = null;
									dir = L;
								}
							} else {
								// we are checking the strings
								if (string.charAt(at) != "x") {
									var atNow = string.charAt(at);
									if (!done) {
										tell("Attempt to cross off " + atNow + "...");
									}
									if(currentFocus == atNow) {
										string = changeI(string, at,"x");
										dir = L;
										currentFocus = null;
									} else {
										// stop because we can conclude that the string is no palindrome
										dir = N;
										stay = true;
										done = true;
									}
								}
								

							}
						} else {
							console.log("RightSideNoFocus!");
						}
						// ---------------------------------
					}
					// gatekeeper: we are on the "end" symbol
					if (string.charAt(at) == END) {
						if(dir == R) {
							endPassed = true;
							console.log("on extra");
						} else {
							endPassed = false;
							console.log("off extra");
						}
					} 
				} else {
					dir = L;
					currentFocus = null;
					endPassed = true;
				}

			}
		
			at = move(at, dir);
		}, SPEED);
		
	}, WAIT); 

}
