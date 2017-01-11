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

addEventListener("load",function(){
    "use strict"
    //consts
    var rangerImgFileName="ranger.gif"
    var antmanImgFileName="antman.gif"
    var shootImgFileName="shoot.gif"
    var scrWidth=800
    var scrHeight=600
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
    var fontName=null
    var coldDownTimeout=32
    var rand1Fall=0.98
    var rand2Fall=0.995
    var randAntman=0.05
    var wShoot=8
    var hShoot=8
    var shootRate=16

    //init
    pygame.init()
    var screen=pygame.display.set_mode([scrWidth,scrHeight])
    var fakeScreen=new pygame.Surface([scrWidth,scrHeight])

    //import images
    var c_load_img=3
    var rangerImg
    var antmanImg
    var shootImg
    pygame.image.load(rangerImgFileName,function(img){
        rangerImg=img
        if(--c_load_img==0)
            main()
    })
    pygame.image.load(antmanImgFileName,function(img){
        antmanImg=img
        if(--c_load_img==0)
            main()
    })
    pygame.image.load(shootImgFileName,function(img){
        shootImg=img
        if(--c_load_img==0)
            main()
    })

    function main(){
        //functions
        function getFont(name,size){
            return new pygame.font.Font(name,size)
        }

        ;(function times(){
            //get clock
            var clock=new pygame.time.Clock()

            //text
            var my_font=getFont(fontName,tipHeight)
            var tip=my_font.render("ESC: exit  Space: start&jump  Enter: purge  S: shoot",true,white)
            var coldDownTip=my_font.render("Colddown",true,black)
            var rectTip=tip.get_rect()
            var shootTip=my_font.render("Silver Bullets: ",true,white)
            var rectShootTip=shootTip.get_rect()

            //ranger vars
            var xRanger=100
            var yRanger=0
            var ayRanger=0
            var startMoveRanger=false
            var cShoot=3

            //way
            var wayImg=new pygame.Surface([wWay,scrHeight])
            wayImg.fill(white)
            var pWays=[]
            for(var x=0;x<scrWidth;x+=wWay)
                pWays.push([x,scrHeight-hWay])

            //antman
            var pAnts=[]

            //shoot
            var pShoot=[]

            //coldDown
            var coldDown=0

            //scope
            var scope=0

            //debug
            var lastChar=null
            var isReadyToDebug=false
            var debugMode=false

            //game end tip
            var gameEndTip=""
            var hitWallTips=["A Great Wall!","Ouch!","Bang!","What A Nasty Scar!","Watch Out!","No Way!","Hurt!"]
            var antEatTips=["Eaten by Ant!","Full Stomache! --Ant","Nothing Left","Ants Are Celebrating","Who Bit Me!","Standing at the Bottom of the Food Chain"]

            //game start tip
            var gameStartTipImg=my_font.render("Space to Run!",true,white)

            //main loop
            var realFrame=true
            ;(function main_loop(){
                function sleep(){
                    clock.tick(fps,main_loop)
                }
                if(!realFrame){
                    //draw fake frame
                    screen.blit(fakeScreen,[0,0])
                    pygame.display.update()
                    realFrame=true
                    sleep()
                    return
                }
                else
                    realFrame=false

                //change coldDown
                if(coldDown>0)
                    coldDown-=1

                //change scope
                if(startMoveRanger)
                    scope+=1

                //ways
                if(startMoveRanger){
                    pWays.forEach(function(pway){
                        pway[0]+=wayRate
                    })
                    if(pWays[0][0]+wWay<0)
                        pWays.shift()
                }
                if(pWays[pWays.length-1][0]+wWay<scrWidth){
                    var rand=random.random()
                    if(rand>rand1Fall){
                        var thisWay=pWays[pWays.length-1]
                        pWays.push([pWays[pWays.length-1][0]+wWay,scrHeight+hRanger])
                        if(rand>rand2Fall)
                            pWays.push([pWays[pWays.length-1][0]+wWay,scrHeight+hRanger])
                        pWays.push([pWays[pWays.length-1][0]+wWay,thisWay[1]])
                    }
                    else{
                        var choices=null
                        if(pWays[pWays.length-1][1]>=scrHeight-hStepWay)choices=[0,-1]
                        else if(pWays[pWays.length-1][1]<=hStepWay+hRanger)choices=[0,1]
                        else choices=[-1,0,1]
                        pWays.push([pWays[pWays.length-1][0]+wWay,pWays[pWays.length-1][1]+random.choice(choices)*hStepWay])
                        if(rand<randAntman){
                            //add antman
                            pAnts.push([pWays[pWays.length-1][0]+random.randint(0,wWay-wRanger),pWays[pWays.length-1][1]-hAntman,random.choice(antMoveRate),pWays[pWays.length-1][0]+4])
                        }
                    }
                }

                //move ranger
                var gameEnd=false
                var onWays=[]
                for(var i=0;i<pWays.length;++i){
                    var pway=pWays[i]
                    if((xRanger>=pway[0]&&xRanger<=pway[0]+wWay)||(xRanger+wRanger>=pway[0]&&xRanger+wRanger<=pway[0]+wWay))
                        onWays.push(pway)
                    if(onWays.length==2)break
                }
                var maxhWay=-hRanger
                onWays.forEach(function(pway){
                    if(pway[1]<scrHeight-maxhWay)
                        maxhWay=scrHeight-pway[1]
                })
                if(yRanger+hRanger>scrHeight-maxhWay){
                    gameEnd=true
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
                for(var i=0;i<pShoot.length;++i){
                    var psh=pShoot[i]
                    var breakaway=false
                    for(var i=0;i<pAnts.length;++i){
                        var pant=pAnts[i]
                        var x1=psh[0]
                        var x2=pant[0]
                        var y1=psh[1]
                        var y2=pant[1]
                        var w1=wShoot
                        var w2=wAntman
                        var h1=hShoot
                        var h2=hAntman
                        var ishitAnt=true
                        if(x1>=x2&&x1>=x2+w2)ishitAnt=false
                        else if(x1<=x2&&x1+w1<=x2)ishitAnt=false
                        else if(y1>=y2&&y1>=y2+h2)ishitAnt=false
                        else if(y1<=y2&&y1+h1<=y2)ishitAnt=false
                        if(ishitAnt){
                            pAnts.splice(pAnts.indexOf(pant),1)
                            pShoot.splice(pShoot.indexOf(psh),1)
                            breakaway=true
                            cShoot+=2
                            break
                        }
                    }
                    if(breakaway)continue
                    for(var i=0;i<pWays.length;++i){
                        var pway=pWays[i]
                        var x1=psh[0]
                        var x2=pway[0]
                        var y1=psh[1]
                        var y2=pway[1]
                        var w1=wShoot
                        var w2=wWay
                        var h1=hShoot
                        var h2=scrHeight
                        var ishitWall=true
                        if(x1>=x2&&x1>=x2+w2)ishitWall=false
                        else if(x1<=x2&&x1+w1<=x2)ishitWall=false
                        else if(y1>=y2&&y1>=y2+h2)ishitWall=false
                        else if(y1<=y2&&y1+h1<=y2)ishitWall=false
                        if(ishitWall){
                            pShoot.splice(pShoot.indexOf(psh),1)
                            breakaway=true
                            break
                        }
                    }
                    if(breakaway)continue
                    psh[0]+=shootRate
                }

                //move antman
                pAnts.forEach(function(pant){
                    pant[3]-=4
                    pant[0]+=pant[2]
                    if(pant[0]<pant[3])
                        pant[2]=antMoveRate[1]
                    else if(pant[0]+wAntman>pant[3]+wWay)
                        pant[2]=antMoveRate[0]
                    var x1=pant[0]
                    var x2=xRanger
                    var y1=pant[1]
                    var y2=yRanger
                    var w1=wAntman
                    var w2=wRanger
                    var h1=hAntman
                    var h2=hRanger
                    var isEat=true
                    if(x1>=x2&&x1>=x2+w2)isEat=false
                    else if(x1<=x2&&x1+w1<=x2)isEat=false
                    else if(y1>=y2&&y1>=y2+h2)isEat=false
                    else if(y1<=y2&&y1+h1<=y2)isEat=false
                    if(isEat){
                        gameEnd=true
                        gameEndTip=random.choice(antEatTips)
                    }
                })

                //get event
                var isReturn=false
                pygame.event.get().forEach(function(e){
                    if(e.type==QUIT)sys.exit()
                    else if(e.type==KEYDOWN){
                        if(e.key==K_ESCAPE)sys.exit()
                        else if(e.key==K_SPACE){
                            startMoveRanger=true
                            if(yRanger+hRanger==scrHeight-maxhWay)
                                ayRanger=-12
                        }
                        else if(e.key==K_RETURN){
                            if(startMoveRanger&&coldDown==0){
                                screen.fill(red)
                                pygame.display.update()
                                pWays.forEach(function(pway){
                                    pway[1]=scrHeight-hWay
                                })
                                pAnts=[]
                                coldDown=coldDownTimeout*30
                                pygame.time.wait(1000,main_loop)
                                isReturn=true
                            }
                        }

                        //shoot
                        else if(e.key==K_s){
                            if(startMoveRanger&&cShoot>0){
                                cShoot-=1
                                pShoot.push([xRanger+wRanger,yRanger+hRanger-hAntman])
                            }
                        }
                    }
                })
                if(isReturn) return

                //draw
                screen.fill(black)
                fakeScreen.fill(black)
                screen.blit(tip,[scrWidth-rectTip.right,0])
                fakeScreen.blit(tip,[scrWidth-rectTip.right,0])
                screen.blit(my_font.render("fps: "+parseInt(clock.get_fps())+" Score: "+scope,false,white),[0,0])
                fakeScreen.blit(my_font.render("fps: "+parseInt(clock.get_fps())+" Score: "+scope,false,white),[0,0])
                var coldDownImg=new pygame.Surface([parseInt(scrWidth/coldDownTimeout/30*coldDown),tipHeight])
                coldDownImg.fill(white)
                screen.blit(coldDownImg,[0,tipHeight])
                fakeScreen.blit(coldDownImg,[0,tipHeight])
                screen.blit(coldDownTip,[0,tipHeight])
                fakeScreen.blit(coldDownTip,[0,tipHeight])
                screen.blit(shootTip,[0,2*tipHeight])
                fakeScreen.blit(shootTip,[0,2*tipHeight])
                for(var i=0;i<cShoot;++i){
                    screen.blit(shootImg,[rectShootTip.right+i*(wShoot+4),2*tipHeight+Math.floor(tipHeight/2)-Math.floor(hShoot/2)])
                    fakeScreen.blit(shootImg,[rectShootTip.right+i*(wShoot+4),2*tipHeight+Math.floor(tipHeight/2)-Math.floor(hShoot/2)])
                }
                screen.blit(rangerImg,[xRanger,yRanger])
                fakeScreen.blit(rangerImg,[xRanger,yRanger])
                pWays.forEach(function(pway){
                    screen.blit(wayImg,pway)
                    fakeScreen.blit(wayImg,[pway[0]+Math.floor(wayRate/2),pway[1]])
                })
                pAnts.forEach(function(pant){
                    screen.blit(antmanImg,pant)
                    fakeScreen.blit(antmanImg,pant)
                })
                pShoot.forEach(function(pshoot){
                    screen.blit(shootImg,pshoot)
                    fakeScreen.blit(shootImg,[pshoot[0]+Math.floor(shootRate/2),pshoot[1]])
                })
                if(!startMoveRanger){
                    screen.blit(gameStartTipImg,[Math.floor(scrWidth/2)-Math.floor(gameStartTipImg.get_rect().right/2),Math.floor(scrHeight/2)-Math.floor(gameStartTipImg.get_rect().bottom/2)])
                    fakeScreen.blit(gameStartTipImg,[Math.floor(scrWidth/2)-Math.floor(gameStartTipImg.get_rect().right/2),Math.floor(scrHeight/2)-Math.floor(gameStartTipImg.get_rect().bottom/2)])
                }
                pygame.display.update()

                //is game end?
                var rewhile=true
                if(gameEnd&&!debugMode){
                    var textImg=getFont(fontName,gameOverHeight).render("GAME OVER",true,red)
                    var tipImg=my_font.render(gameEndTip,true,red)
                    var tip2Img=my_font.render("Press Space? Begin again.",true,white)
                    screen.blit(textImg,[Math.floor(scrWidth/2)-Math.floor(textImg.get_rect().right/2),Math.floor(scrHeight/2)-Math.floor(textImg.get_rect().bottom/2)])
                    screen.blit(tipImg,[Math.floor(scrWidth/2)-Math.floor(tipImg.get_rect().right/2),Math.floor(scrHeight/2)+Math.floor(textImg.get_rect().bottom/2)])
                    screen.blit(tip2Img,[Math.floor(scrWidth/2)-Math.floor(tip2Img.get_rect().right/2),Math.floor(scrHeight/2)+Math.floor(textImg.get_rect().bottom/2)+tipImg.get_rect().bottom])
                    pygame.display.update()
                    ;(function little_loop(){
                        pygame.event.get().forEach(function(e){
                            if(e.type==QUIT)sys.exit()
                            else if(e.type==KEYDOWN){
                                if(e.key==K_ESCAPE)sys.exit()
                                if(e.key==K_SPACE)
                                    rewhile=false
                            }
                        })
                        if(!rewhile){
                            times()
                            return
                        }
                        pygame.time.wait(1000,little_loop)
                    })()
                    return
                }
                if(!rewhile){
                    times()
                    return
                }

                //sleep
                sleep()
            })()
        })()
    }
})
