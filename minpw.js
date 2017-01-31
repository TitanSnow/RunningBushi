// minpw.js - Minimalist Python multimedia framework implement for Web (JavaScript)
//
// Copyright 2017 TitanSnow
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

;(function(outside,lib){
	"use strict"
	var python=outside.python={
		None:null,
		True:true,
		False:false,
		str:function(x){return x.toString()},
		init:function(){
			var key
			for(key in this)
				if(this.hasOwnProperty(key)&&key!="init")
					outside[key]=this[key]
		}
	}
	function wrapperConstructor(cls){
		return new cls(Array.prototype.slice.call(arguments,1))
	}
	var BaseException,Exception
	;(function implementExceptions(){
		BaseException=Exception=class{
			constructor(args){
				this.args=args
			}
		}
		python.BaseException=wrapperConstructor.bind(null,BaseException)
		python.Exception=wrapperConstructor.bind(null,Exception)
		class ValueError extends BaseException{}
		python.ValueError=wrapperConstructor.bind(null,ValueError)
	})()
	;(function implementList(Array){
		function at2(pos,val){
			if(pos<0)
				this[this.length+pos]=val
			else
				this[pos]=val
		}
		class list extends Array{}
		list.prototype.at=function(pos){
			if(arguments.length==2)
				return at2.call(this,arguments[0],arguments[1])
			if(pos<0)
				return this[this.length+pos]
			else
				return this[pos]
		}
		list.prototype.in=function(x){
			return this.indexOf(x)!=-1
		}
		list.prototype.not_in=function(x){
			return this.indexOf(x)==-1
		}
		list.prototype.extend=function(lst){
			var that=this
			lst.forEach(function(e){
				that.push(e)
			})
		}
		list.prototype.times=function(n){
			if(n<=0){
				this.clear()
				return
			}
			var len=this.length
			var k,i
			for(k=1;k<n;++k)
				for(i=0;i<len;++i)
					this.push(this[i])
		}
		list.prototype.len=function(){
			return this.length
		}
		list.prototype.min=function(){
			var mx=Infinity
			this.forEach(function(e){
				mx=Math.min(e,mx)
			})
			return mx
		}
		list.prototype.max=function(){
			var mx=-Infinity
			this.forEach(function(e){
				mx=Math.max(e,mx)
			})
			return mx
		}
		list.prototype.index=function(x,i,j){
			if(arguments.length==1){
				i=0
				j=this.length
			}else if(arguments.length==2){
				j=this.length
			}
			if(j<0) j=this.length+j
			var pos=this.indexOf(x,i)
			if(pos==-1||pos>=j)
				throw python.ValueError(x+" is not in list")
			return pos
		}
		list.prototype.count=function(x){
			var ans=0
			this.forEach(function(e){
				if(e==x) ++ans
			})
			return ans
		}
		list.prototype.append=function(x){
			this.push(x)
		}
		list.prototype.clear=function(){
			this.splice(0)
		}
		list.prototype.copy=function(){
			return this.slice(0)
		}
		list.prototype.insert=function(i,x){
			this.splice(i,0,x)
		}
		list.prototype.remove=function(x){
			this.splice(this.index(x),1)
		}
		var key
		for(key in list.prototype)
			if(list.prototype.hasOwnProperty(key))
				Array.prototype[key]=list.prototype[key]
		outside.list=function(arr){
			return arr
		}
		outside.tuple=function(arr){
			return arr
		}
		outside.range=function(l,r){
			if(arguments.length==1){
				r=l
				l=0
			}
			var i,lst=[]
			for(i=l;i<r;++i)
				lst.append(i)
			return lst
		}
		outside.len=function(arr){
			return arr.len()
		}
	})(outside.Array)
	class Random{
		random(){
			return Math.random()
		}
		randint(l,r){
			return parseInt(this.random()*(r-l+1)+l)
		}
		choice(list){
			return list[this.randint(0,list.length-1)]
		}
		randrange(){
			return this.choice(outside.range.apply(null,Array.from(arguments)))
		}
		uniform(a,b){
			return a+(b-a)*this.random()
		}
	}
	outside.random=new Random()
	class Pygame{
		constructor(){
			var that=this
			this.event=[]
			this.event.get=function(){
				var es=[]
				while(this.length)
					es.push(this.shift())
				return es
			}
			class PygameError extends Exception{}
			this.error=wrapperConstructor.bind(null,PygameError)
			this.Color=function(){
				var arr=Array.from(arguments)
				Object.defineProperty(arr,"r",{
					__proto__:null,
					get:function(){
						return this[0]
					},
					set:function(x){
						this[0]=x
					}
				})
				Object.defineProperty(arr,"g",{
					__proto__:null,
					get:function(){
						return this[1]
					},
					set:function(x){
						this[1]=x
					}
				})
				Object.defineProperty(arr,"b",{
					__proto__:null,
					get:function(){
						return this[2]
					},
					set:function(x){
						this[2]=x
					}
				})
				Object.defineProperty(arr,"a",{
					__proto__:null,
					get:function(){
						if(this.length==4) return this[3]
						else return 255
					},
					set:function(x){
						this[3]=x
					}
				})
				Object.defineProperty(arr,"a01",{
					__proto__:null,
					get:function(){
						return this.a/255
					},
					set:function(x){
						this.a=Math.round(x*255)
					}
				})
				return arr
			}
			this.Rect=function(x,y,w,h){
				var obj=[x,y,w,h]
				Object.defineProperty(obj,"x",{
					__proto__:null,
					get:function(){
						return this[0]
					},
					set:function(x){
						this[0]=x
					}
				})
				Object.defineProperty(obj,"y",{
					__proto__:null,
					get:function(){
						return this[1]
					},
					set:function(x){
						this[1]=x
					}
				})
				Object.defineProperty(obj,"w",{
					__proto__:null,
					get:function(){
						return this[2]
					},
					set:function(x){
						this[2]=x
					}
				})
				Object.defineProperty(obj,"h",{
					__proto__:null,
					get:function(){
						return this[3]
					},
					set:function(x){
						this[3]=x
					}
				})
				Object.defineProperty(obj,"width",{
					__proto__:null,
					get:function(){
						return this.w
					},
					set:function(x){
						this.w=x
					}
				})
				Object.defineProperty(obj,"height",{
					__proto__:null,
					get:function(){
						return this.h
					},
					set:function(x){
						this.h=x
					}
				})
				Object.defineProperty(obj,"left",{
					__proto__:null,
					get:function(){
						return this.x
					},
					set:function(x){
						this.x=x
					}
				})
				Object.defineProperty(obj,"top",{
					__proto__:null,
					get:function(){
						return this.y
					},
					set:function(x){
						this.y=x
					}
				})
				Object.defineProperty(obj,"right",{
					__proto__:null,
					get:function(){
						return this.x+this.w
					}
				})
				Object.defineProperty(obj,"bottom",{
					__proto__:null,
					get:function(){
						return this.y+this.h
					}
				})
				return obj
			}
			function blit3(suf,pos,area){
				area=that.Rect.apply(null,area)
				this.context.drawImage(suf.canvas,area.x,area.y,area.w,area.h,pos[0],pos[1],area.w,area.h)
			}
			class Surface{
				constructor(size){
					size=size[0]
					size[0]=Math.max(size[0],1)
					size[1]=Math.max(size[1],1)
					this.context=document.createElement("canvas").getContext("2d")
					this.canvas.width=size[0]
					this.canvas.height=size[1]
				}
				get width(){
					return parseInt(this.canvas.width)
				}
				set width(x){
					this.canvas.width=x
				}
				get height(){
					return parseInt(this.canvas.height)
				}
				set height(x){
					this.canvas.height=x
				}
				get canvas(){
					return this.context.canvas
				}
				blit(suf,pos,area){
					if(arguments.length>=3)
						blit3.call(this,suf,pos,area)
					else
						this.context.drawImage(suf.canvas,Math.round(pos[0]),Math.round(pos[1]))
				}
				fill(color){
					this.context.save()
					color=that.Color.apply(that,color)
					this.context.fillStyle="rgba("+color.r+","+color.g+","+color.b+","+color.a01+")"
					this.context.fillRect(0,0,Math.round(this.width),Math.round(this.height))
					this.context.restore()
				}
				get_rect(){
					return that.Rect(0,0,this.width,this.height)
				}
				convert(){return this}
				convert_alpha(){return this}
				copy(){
					var suf=new Surface([[this.width,this.height]])
					suf.context.drawImage(this.canvas,0,0)
					return suf
				}
				get_size(){
					return [this.width,this.height]
				}
				get_width(){
					return this.width
				}
				get_height(){
					return this.height
				}
				mpwSave(){
					this.context.save()
				}
				mpwRestore(){
					this.context.restore()
				}
				get mpwBlitMode(){
					return this.context.globalCompositeOperation
				}
				set mpwBlitMode(x){
					this.context.globalCompositeOperation=x
				}
			}
			this.Surface=wrapperConstructor.bind(null,Surface)
			class Image extends Surface{
				constructor(img){
					img=img[0]
					super([[img.width,img.height]])
					this.context.drawImage(img,0,0)
				}
			}
			this.Image=wrapperConstructor.bind(null,Image)
			this.image={
				init(){
					this.load=function load(src,callback){
						if(arguments.length==1){
							return new Promise(function(resolve,reject){
								load(src,resolve)
							})
						}
						var img=document.createElement("img")
						img.src=src
						img.alt=""
						img.onload=function(){
							var image=that.Image(img)
							callback(image)
						}
					}
				}
			}
			this.display={
				get_init:function(){
					return false
				},
				init:function(pygame){
					this.get_init=function(){
						return true
					}
					var that2=this
					this.set_mode=function(size){
						var screen
						if(typeof(that2.get_surface)!="function"){
							screen=pygame.Surface(size)
							document.body.appendChild(screen.canvas)
							that2.get_surface=function(){
								return screen
							}
							screen.fill([0,0,0])
							return screen
						}
						screen=that2.get_surface()
						screen.width=size[0]
						screen.height=size[1]
						screen.fill([0,0,0])
						return screen
					}
					this.flip=this.update=function(){
						var suf=this.get_surface()
						var oco=suf.context.globalCompositeOperation
						suf.context.globalCompositeOperation="destination-over"
						suf.fill([0,0,0])
						suf.context.globalCompositeOperation=oco
					}
					this.set_caption=function(st){
						var ns=document.getElementsByTagName("title")
						if(ns.length==0){
							var nd=document.createElement("title")
							nd.textContent=st
							document.head.appendChild(nd)
						}else{
							ns[0].textContent=st
						}
					}
					this.get_caption=function(){
						var ns=document.getElementsByTagName("title")
						if(ns.length!=0)
							return ns[0].textContent
					}
					function toggleFullScreen(ele) {
						if (!document.fullscreenElement &&    // alternative standard method
							!document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
							if (ele.requestFullscreen) {
								ele.requestFullscreen();
							} else if (ele.mozRequestFullScreen) {
								ele.mozRequestFullScreen();
							} else if (ele.webkitRequestFullscreen) {
								ele.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
							}
							return true
						} else {
							if (document.cancelFullScreen) {
								document.cancelFullScreen();
							} else if (document.mozCancelFullScreen) {
								document.mozCancelFullScreen();
							} else if (document.webkitCancelFullScreen) {
								document.webkitCancelFullScreen();
							}
							return false
						}
					}
					this.toggle_fullscreen=function(){
						return toggleFullScreen(that2.get_surface().canvas)
					}
				}
			}
			this.time={
				init:function(pygame){
					this.delay=this.wait=function wait(time,callback){
						if(arguments.length==1){
							return new Promise(function(resolve,reject){
								wait(time,resolve)
							})
						}
						setTimeout(callback,time)
					}
					class Clock{
						tick(fps,callback){
							if(fps!=60)
								throw pygame.error("fps must be 60")
							if(arguments.length==1){
								return new Promise((function(resolve,reject){
									this.tick(fps,resolve)
								}).bind(this))
							}
							requestAnimationFrame(callback)
						}
						tick_busy_loop(fps,callback){
							return this.tick.apply(this,Array.from(arguments))
						}
						get_fps(){
							return 60
						}
					}
					this.Clock=wrapperConstructor.bind(null,Clock)
					var init_time=Date.now()
					this.get_ticks=function(){
						return Date.now()-init_time
					}
					var timers={}
					this.set_timer=function(eventid,time){
						if(time==0){
							clearInterval(timers[eventid])
						}else{
							timers[eventid]=setInterval(function(){
								pygame.event.push({type:eventid})
							},time)
						}
					}
				},
				get_ticks:function(){
					return 0
				}
			}
			this.font={
				init:function(pygame){
					var that2=this
					this.get_init=function(){
						return true
					}
					this.get_default_font=function(){
						return "sans-serif"
					}
					class Font{
						constructor(args){
							this.fontname=args[0]
							this.fontsize=args[1]
						}
						size(text){
							var context=document.createElement("canvas").getContext("2d")
							if(this.fontname==null)
								context.font=this.fontsize+"px "+that2.get_default_font()
							else
								context.font=this.fontsize+"px "+this.fontname
							context.textBaseline="top"
							return pygame.Rect(0,0,Math.max(Math.ceil(context.measureText(text).width),1),this.fontsize)
						}
						render(text,antialias,color,background){
							var rect=this.size(text)
							var suf=pygame.Surface([rect.w,rect.h])
							if(background!=null){
								suf.fill(background)
							}
							suf.context.save()
							if(this.fontname==null)
								suf.context.font=this.fontsize+"px "+that2.get_default_font()
							else
								suf.context.font=this.fontsize+"px "+this.fontname
							suf.context.textBaseline="top"
							color=that.Color.apply(that,color)
							suf.context.fillStyle="rgba("+color.r+","+color.g+","+color.b+","+color.a01+")"
							suf.context.fillText(text,0,0)
							suf.context.restore()
							return suf
						}
					}
					this.Font=wrapperConstructor.bind(null,Font)
				},
				get_init(){
					return false
				}
			}
			this.transform={
				init:function(pygame){
					this.flip2=function(suf,suf_source,xbool,ybool){
						var ctx=suf.context
						ctx.save()
						var dx,dy
						if(xbool)
							dx=-1
						else
							dx=1
						if(ybool)
							dy=-1
						else
							dy=1
						ctx.scale(dx,dy)
						ctx.globalCompositeOperation="copy"
						ctx.drawImage(suf_source.canvas,Math.min(0,suf.width*dx),Math.min(0,suf.height*dy))
						ctx.restore()
					}
					this.flip_ip=function(suf,xbool,ybool){
						this.flip2(suf,suf,xbool,ybool)
					}
					this.flip=function(suf,xbool,ybool){
						var new_suf=pygame.Surface([suf.width,suf.height])
						this.flip2(new_suf,suf,xbool,ybool)
						return new_suf
					}
					this.scale2=function(suf,suf_source,size,size_source){
						var dw=size[0]
						var dh=size[1]
						var ow=size_source[0]
						var oh=size_source[1]
						var rw=dw/ow
						var rh=dh/oh
						var ctx=suf.context
						ctx.save()
						ctx.scale(rw,rh)
						ctx.globalCompositeOperation="copy"
						ctx.drawImage(suf_source.canvas,0,0)
						ctx.restore()
					}
					//this.scale_ip=function(suf,size){
					//	var w=size[0]
					//	var h=size[1]
					//	var ow=suf.width
					//	var oh=suf.height
					//	suf.width=Math.max(ow,w)
					//	suf.height=Math.max(oh,h)
					//	this.scale2(suf,suf,size,[ow,oh])
					//	suf.width=w
					//	suf.height=h
					//}
					this.smoothscale=this.scale=function(suf,size,suf_dest){
						if(arguments.length!=3)
							suf_dest=pygame.Surface(size)
						this.scale2(suf_dest,suf,size,[suf.width,suf.height])
						return suf_dest
					}
					this.scale2x=function(suf,suf_dest){
						var arg=Array.from(arguments)
						arg.insert(1,[suf.width*2,suf.height*2])
						return this.scale.apply(this,arg)
					}
					this.mpwBlur_ip=function(suf,radius){
						lib.blur(suf.canvas,0,0,suf.width,suf.height,radius,1)
					}
					this.mpwBlur=function(suf,radius){
						var dest=suf.copy()
						this.mpwBlur_ip(dest,radius)
						return dest
					}
					this.rotate2=function(suf,suf_source,angle){
						suf.context.save()
						suf.context.globalCompositeOperation="copy"
						suf.context.translate(Math.round(suf.width/2),Math.round(suf.height/2))
						suf.context.rotate(-angle*Math.PI/180)
						suf.blit(suf_source,[suf_source.width/-2,suf_source.height/-2])
						suf.context.restore()
					}
					this.rotate=function(suf,angle){
						var w=suf.width
						var h=suf.height
						function sin(x){
							return Math.sin(x*Math.PI/180)
						}
						function cos(x){
							return Math.cos(x*Math.PI/180)
						}
						var agl=Math.abs(angle)
						if(agl>90){
							var la=90
							var bl=true
							while(la+90<=agl) la+=90,bl=!bl
							if(bl)
								agl=90-agl%la
							else
								agl=agl%la
						}
						var suf_dest=(function(angle){return pygame.Surface([Math.ceil(h*sin(angle)+w*cos(angle)),Math.ceil(w*sin(angle)+h*cos(angle))])})(agl)
						this.rotate2(suf_dest,suf,angle)
						return suf_dest
					}
					this.chop=function(suf,rect){
						rect=pygame.Rect.apply(null,rect)
						var suf_dest=suf.copy()
						suf_dest.context.clearRect(rect.x,rect.y,rect.w,rect.h)
						return suf_dest
					}
					this.laplacian=function(suf,suf_dest){
						if(arguments.length==1)
							suf_dest=pygame.Surface([suf.width,suf.height])
						var px=suf.context.getImageData(0,0,suf.width,suf.height)
						px=lib.lena.laplacian(px)
						suf_dest.context.putImageData(px,0,0)
						return suf_dest
					}
					this.mpwGrayscale=function(suf,suf_dest){
						if(arguments.length==1)
							suf_dest=pygame.Surface([suf.width,suf.height])
						var px=suf.context.getImageData(0,0,suf.width,suf.height)
						px=lib.lena.grayscale(px)
						suf_dest.context.putImageData(px,0,0)
						return suf_dest
					}
					this.mpwUnconventionalSharpen_ip=function(suf,alpha){
						var l2=this.laplacian(suf)
						suf.mpwSave()
						suf.context.globalAlpha=alpha
						suf.mpwBlitMode="soft-light"
						suf.blit(l2,[0,0])
						suf.mpwRestore()
					}
				}
			}
			this.mixer={
				get_init:function(){
					return false
				},
				init:function(pygame){
					this.get_init=function(){
						return true
					}
					var cnns=[]
					class Sound{
						constructor(args){
							var src=args[0]
							this.audioElement=document.createElement("audio")
							this.audioElement.src=src
							this.audioElement.preload="auto"
						}
						play(loops){
							if(arguments.length!=0&&loops!=-1)
								throw pygame.error("loops must be unset or -1")
							if(loops==-1)
								this.audioElement.loop=true
							else
								this.audioElement.loop=false
							cnns.push(this)
							this.audioElement.play()
							this.audioElement.addEventListener("ended",(function(){
								cnns.remove(this)
							}).bind(this))
						}
						pause(){
							this.audioElement.pause()
						}
						unpause(){
							this.audioElement.play()
						}
						rewind(){
							this.audioElement.currentTime=0
						}
						stop(){
							this.pause()
							this.rewind()
							cnns.remove(this)
						}
						get volume(){
							return this.audioElement.volume
						}
						set volume(x){
							this.audioElement.volume=x
						}
						get_volume(){
							return this.volume
						}
						set_volume(x){
							this.volume=x
						}
					}
					this.Sound=wrapperConstructor.bind(null,Sound)
					this.stop=function(){
						while(cnns.length)
							cnns[0].stop()
					}
					this.pause=function(){
						var s
						for(s of cnns)
							s.pause()
					}
					this.unpause=function(){
						var s
						for(s of cnns)
							s.unpause()
					}
					this.get_busy=function(){
						return cnns.length!=0
					}
				}
			}
			this.speech={
				get_init:function(){
					return false
				},
				init:function(pygame){
					this.get_init=function(){
						return true
					}
					this.speak=outside.speechSynthesis.speak.bind(outside.speechSynthesis)
					this.Utterance=function(text){
						return new outside.SpeechSynthesisUtterance(text)
					}
				}
			}
			this.preload=function preload(url,callback){
				if(arguments.length==1)
					return new Promise(function(resolve,reject){
						preload(url,resolve)
					})
				var req=new XMLHttpRequest()
				req.onload=function(e){
					var newurl=(URL||webkitURL).createObjectURL(new Blob([req.response]))
					callback(newurl)
				}
				req.open("GET",url,true)
				req.responseType="arraybuffer"
				req.send()
			}
		}
		init(){
			var key
			for(key in this)
				if(this.hasOwnProperty(key))
					if(this[key].hasOwnProperty("init"))
						if(typeof(this[key].init)=="function")
							this[key].init(this)
		}
	}
	outside.pygame=new Pygame()
})(window,{blur:(function(){
/*

StackBoxBlur - a fast almost Box Blur For Canvas

Version: 	0.3
Author:		Mario Klingemann
Contact: 	mario@quasimondo.com
Website:	http://www.quasimondo.com/
Twitter:	@quasimondo

In case you find this class useful - especially in commercial projects -
I am not totally unhappy for a small donation to my PayPal account
mario@quasimondo.de

Copyright (c) 2010 Mario Klingemann

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

var mul_table = [ 1,171,205,293,57,373,79,137,241,27,391,357,41,19,283,265,497,469,443,421,25,191,365,349,335,161,155,149,9,278,269,261,505,245,475,231,449,437,213,415,405,395,193,377,369,361,353,345,169,331,325,319,313,307,301,37,145,285,281,69,271,267,263,259,509,501,493,243,479,118,465,459,113,446,55,435,429,423,209,413,51,403,199,393,97,3,379,375,371,367,363,359,355,351,347,43,85,337,333,165,327,323,5,317,157,311,77,305,303,75,297,294,73,289,287,71,141,279,277,275,68,135,67,133,33,262,260,129,511,507,503,499,495,491,61,121,481,477,237,235,467,232,115,457,227,451,7,445,221,439,218,433,215,427,425,211,419,417,207,411,409,203,202,401,399,396,197,49,389,387,385,383,95,189,47,187,93,185,23,183,91,181,45,179,89,177,11,175,87,173,345,343,341,339,337,21,167,83,331,329,327,163,81,323,321,319,159,79,315,313,39,155,309,307,153,305,303,151,75,299,149,37,295,147,73,291,145,289,287,143,285,71,141,281,35,279,139,69,275,137,273,17,271,135,269,267,133,265,33,263,131,261,130,259,129,257,1];

var shg_table = [0,9,10,11,9,12,10,11,12,9,13,13,10,9,13,13,14,14,14,14,10,13,14,14,14,13,13,13,9,14,14,14,15,14,15,14,15,15,14,15,15,15,14,15,15,15,15,15,14,15,15,15,15,15,15,12,14,15,15,13,15,15,15,15,16,16,16,15,16,14,16,16,14,16,13,16,16,16,15,16,13,16,15,16,14,9,16,16,16,16,16,16,16,16,16,13,14,16,16,15,16,16,10,16,15,16,14,16,16,14,16,16,14,16,16,14,15,16,16,16,14,15,14,15,13,16,16,15,17,17,17,17,17,17,14,15,17,17,16,16,17,16,15,17,16,17,11,17,16,17,16,17,16,17,17,16,17,17,16,17,17,16,16,17,17,17,16,14,17,17,17,17,15,16,14,16,15,16,13,16,15,16,14,16,15,16,12,16,15,16,17,17,17,17,17,13,16,15,17,17,17,16,15,17,17,17,16,15,17,17,14,16,17,17,16,17,17,16,15,17,16,14,17,16,15,17,16,17,17,16,17,15,16,17,14,17,16,15,17,16,17,13,17,16,17,17,16,17,14,17,16,17,16,17,16,17,9];

return function stackBoxBlurCanvasRGBA( canvas, top_x, top_y, width, height, radius, iterations )
{
	if ( isNaN(radius) || radius < 1 ) return;
	radius |= 0;

	if ( isNaN(iterations) ) iterations = 1;
	iterations |= 0;
	if ( iterations > 3 ) iterations = 3;
	if ( iterations < 1 ) iterations = 1;

	var context = canvas.getContext("2d");
	var imageData;

	imageData = context.getImageData( top_x, top_y, width, height );

	var pixels = imageData.data;

	var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, a_sum,
	r_out_sum, g_out_sum, b_out_sum, a_out_sum,
	r_in_sum, g_in_sum, b_in_sum, a_in_sum,
	pr, pg, pb, pa, rbs;

	var div = radius + radius + 1;
	var w4 = width << 2;
	var widthMinus1  = width - 1;
	var heightMinus1 = height - 1;
	var radiusPlus1  = radius + 1;

	var stackStart = new BlurStack();

	var stack = stackStart;
	for ( i = 1; i < div; i++ )
	{
		stack = stack.next = new BlurStack();
		if ( i == radiusPlus1 ) var stackEnd = stack;
	}
	stack.next = stackStart;
	var stackIn = null;



	var mul_sum = mul_table[radius];
	var shg_sum = shg_table[radius];
	while ( iterations-- > 0 ) {
		yw = yi = 0;
		for ( y = height; --y > -1; )
		{
			r_sum = radiusPlus1 * ( pr = pixels[yi] );
			g_sum = radiusPlus1 * ( pg = pixels[yi+1] );
			b_sum = radiusPlus1 * ( pb = pixels[yi+2] );
			a_sum = radiusPlus1 * ( pa = pixels[yi+3] );

			stack = stackStart;

			for( i = radiusPlus1; --i > -1; )
			{
				stack.r = pr;
				stack.g = pg;
				stack.b = pb;
				stack.a = pa;
				stack = stack.next;
			}

			for( i = 1; i < radiusPlus1; i++ )
			{
				p = yi + (( widthMinus1 < i ? widthMinus1 : i ) << 2 );
				r_sum += ( stack.r = pixels[p]);
				g_sum += ( stack.g = pixels[p+1]);
				b_sum += ( stack.b = pixels[p+2]);
				a_sum += ( stack.a = pixels[p+3]);

				stack = stack.next;
			}

			stackIn = stackStart;
			for ( x = 0; x < width; x++ )
			{
				pixels[yi++] = (r_sum * mul_sum) >>> shg_sum;
				pixels[yi++] = (g_sum * mul_sum) >>> shg_sum;
				pixels[yi++] = (b_sum * mul_sum) >>> shg_sum;
				pixels[yi++] = (a_sum * mul_sum) >>> shg_sum;

				p =  ( yw + ( ( p = x + radius + 1 ) < widthMinus1 ? p : widthMinus1 ) ) << 2;

				r_sum -= stackIn.r - ( stackIn.r = pixels[p]);
				g_sum -= stackIn.g - ( stackIn.g = pixels[p+1]);
				b_sum -= stackIn.b - ( stackIn.b = pixels[p+2]);
				a_sum -= stackIn.a - ( stackIn.a = pixels[p+3]);

				stackIn = stackIn.next;

			}
			yw += width;
		}


		for ( x = 0; x < width; x++ )
		{
			yi = x << 2;

			r_sum = radiusPlus1 * ( pr = pixels[yi]);
			g_sum = radiusPlus1 * ( pg = pixels[yi+1]);
			b_sum = radiusPlus1 * ( pb = pixels[yi+2]);
			a_sum = radiusPlus1 * ( pa = pixels[yi+3]);

			stack = stackStart;

			for( i = 0; i < radiusPlus1; i++ )
			{
				stack.r = pr;
				stack.g = pg;
				stack.b = pb;
				stack.a = pa;
				stack = stack.next;
			}

			yp = width;

			for( i = 1; i <= radius; i++ )
			{
				yi = ( yp + x ) << 2;

				r_sum += ( stack.r = pixels[yi]);
				g_sum += ( stack.g = pixels[yi+1]);
				b_sum += ( stack.b = pixels[yi+2]);
				a_sum += ( stack.a = pixels[yi+3]);

				stack = stack.next;

				if( i < heightMinus1 )
				{
					yp += width;
				}
			}

			yi = x;
			stackIn = stackStart;
			for ( y = 0; y < height; y++ )
			{
				p = yi << 2;
				pixels[p+3] = pa =(a_sum * mul_sum) >>> shg_sum;
				if ( pa > 0 )
				{
					pa = 255 / pa;
					pixels[p]   = ((r_sum * mul_sum) >>> shg_sum ) * pa;
					pixels[p+1] = ((g_sum * mul_sum) >>> shg_sum ) * pa;
					pixels[p+2] = ((b_sum * mul_sum) >>> shg_sum ) * pa;
				} else {
					pixels[p] = pixels[p+1] = pixels[p+2] = 0
				}

				p = ( x + (( ( p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1 ) * width )) << 2;

				r_sum -= stackIn.r - ( stackIn.r = pixels[p]);
				g_sum -= stackIn.g - ( stackIn.g = pixels[p+1]);
				b_sum -= stackIn.b - ( stackIn.b = pixels[p+2]);
				a_sum -= stackIn.a - ( stackIn.a = pixels[p+3]);

				stackIn = stackIn.next;

				yi += width;
			}
		}
	}
	context.putImageData( imageData, top_x, top_y );

}

function BlurStack()
{
	this.r = 0;
	this.g = 0;
	this.b = 0;
	this.a = 0;
	this.next = null;
}
})(),lena:(function(){
/*
 *  lena-js - v0.0.1
 *  Library for image processing
 *  https://github.com/davidsonfellipe/lena-js/
 *
 *  Made by Davidson Fellipe
 *  Under MIT License
 */
var LenaJS = {};
LenaJS.convolution = function(pixels, weights) {

  var side = Math.round(Math.sqrt(weights.length)),
      halfSide = Math.floor(side/2),
      src = pixels.data,
      canvasWidth = pixels.width,
      canvasHeight = pixels.height,
      temporaryCanvas = document.createElement('canvas'),
      temporaryCtx = temporaryCanvas.getContext('2d'),
      outputData = temporaryCtx.createImageData(canvasWidth, canvasHeight);

  for (var y = 0; y < canvasHeight; y++) {

    for (var x = 0; x < canvasWidth; x++) {

      var dstOff = (y * canvasWidth + x) * 4,
          sumReds = 0,
          sumGreens = 0,
          sumBlues = 0,
          sumAlphas = 0;

      for (var kernelY = 0; kernelY < side; kernelY++) {
        for (var kernelX = 0; kernelX < side; kernelX++) {

          var currentKernelY = y + kernelY - halfSide,
              currentKernelX = x + kernelX - halfSide;

          if (currentKernelY >= 0 &&
              currentKernelY < canvasHeight &&
              currentKernelX >= 0 &&
              currentKernelX < canvasWidth) {

            var offset = (currentKernelY * canvasWidth + currentKernelX) * 4,
                weight = weights[kernelY * side + kernelX];

            sumReds += src[offset] * weight;
            sumGreens += src[offset + 1] * weight;
            sumBlues += src[offset + 2] * weight;
          }
        }
      }

      outputData.data[dstOff] = sumReds;
      outputData.data[dstOff+1] = sumGreens;
      outputData.data[dstOff+2] = sumBlues;
      outputData.data[dstOff+3] = 255;
    }
  }
  return outputData;
};
LenaJS.grayscale = function(pixels, args) {

  for (var i = 0; i < pixels.data.length; i += 4) {

    var r = pixels.data[i],
        g = pixels.data[i+1],
        b = pixels.data[i+2];

    pixels.data[i] = pixels.data[i+1] = pixels.data[i+2] = 0.2126*r + 0.7152*g + 0.0722*b;

  }

  return pixels;
};
LenaJS.laplacian = function(pixels, args) {

  var operator = [ 0, -1, 0,
                  -1, 4, -1,
                  0, -1, 0 ];

  return LenaJS.convolution(pixels, operator);
};
return LenaJS;
})()});
