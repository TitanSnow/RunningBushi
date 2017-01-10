#!/usr/bin/env jython
# coding:UTF-8
# This is free and unencumbered software released into the public domain.
#
# Anyone is free to copy, modify, publish, use, compile, sell, or
# distribute this software, either in source code form or as a compiled
# binary, for any purpose, commercial or non-commercial, and by any
# means.
#
# In jurisdictions that recognize copyright laws, the author or authors
# of this software dedicate any and all copyright interest in the
# software to the public domain. We make this dedication for the benefit
# of the public at large and to the detriment of our heirs and
# successors. We intend this dedication to be an overt act of
# relinquishment in perpetuity of all present and future rights to this
# software under copyright law.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
# EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
# MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
# IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
# OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
# ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
# OTHER DEALINGS IN THE SOFTWARE.
#
# For more information, please refer to <http://unlicense.org/>

from myimgbase64 import *
import pyj2d as pygame
from pyj2d.locals import *
import random
import base64
import StringIO
from java.lang import System

#consts
rangerImgFileName="ranger.gif"
antmanImgFileName="antman.gif"
shootImgFileName="shoot.gif"
scrWidth=800
scrHeight=600
wRanger=32
hRanger=32
wAntman=16
hAntman=16
antMoveRate=(-8,0)
wayRate=-4
pDownRate=1
wWay=64
hWay=16
hStepWay=32
fps=60
black=(0,0,0)
white=(255,255,255)
red=(255,0,0)
tipHeight=16
gameOverHeight=128
# Put your font's path next line!!!
fontName=None
coldDownTimeout=32
rand1Fall=0.98
rand2Fall=0.995
randAntman=0.05
wShoot=8
hShoot=8
shootRate=16

#init
pygame.init()
screen=pygame.display.set_mode((scrWidth,scrHeight))
fakeScreen=pygame.Surface((scrWidth,scrHeight))

#import images
def decodeMyBase64Img(b64):
    io=StringIO.StringIO()
    io.write(base64.b64decode(b64))
    io.seek(0)
    return pygame.image.load(io).convert_alpha()
if rangerBase64==None:rangerImg=pygame.image.load(rangerImgFileName).convert_alpha()
else:rangerImg=decodeMyBase64Img(rangerBase64)
if antmanBase64==None:antmanImg=pygame.image.load(antmanImgFileName).convert_alpha()
else:antmanImg=decodeMyBase64Img(antmanBase64)
if shootBase64==None:shootImg=pygame.image.load(shootImgFileName).convert_alpha()
else:shootImg=decodeMyBase64Img(shootBase64)

#functions
def is_equral_surface(a,b):
    a.lock()
    b.lock()
    if a.get_size()!=b.get_size():
        a.unlock()
        b.unlock()
        return False
    size=a.get_size()
    for x in range(0,size[0]):
        for y in range(0,size[1]):
            if a.get_at((x,y))!=b.get_at((x,y)):
                a.unlock()
                b.unlock()
                return False
    a.unlock()
    b.unlock()
    return True
def getFont(name,size):
    return pygame.font.Font(name,size)

while True:
    #get clock
    clock=pygame.time.Clock()

    #text
    my_font=getFont(fontName,tipHeight)
    tip=my_font.render("ESC: exit  Space: start&jump  Enter: purge  S: shoot",True,white)
    coldDownTip=my_font.render("Colddown",True,black)
    rectTip=tip.get_rect()
    shootTip=my_font.render("Silver Bullets: ",True,white)
    rectShootTip=shootTip.get_rect()

    #ranger vars
    xRanger=100
    yRanger=0
    ayRanger=0
    startMoveRanger=False
    cShoot=3

    #way
    wayImg=pygame.Surface((wWay,scrHeight))
    wayImg.fill(white)
    pWays=[]
    for x in range(0,scrWidth,wWay):
        pWays.append([x,scrHeight-hWay])

    #antman
    pAnts=[]

    #shoot
    pShoot=[]

    #coldDown
    coldDown=0

    #scope
    scope=0

    #debug
    lastChar=None
    isReadyToDebug=False
    debugMode=False

    #game end tip
    gameEndTip=""
    hitWallTips=("A Great Wall!","Ouch!","Bang!","What A Nasty Scar!","Watch Out!","No Way!","Hurt!")
    antEatTips=("Eaten by Ant!","Full Stomache! --Ant","Nothing Left","Ants Are Celebrating","Who Bit Me!","Standing at the Bottom of the Food Chain")

    #game start tip
    gameStartTipImg=my_font.render("Space to Run!",True,white)

    #main loop
    realFrame=True
    while True:
        #sleep
        clock.tick(fps)

        if not realFrame:
            #draw fake frame
            screen.blit(fakeScreen,(0,0))
            pygame.display.update()
            realFrame=True
            continue
        else:
            realFrame=False
        
        #change coldDown
        if coldDown>0:
            coldDown-=1
        
        #change scope
        if startMoveRanger:
            scope+=1
        
        #ways
        if startMoveRanger:
            for pway in pWays:
                pway[0]+=wayRate
            if pWays[0][0]+wWay<0:
                pWays=pWays[1:]
        if pWays[-1][0]+wWay<scrWidth:
            rand=random.random()
            if rand>rand1Fall:
                thisWay=pWays[-1]
                pWays.append([pWays[-1][0]+wWay,scrHeight+hRanger])
                if rand>rand2Fall:
                    pWays.append([pWays[-1][0]+wWay,scrHeight+hRanger])
                pWays.append([pWays[-1][0]+wWay,thisWay[1]])
            else:
                choices=None
                if pWays[-1][1]>=scrHeight-hStepWay:choices=(0,-1)
                elif pWays[-1][1]<=hStepWay+hRanger:choices=(0,1)
                else:choices=(-1,0,1)
                pWays.append([pWays[-1][0]+wWay,pWays[-1][1]+random.choice(choices)*hStepWay])
                if rand<randAntman:
                    #add antman
                    pAnts.append([pWays[-1][0]+random.randint(0,wWay-wRanger),pWays[-1][1]-hAntman,random.choice(antMoveRate),pWays[-1][0]+4])
        
        #move ranger
        gameEnd=False
        onWays=[]
        for pway in pWays:
            if (xRanger>=pway[0] and xRanger<=pway[0]+wWay) or (xRanger+wRanger>=pway[0] and xRanger+wRanger<=pway[0]+wWay):
                onWays.append(pway)
            if len(onWays)==2:break
        maxhWay=-hRanger
        for pway in onWays:
            if pway[1]<scrHeight-maxhWay:
                maxhWay=scrHeight-pway[1]
        if yRanger+hRanger>scrHeight-maxhWay:
            gameEnd=True
            gameEndTip=random.choice(hitWallTips)
        elif yRanger+hRanger+ayRanger+pDownRate>=scrHeight-maxhWay:
            yRanger=scrHeight-maxhWay-hRanger
            ayRanger=0
        elif startMoveRanger:
            ayRanger+=pDownRate
            yRanger+=ayRanger
            
        #move shoot
        for psh in pShoot:
            breakaway=False
            for pant in pAnts:
                x1=psh[0]
                x2=pant[0]
                y1=psh[1]
                y2=pant[1]
                w1=wShoot
                w2=wAntman
                h1=hShoot
                h2=hAntman
                ishitAnt=True
                if x1>=x2 and x1>=x2+w2:ishitAnt=False
                elif x1<=x2 and x1+w1<=x2:ishitAnt=False
                elif y1>=y2 and y1>=y2+h2:ishitAnt=False
                elif y1<=y2 and y1+h1<=y2:ishitAnt=False
                if ishitAnt:
                    pAnts.remove(pant)
                    pShoot.remove(psh)
                    breakaway=True
                    cShoot+=2
                    break
            if breakaway:continue
            for pway in pWays:
                x1=psh[0]
                x2=pway[0]
                y1=psh[1]
                y2=pway[1]
                w1=wShoot
                w2=wWay
                h1=hShoot
                h2=scrHeight
                ishitWall=True
                if x1>=x2 and x1>=x2+w2:ishitWall=False
                elif x1<=x2 and x1+w1<=x2:ishitWall=False
                elif y1>=y2 and y1>=y2+h2:ishitWall=False
                elif y1<=y2 and y1+h1<=y2:ishitWall=False
                if ishitWall:
                    pShoot.remove(psh)
                    breakaway=True
                    break
            if breakaway:continue
            psh[0]+=shootRate            
        
        #move antman
        for pant in pAnts:
            pant[3]-=4
            pant[0]+=pant[2]
            if pant[0]<pant[3]:
                pant[2]=antMoveRate[1]
            elif pant[0]+wAntman>pant[3]+wWay:
                pant[2]=antMoveRate[0]
            x1=pant[0]
            x2=xRanger
            y1=pant[1]
            y2=yRanger
            w1=wAntman
            w2=wRanger
            h1=hAntman
            h2=hRanger
            isEat=True
            if x1>=x2 and x1>=x2+w2:isEat=False
            elif x1<=x2 and x1+w1<=x2:isEat=False
            elif y1>=y2 and y1>=y2+h2:isEat=False
            elif y1<=y2 and y1+h1<=y2:isEat=False
            if isEat:
                gameEnd=True
                gameEndTip=random.choice(antEatTips)
        
        #get event
        for e in pygame.event.get():
            if e.type==QUIT:System.exit(0)
            elif e.type==KEYDOWN:
                if e.key==K_ESCAPE:System.exit(0)
                elif e.key==K_SPACE:
                    startMoveRanger=True
                    if yRanger+hRanger==scrHeight-maxhWay:
                        ayRanger=-12
                elif e.key==K_RETURN:
                    if startMoveRanger and coldDown==0:
                        screen.fill(red)
                        pygame.display.update()
                        for pway in pWays:
                            pway[1]=scrHeight-hWay
                        pAnts=[]
                        System.gc()
                        pygame.time.wait(1000)
                        coldDown=coldDownTimeout*30
                
                #debug
                elif e.key==K_d:
                    isReadyToDebug=True
                    lastChar=u'D'
                elif e.key==K_e:
                    if isReadyToDebug and lastChar==u'D':
                        lastChar=u'E'
                    else:
                        isReadyToDebug=False
                elif e.key==K_b:
                    if isReadyToDebug and lastChar==u'E':
                        lastChar=u'B'
                    else:
                        isReadyToDebug=False
                elif e.key==K_u:
                    if isReadyToDebug and lastChar==u'B':
                        lastChar=u'U'
                    else:
                        isReadyToDebug=False
                elif e.key==K_g:
                    if isReadyToDebug and lastChar==u'U':
                        debugMode=True
                    else:
                        isReadyToDebug=False
                elif e.key==K_n:
                    debugMode=False
                
                #shoot
                elif e.key==K_s:
                    if startMoveRanger and cShoot>0:
                        cShoot-=1
                        pShoot.append([xRanger+wRanger,yRanger+hRanger-hAntman])
        
        #draw
        screen.fill(black)
        fakeScreen.fill(black)
        screen.blit(tip,(scrWidth-rectTip.right,0))
        fakeScreen.blit(tip,(scrWidth-rectTip.right,0))
        screen.blit(my_font.render("fps: "+str(int(clock.get_fps()))+" Score: "+str(scope),False,white),(0,0))
        fakeScreen.blit(my_font.render("fps: "+str(int(clock.get_fps()))+" Score: "+str(scope),False,white),(0,0))
        coldDownImg=pygame.Surface((max(int(scrWidth*1.0/coldDownTimeout/30*coldDown),1),tipHeight))
        coldDownImg.fill(white)
        screen.blit(coldDownImg,(0,tipHeight))
        fakeScreen.blit(coldDownImg,(0,tipHeight))
        screen.blit(coldDownTip,(0,tipHeight))
        fakeScreen.blit(coldDownTip,(0,tipHeight))
        screen.blit(shootTip,(0,2*tipHeight))
        fakeScreen.blit(shootTip,(0,2*tipHeight))
        for i in range(0,cShoot):
            screen.blit(shootImg,(rectShootTip.right+i*(wShoot+4),2*tipHeight+tipHeight//2-hShoot//2))
            fakeScreen.blit(shootImg,(rectShootTip.right+i*(wShoot+4),2*tipHeight+tipHeight//2-hShoot//2))
        screen.blit(rangerImg,(xRanger,yRanger))
        fakeScreen.blit(rangerImg,(xRanger,yRanger))
        for pway in pWays:
            screen.blit(wayImg,pway)
            fakeScreen.blit(wayImg,(pway[0]+wayRate//2,pway[1]))
        for pant in pAnts:
            screen.blit(antmanImg,pant)
            fakeScreen.blit(antmanImg,pant)
        for pshoot in pShoot:
            screen.blit(shootImg,pshoot)
            fakeScreen.blit(shootImg,(pshoot[0]+shootRate//2,pshoot[1]))
        if not startMoveRanger:
            screen.blit(gameStartTipImg,(scrWidth//2-gameStartTipImg.get_rect().right//2,scrHeight//2-gameStartTipImg.get_rect().bottom//2))
            fakeScreen.blit(gameStartTipImg,(scrWidth//2-gameStartTipImg.get_rect().right//2,scrHeight//2-gameStartTipImg.get_rect().bottom//2))
        pygame.display.update()
        
        #is game end?
        rewhile=True
        if gameEnd and not debugMode:
            textImg=getFont(fontName,gameOverHeight).render("GAME OVER",True,red)
            tipImg=my_font.render(gameEndTip,True,red)
            tip2Img=my_font.render("Press Space? Begin again.",True,white)
            screen.blit(textImg,(scrWidth//2-textImg.get_rect().right//2,scrHeight//2-textImg.get_rect().bottom//2))
            screen.blit(tipImg,(scrWidth//2-tipImg.get_rect().right//2,scrHeight//2+textImg.get_rect().bottom//2))
            screen.blit(tip2Img,(scrWidth//2-tip2Img.get_rect().right//2,scrHeight//2+textImg.get_rect().bottom//2+tipImg.get_rect().bottom))
            pygame.display.update()
            System.gc()
            while True:
                pygame.time.wait(1000)
                for e in pygame.event.get():
                    if e.type==QUIT:System.exit(0)
                    elif e.type==KEYDOWN:
                        if e.key==K_ESCAPE:System.exit(0)
                        if e.key==K_SPACE:
                            rewhile=False
                if not rewhile:break
        if not rewhile:
            break
