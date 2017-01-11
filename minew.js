"use strict";
var QUIT=0;
var KEYDOWN=1;
var K_ESCAPE=0;
var K_SPACE=1;
var K_RETURN=2;
var K_s=3;
addEventListener("load",function(){
	document.body.addEventListener("click",function(){
		pygame.event.push({type:KEYDOWN,key:K_SPACE});
	});
	keyboard.bind("escape",function(){
		pygame.event.push({type:KEYDOWN,key:K_ESCAPE});
	});
	keyboard.bind("space",function(){
		pygame.event.push({type:KEYDOWN,key:K_SPACE});
	});
	keyboard.bind("enter",function(){
		pygame.event.push({type:KEYDOWN,key:K_RETURN});
	});
	keyboard.bind("s",function(){
		pygame.event.push({type:KEYDOWN,key:K_s});
	});
});
