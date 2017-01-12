"use strict";
var QUIT=0;
var KEYDOWN=1;
var K_ESCAPE=0;
var K_SPACE=1;
var K_RETURN=2;
var K_s=3;
var RESIZE=2;
addEventListener("load",function(){
	keyboard.bind("escape",function(e){
		pygame.event.push({type:KEYDOWN,key:K_ESCAPE});
		e.preventDefault();
	});
	keyboard.bind("space",function(e){
		pygame.event.push({type:KEYDOWN,key:K_SPACE});
		e.preventDefault();
	});
	keyboard.bind("enter",function(e){
		pygame.event.push({type:KEYDOWN,key:K_RETURN});
		e.preventDefault();
	});
	keyboard.bind("s",function(e){
		pygame.event.push({type:KEYDOWN,key:K_s});
		e.preventDefault();
	});
	var mc=new Hammer(document.body);
	mc.on("tap",function(){
		pygame.event.push({type:KEYDOWN,key:K_SPACE});
	});
	mc.on("press",function(){
		pygame.event.push({type:KEYDOWN,key:K_RETURN});
	});
	mc.on("swiperight",function(){
		pygame.event.push({type:KEYDOWN,key:K_s});
	});
	function resize(){
		pygame.event.push({type:RESIZE});
	}
	addEventListener("resize",resize);
	resize();
});
