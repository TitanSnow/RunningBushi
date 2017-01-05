#!/usr/bin/env python
import sys
if sys.version_info.major==3:
	raw_input=input
print("type path")
st="java="+raw_input("java=")+"\n"
st+="javac="+raw_input("javac=")+"\n"
st+="jar="+raw_input("jar=")+"\n"
st+="JYTHONROOT="+raw_input("JYTHONROOT=")+"\n"
st+="pack_dir=Package\n"
open("Makefile","w").writelines((st,open("Makefile.in").read()))
