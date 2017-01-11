"use strict"
//pygame
var pygame={
	init:function(){
		var that=this;
		this.Surface=function(size){
			this.width=size[0];
			this.height=size[1];
			this.canvas=document.createElement("canvas");
			this.canvas.width=this.width;
			this.canvas.height=this.height;
			this.context=this.canvas.getContext("2d");
			this.fill([0,0,0])
		}
		this.Surface.prototype.blit=function(suf,pos){
			if(suf instanceof that.fontFakeSurface)
				suf.drawText(this,pos);
			else if(suf instanceof that.Surface)
				this.context.drawImage(suf.canvas,pos[0],pos[1]);
			else
				this.context.drawImage(suf,pos[0],pos[1]);
		}
		this.Surface.prototype.fill=function(color){
			this.context.fillStyle="rgb("+color[0]+","+color[1]+","+color[2]+")";
			this.context.fillRect(0,0,this.width,this.height);
		}
		this.Surface.prototype.get_rect=function(){
			var rect=[0,0,this.width,this.height];
			rect.left=rect[0];
			rect.top=rect[1];
			rect.right=rect[2];
			rect.bottom=rect[3];
			return ;
		}
		this.Image=function(img){
			that.Surface.call(this,[img.width,img.height]);
			this.blit(img,[0,0]);
		}
		this.Image.prototype=this.Surface.prototype;
		this.image={
			load:function(src,callback){
				var img=new Image();
				img.src=src;
				img.alt="";
				img.onload=function(){
					var image=new that.Image(img);
					callback(image);
				}
			}
		}
		this.display={
			update:function(){},
			set_mode:function(size){
				var scr=new that.Surface(size);
				document.body.appendChild(scr.canvas);
				return scr;
			}
		}
		this.time={
			wait:function(time,callback){
				setTimeout(callback,time);
			},
			Clock:function(){
				this.lastCall=0
				this.time_list=[];
			}
		}
		this.time.Clock.prototype.tick=function(fps,callback){
			var now=Date.now();
			var delay;
			if(this.lastCall==0){
				delay=1000/fps;
			}else{
				delay=1000/fps-(now-this.lastCall);
			}
			var that2=this;
			setTimeout(function(){
				that2.lastCall=Date.now();
				that2.time_list.push(that2.lastCall);
				if(that2.time_list.length-10>0) that2.time_list.splice(0,that2.time_list.length-10);
				callback();
			},delay);
		}
		this.time.Clock.prototype.get_fps=function(){
			var arv=0;
			for(var i=1;i<this.time_list.length;++i){
				arv+=this.time_list[i]-this.time_list[i-1];
			}
			arv/=this.time_list.length-1;
			return 1000/arv;
		}
		this.event=[];
		this.event.get=function(){
			var es=[];
			while(this.length)
				es.push(this.shift());
			return es;
		}
		this.font={
			Font:function(name,size){
				this.name=name;
				this.size=size;
			}
		}
		this.font.Font.prototype.render=function(text,msaa,color,bgcolor){
			return new that.fontFakeSurface(this.name,this.size,text,msaa,color,bgcolor);
		}
		this.fontFakeSurface=function(name,size,text,msaa,color,bgcolor){
			this.name=name;
			this.size=size;
			this.text=text;
			this.msaa=msaa;
			this.color=color;
			this.bgcolor=bgcolor;
		}
		this.fontFakeSurface.prototype.drawText=function(suf,pos){
			if(this.name==null)
				suf.context.font=this.size+"px sans-serif";
			else
				suf.context.font=this.size+"px "+this.name;
			suf.context.textBaseline="top";
			suf.context.fillStyle="rgb("+this.color[0]+","+this.color[1]+","+this.color[2]+")";
			suf.context.fillText(this.text,pos[0],pos[1])
		}
		this.fontFakeSurface.prototype.get_rect=function(){
			var context=document.createElement("canvas").getContext("2d");
			if(this.name==null)
				context.font=this.size+"px sans-serif";
			else
				context.font=this.size+"px "+this.name;
			context.textBaseline="top";
			context.fillStyle="rgb("+this.color[0]+","+this.color[1]+","+this.color[2]+")";
			var rect=[0,0,context.measureText(this.text).width,this.size];
			rect.left=0;
			rect.top=0;
			rect.right=rect[2];
			rect.bottom=rect[3];
			return rect;
		}
	}
}
var random={
	random:function(){
		return Math.random();
	},
	randint:function(l,r){
		return parseInt(this.random()*(r-l+1)+l);
	},
	choice:function(list){
		return list[this.randint(0,list.length-1)];
	}
}
