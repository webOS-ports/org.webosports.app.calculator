@REM don't watch the sausage being made
@ECHO OFF

REM the folder this script is in (*/bootplate/tools)
SET TOOLS=%~DP0

REM enyo location
SET ENYO=%TOOLS%\..\enyo

REM deploy script location
SET DEPLOY=%ENYO%\tools\deploy.js

REM node location
SET NODE=node.exe

REM use node to invoke deploy.js with imported parameters
%NODE% "%DEPLOY%" %*

SET BIN=%TOOLS%\..\bin
mkdir %BIN%

copy appinfo.json deploy\org.webosports.app.calculator
call palm-package deploy\org.webosports.app.calculator -o %BIN%