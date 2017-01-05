#!/usr/bin/env python2
import base64
fout=open("myimgbase64.py","w")
fout.writelines((
	"antmanBase64='"+base64.b64encode(open("antman.gif","rb").read())+"'\n",
	"rangerBase64='"+base64.b64encode(open("ranger.gif","rb").read())+"'\n",
	"shootBase64='"+base64.b64encode(open("shoot.gif","rb").read())+"'\n"
))
