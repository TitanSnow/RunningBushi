// This is free and unencumbered software released into the public domain.
//
// Anyone is free to copy, modify, publish, use, compile, sell, or
// distribute this software, either in source code form or as a compiled
// binary, for any purpose, commercial or non-commercial, and by any
// means.
//
// In jurisdictions that recognize copyright laws, the author or authors
// of this software dedicate any and all copyright interest in the
// software to the public domain. We make this dedication for the benefit
// of the public at large and to the detriment of our heirs and
// successors. We intend this dedication to be an overt act of
// relinquishment in perpetuity of all present and future rights to this
// software under copyright law.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
// OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
// ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.
//
// For more information, please refer to <http://unlicense.org/>

addEventListener("load",async function(){
"use strict"
python.init()

//consts
var rangerImgFileName="ranger.gif"
var antmanImgFileName="antman.gif"
var shootImgFileName="shoot.gif"
var scrWidth=Math.floor(innerWidth)
var scrHeight=Math.floor(innerHeight)
var wRanger=32
var hRanger=32
var wAntman=16
var hAntman=16
var antMoveRate=[-8,0]
var wayRate=-4
var pDownRate=1
var wWay=64
var hWay=16
var hStepWay=32
var fps=60
var black=[0,0,0]
var white=[255,255,255]
var red=[255,0,0]
var tipHeight=16
var gameOverHeight=128
// Put your font's path next line!!!
var fontName=None
var coldDownTimeout=32
var rand1Fall=0.98
var rand2Fall=0.995
var randAntman=0.05
var wShoot=8
var hShoot=8
var shootRate=16
var tipText="ESC: exit  Space: start&jump  Enter: purge  S: shoot"
var coldDownTipText="Colddown"
var shootTipText="Silver Bullets: "
var hitWallTips=["A Great Wall!","Ouch!","Bang!","What A Nasty Scar!","Watch Out!","No Way!","Hurt!"]
var antEatTips=["Eaten by Ant!","Full Stomache! --Ant","Nothing Left","Ants Are Celebrating","Who Bit Me!","Standing at the Bottom of the Food Chain"]
var gameStartTipText="Space to Run!"
var gameOverTipText="\u2620"
var tip2Text="Press Space? Begin again."

//init
pygame.init()
var screen
var fakeScreen
function createWindow(){
	screen=pygame.display.set_mode([scrWidth,scrHeight])
	fakeScreen=pygame.Surface([scrWidth,scrHeight])
}
createWindow()

//import images
var imgs=await Promise.all([
	pygame.image.load(rangerImgFileName),
	pygame.image.load(antmanImgFileName),
	pygame.image.load(shootImgFileName)
])
var rangerImg=imgs[0]
var antmanImg=imgs[1]
var shootImg=imgs[2]

//functions
function getFont(name,size){
	return pygame.font.Font(name,size)
}
function getStatusTip(fps,score){
	return "fps: "+str(fps)+" Score: "+str(score)
}

while(True){
	//get clock
	let clock=pygame.time.Clock()

	//text
	let my_font=getFont(fontName,tipHeight)
	let tip=my_font.render(tipText,True,white)
	let coldDownTip=my_font.render(coldDownTipText,True,black)
	let rectTip=tip.get_rect()
	let shootTip=my_font.render(shootTipText,True,white)
	let rectShootTip=shootTip.get_rect()

	//ranger vars
	let xRanger=100
	let yRanger=0
	let ayRanger=0
	let startMoveRanger=False
	let cShoot=3

	//way
	let wayImg=pygame.Surface([wWay,scrHeight])
	wayImg.fill(white)
	let pWays=[]
	for(let x=0;x<scrWidth;x+=wWay)
		pWays.append([x,scrHeight-hWay])

	//antman
	let pAnts=[]

	//shoot
	let pShoot=[]

	//coldDown
	let coldDown=0

	//scope
	let scope=0

	//game end tip
	let gameEndTip=""

	//game start tip
	let gameStartTipImg=my_font.render(gameStartTipText,True,white)

	//main loop
	let realFrame=True
	while(True){
		//sleep
		await clock.tick(fps)

		//get fps
		let real_fps=pygame.performance.fps

		if(!realFrame){
			//draw fake frame
			screen.blit(fakeScreen,[0,0])
			pygame.display.update()
			realFrame=True
			continue
		}
		else
			realFrame=False

		//change coldDown
		if(coldDown>0)
			coldDown-=1

		//change scope
		if(startMoveRanger)
			scope+=1

		//ways
		if(startMoveRanger){
			for(let pway of pWays)
				pway[0]+=wayRate
			if(pWays[0][0]+wWay<0)
				pWays.shift()
		}
		if(pWays.at(-1)[0]+wWay<scrWidth){
			let rand=random.random()
			if(rand>rand1Fall){
				let thisWay=pWays.at(-1)
				pWays.append([pWays.at(-1)[0]+wWay,scrHeight+hRanger])
				if(rand>rand2Fall)
					pWays.append([pWays.at(-1)[0]+wWay,scrHeight+hRanger])
				pWays.append([pWays.at(-1)[0]+wWay,thisWay[1]])
			}else{
				let choices=None
				if(pWays.at(-1)[1]>=scrHeight-hStepWay)choices=[0,-1]
				else if(pWays.at(-1)[1]<=hStepWay+hRanger)choices=[0,1]
				else choices=[-1,0,1]
				pWays.append([pWays.at(-1)[0]+wWay,pWays.at(-1)[1]+random.choice(choices)*hStepWay])
				if(rand<randAntman){
					//add antman
					pAnts.append([pWays.at(-1)[0]+random.randint(0,wWay-wRanger),pWays.at(-1)[1]-hAntman,random.choice(antMoveRate),pWays.at(-1)[0]+4])
				}
			}
		}

		//move ranger
		let gameEnd=False
		let onWays=[]
		for(let pway of pWays){
			if((pway[0]+wWay>=xRanger&&xRanger>=pway[0]) || (pway[0]+wWay>=xRanger+wRanger&&xRanger+wRanger>=pway[0]))
				onWays.append(pway)
			if(onWays.len()==2)break
		}
		let maxhWay=-hRanger
		for(let pway of onWays)
			if(pway[1]<scrHeight-maxhWay)
				maxhWay=scrHeight-pway[1]
		if(yRanger+hRanger>scrHeight-maxhWay){
			gameEnd=True
			gameEndTip=random.choice(hitWallTips)
		}
		else if(yRanger+hRanger+ayRanger+pDownRate>=scrHeight-maxhWay){
			yRanger=scrHeight-maxhWay-hRanger
			ayRanger=0
		}
		else if(startMoveRanger){
			ayRanger+=pDownRate
			yRanger+=ayRanger
		}

		//move shoot
		for(let psh of pShoot){
			let breakaway=False
			for(let pant of pAnts){
				let x1=psh[0]
				let x2=pant[0]
				let y1=psh[1]
				let y2=pant[1]
				let w1=wShoot
				let w2=wAntman
				let h1=hShoot
				let h2=hAntman
				let ishitAnt=True
				if(x1>=x2 && x1>=x2+w2)ishitAnt=False
				else if(x1<=x2 && x1+w1<=x2)ishitAnt=False
				else if(y1>=y2 && y1>=y2+h2)ishitAnt=False
				else if(y1<=y2 && y1+h1<=y2)ishitAnt=False
				if(ishitAnt){
					pAnts.remove(pant)
					pShoot.remove(psh)
					breakaway=True
					cShoot+=2
					break
				}
			}
			if(breakaway)continue
			for(let pway of pWays){
				let x1=psh[0]
				let x2=pway[0]
				let y1=psh[1]
				let y2=pway[1]
				let w1=wShoot
				let w2=wWay
				let h1=hShoot
				let h2=scrHeight
				let ishitWall=True
				if(x1>=x2 && x1>=x2+w2)ishitWall=False
				else if(x1<=x2 && x1+w1<=x2)ishitWall=False
				else if(y1>=y2 && y1>=y2+h2)ishitWall=False
				else if(y1<=y2 && y1+h1<=y2)ishitWall=False
				if(ishitWall){
					pShoot.remove(psh)
					breakaway=True
					break
				}
			}
			if(breakaway)continue
			psh[0]+=shootRate
		}

		//move antman
		for(let pant of pAnts){
			pant[3]-=4
			pant[0]+=pant[2]
			if(pant[0]<pant[3])
				pant[2]=antMoveRate[1]
			else if(pant[0]+wAntman>pant[3]+wWay)
				pant[2]=antMoveRate[0]
			let x1=pant[0]
			let x2=xRanger
			let y1=pant[1]
			let y2=yRanger
			let w1=wAntman
			let w2=wRanger
			let h1=hAntman
			let h2=hRanger
			let isEat=True
			if(x1>=x2 && x1>=x2+w2)isEat=False
			else if(x1<=x2 && x1+w1<=x2)isEat=False
			else if(y1>=y2 && y1>=y2+h2)isEat=False
			else if(y1<=y2 && y1+h1<=y2)isEat=False
			if(isEat){
				gameEnd=True
				gameEndTip=random.choice(antEatTips)
			}
		}

		//get event
		for(let e of pygame.event.get()){
			if(e.type==KEYDOWN){
				if(e.key==K_SPACE){
					startMoveRanger=True
					if(yRanger+hRanger==scrHeight-maxhWay)
						ayRanger=-12
				}
				else if(e.key==K_RETURN){
					if(startMoveRanger && coldDown==0)
						screen.fill(red)
						pygame.display.update()
						for(let pway of pWays)
							pway[1]=scrHeight-hWay
						pAnts=[]
						await pygame.time.wait(1000)
						coldDown=coldDownTimeout*30
				}
				//shoot
				else if(e.key==K_s){
					if(startMoveRanger && cShoot>0){
						cShoot-=1
						pShoot.append([xRanger+wRanger,yRanger+hRanger-hAntman])
					}
				}
			}
			//resize
			else if(e.type==VIDEORESIZE){
				let rect=screen.get_rect()
				scrWidth=e.w
				scrHeight=e.h
				createWindow()
				for(let pway of pWays)
					pway[1]=Math.max(hRanger,pway[1]-rect.bottom+scrHeight)
				yRanger=Math.max(0,yRanger-rect.bottom+scrHeight)
				for(let psh of pShoot)
					psh[1]=Math.max(hRanger-hAntman,psh[1]-rect.bottom+scrHeight)
				for(let pant of pAnts)
					for(let pway of pWays)
						if(pant[3]==pway[0]){
							pant[1]=pway[1]-hAntman
							break
						}
			}
		}

		//draw
		screen.fill(black)
		fakeScreen.fill(black)
		screen.blit(tip,[scrWidth-rectTip.right,0])
		fakeScreen.blit(tip,[scrWidth-rectTip.right,0])
		let statusTip=my_font.render(getStatusTip(Math.floor(real_fps),scope),False,white)
		screen.blit(statusTip,[0,0])
		fakeScreen.blit(statusTip,[0,0])
		let coldDownImg=pygame.Surface([Math.floor(scrWidth/coldDownTimeout/30*coldDown),tipHeight])
		coldDownImg.fill(white)
		screen.blit(coldDownImg,[0,tipHeight])
		fakeScreen.blit(coldDownImg,[0,tipHeight])
		screen.blit(coldDownTip,[0,tipHeight])
		fakeScreen.blit(coldDownTip,[0,tipHeight])
		screen.blit(shootTip,[0,2*tipHeight])
		fakeScreen.blit(shootTip,[0,2*tipHeight])
		for(let i of range(cShoot)){
			screen.blit(shootImg,[rectShootTip.right+i*(wShoot+4),2*tipHeight+tipHeight/2-hShoot/2])
			fakeScreen.blit(shootImg,[rectShootTip.right+i*(wShoot+4),2*tipHeight+tipHeight/2-hShoot/2])
		}
		screen.blit(rangerImg,[xRanger,yRanger])
		fakeScreen.blit(rangerImg,[xRanger,yRanger])
		for(let pway of pWays){
			screen.blit(wayImg,pway)
			fakeScreen.blit(wayImg,[pway[0]+wayRate/2,pway[1]])
		}
		for(let pant of pAnts){
			screen.blit(antmanImg,pant)
			fakeScreen.blit(antmanImg,pant)
		}
		for(let pshoot of pShoot){
			screen.blit(shootImg,pshoot)
			fakeScreen.blit(shootImg,[pshoot[0]+shootRate/2,pshoot[1]])
		}
		if(!startMoveRanger){
			screen.blit(gameStartTipImg,[scrWidth/2-gameStartTipImg.get_rect().right/2,scrHeight/2-gameStartTipImg.get_rect().bottom/2])
			fakeScreen.blit(gameStartTipImg,[scrWidth/2-gameStartTipImg.get_rect().right/2,scrHeight/2-gameStartTipImg.get_rect().bottom/2])
		}
		pygame.display.update()

		//is game end?
		let rewhile=True
		if(gameEnd&&window.debugMode!==true){
			fakeScreen.blit(screen,[0,0])
			screen=pygame.display.set_mode([scrWidth,scrHeight])
			screen.blit(fakeScreen,[0,0])
			let textImg=getFont(fontName,gameOverHeight).render(gameOverTipText,True,red)
			let tipImg=my_font.render(gameEndTip,True,red)
			let tip2Img=my_font.render(tip2Text,True,white)
			screen.blit(textImg,[scrWidth/2-textImg.get_rect().right/2,scrHeight/2-textImg.get_rect().bottom/2])
			screen.blit(tipImg,[scrWidth/2-tipImg.get_rect().right/2,scrHeight/2+textImg.get_rect().bottom/2])
			screen.blit(tip2Img,[scrWidth/2-tip2Img.get_rect().right/2,scrHeight/2+textImg.get_rect().bottom/2+tipImg.get_rect().bottom])
			pygame.display.update()
			while(True){
				await pygame.time.wait(1000)
				for(let e of pygame.event.get()){
					if(e.type==KEYDOWN){
						if(e.key==K_SPACE)
							rewhile=False
					}
				}
				if(!rewhile)break
			}
			createWindow()
		}
		if(!rewhile)
			break
	}
}
})
