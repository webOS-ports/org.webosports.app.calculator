#!/bin/bash
node enyo/tools/deploy.js -o deploy/org.webosports.app.calculator
adb push deploy/org.webosports.app.calculator /usr/palm/applications/org.webosports.app.calculator
read -p "Paused  Press [Enter] key to restart and End..."