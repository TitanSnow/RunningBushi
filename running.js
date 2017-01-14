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
    let rangerImgFileName="ranger.gif"
    let antmanImgFileName="antman.gif"
    let shootImgFileName="shoot.gif"
    let scrWidth=800
    let scrHeight=600
    let wRanger=32
    let hRanger=32
    let wAntman=16
    let hAntman=16
    let antMoveRate=[-8,0]
    let wayRate=-4
    let pDownRate=1
    let wWay=64
    let hWay=16
    let hStepWay=32
    let fps=60
    let black=[0,0,0]
    let white=[255,255,255]
    let red=[255,0,0]
    let tipHeight=16
    let gameOverHeight=128
    // Put your font's path next line!!!
    let fontName=null
    let coldDownTimeout=32
    let rand1Fall=0.98
    let rand2Fall=0.995
    let randAntman=0.05
    let wShoot=8
    let hShoot=8
    let shootRate=16

    //init
    pygame.init()
    let screen=pygame.display.set_mode([scrWidth,scrHeight])
    let fakeScreen=new pygame.Surface([scrWidth,scrHeight])

    //import images
    let c_load_img=3
    let rangerImg
    let antmanImg
    let shootImg
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
            let clock=new pygame.time.Clock()

            //text
            let my_font=getFont(fontName,tipHeight)
            let tip=my_font.render("Tap, Press, Swipe!",true,white)
            let coldDownTip=my_font.render("Colddown",true,black)
            let rectTip=tip.get_rect()
            let shootTip=my_font.render("Silver Bullets: ",true,white)
            let rectShootTip=shootTip.get_rect()

            //ranger vars
            let xRanger=100
            let yRanger=0
            let ayRanger=0
            let startMoveRanger=false
            let cShoot=3

            //way
            let wayImg=new pygame.Surface([wWay,scrHeight])
            wayImg.fill(white)
            let pWays=[]
            for(let x=0;x<scrWidth;x+=wWay)
                pWays.push([x,scrHeight-hWay])

            //antman
            let pAnts=[]

            //shoot
            let pShoot=[]

            //coldDown
            let coldDown=0

            //scope
            let scope=0

            //debug
            let lastChar=null
            let isReadyToDebug=false
            let debugMode=false

            //game end tip
            let gameEndTip=""
            let hitWallTips=["A Great Wall!","Ouch!","Bang!","What A Nasty Scar!","Watch Out!","No Way!","Hurt!"]
            let antEatTips=["Eaten by Ant!","Full Stomache! --Ant","Nothing Left","Ants Are Celebrating","Who Bit Me!","Standing at the Bottom of the Food Chain"]

            //game start tip
            let gameStartTipImg=my_font.render("Tap to Run!",true,white)

            //main loop
            let realFrame=true
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
                    let rand=random.random()
                    if(rand>rand1Fall){
                        let thisWay=pWays[pWays.length-1]
                        pWays.push([pWays[pWays.length-1][0]+wWay,scrHeight+hRanger])
                        if(rand>rand2Fall)
                            pWays.push([pWays[pWays.length-1][0]+wWay,scrHeight+hRanger])
                        pWays.push([pWays[pWays.length-1][0]+wWay,thisWay[1]])
                    }
                    else{
                        let choices=null
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
                let gameEnd=false
                let onWays=[]
                for(let i=0;i<pWays.length;++i){
                    let pway=pWays[i]
                    if((xRanger>=pway[0]&&xRanger<=pway[0]+wWay)||(xRanger+wRanger>=pway[0]&&xRanger+wRanger<=pway[0]+wWay))
                        onWays.push(pway)
                    if(onWays.length==2)break
                }
                let maxhWay=-hRanger
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
                for(let i=0;i<pShoot.length;++i){
                    let psh=pShoot[i]
                    let breakaway=false
                    for(let i=0;i<pAnts.length;++i){
                        let pant=pAnts[i]
                        let x1=psh[0]
                        let x2=pant[0]
                        let y1=psh[1]
                        let y2=pant[1]
                        let w1=wShoot
                        let w2=wAntman
                        let h1=hShoot
                        let h2=hAntman
                        let ishitAnt=true
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
                    for(let i=0;i<pWays.length;++i){
                        let pway=pWays[i]
                        let x1=psh[0]
                        let x2=pway[0]
                        let y1=psh[1]
                        let y2=pway[1]
                        let w1=wShoot
                        let w2=wWay
                        let h1=hShoot
                        let h2=scrHeight
                        let ishitWall=true
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
                    let x1=pant[0]
                    let x2=xRanger
                    let y1=pant[1]
                    let y2=yRanger
                    let w1=wAntman
                    let w2=wRanger
                    let h1=hAntman
                    let h2=hRanger
                    let isEat=true
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
                let isReturn=false
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
                                realFrame=true
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
                    else if(e.type==RESIZE){
                        let rect=screen.get_rect()
                        pygame.display.resize([innerWidth,innerHeight])
                        scrWidth=innerWidth
                        scrHeight=innerHeight
                        pWays.forEach(function(pway){
                            pway[1]=Math.max(hRanger,pway[1]-rect.bottom+scrHeight)
                        })
                        yRanger=Math.max(0,yRanger-rect.bottom+scrHeight)
                        pShoot.forEach(function(psh){
                            psh[1]=Math.max(hRanger-hAntman,psh[1]-rect.bottom+scrHeight)
                        })
                        pAnts.forEach(function(pant){
                            for(let i=0;i<pWays.length;++i)
                                if(pant[3]==pWays[i][0]){
                                    pant[1]=pWays[i][1]-hAntman;
                                    return;
                                }
                        })
                    }
                })
                if(isReturn) return

                //draw
                screen.fill(black)
                fakeScreen.fill(black)
                screen.blit(tip,[scrWidth-rectTip.right,0])
                fakeScreen.blit(tip,[scrWidth-rectTip.right,0])
                screen.blit(my_font.render("fps: "+Math.floor(clock.get_fps())+" Score: "+scope,false,white),[0,0])
                fakeScreen.blit(my_font.render("fps: "+Math.floor(clock.get_fps())+" Score: "+scope,false,white),[0,0])
                let coldDownImg=new pygame.Surface([Math.max(Math.floor(scrWidth/coldDownTimeout/30*coldDown),1),tipHeight])
                coldDownImg.fill(white)
                screen.blit(coldDownImg,[0,tipHeight])
                fakeScreen.blit(coldDownImg,[0,tipHeight])
                screen.blit(coldDownTip,[0,tipHeight])
                fakeScreen.blit(coldDownTip,[0,tipHeight])
                screen.blit(shootTip,[0,2*tipHeight])
                fakeScreen.blit(shootTip,[0,2*tipHeight])
                for(let i=0;i<cShoot;++i){
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
                let rewhile=true
                if(gameEnd&&!debugMode){
                    let textImg=getFont(fontName,gameOverHeight).render("☠",true,red)
                    let tipImg=my_font.render(gameEndTip,true,red)
                    let tip2Img=my_font.render("Press Space? Begin again.",true,white)
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
                            }else{
                                pygame.event.push(e)
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
