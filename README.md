# akala-mobile
Akala Mobile Project

## Setup Guide
1. Import as Jetbrain WebStorem 9 Projects
2. Install nodejs runtime
3. Run <font style='color:red'>node install -g gulp ionic cordova</font>
4. Run <font style='color:red'>npm install</font> in base folder to install node modules
5. Run <font style='color:red'>gulp install</font> in base folder to install bower components
6. Run <font style='color:red'>gulp bower_dev</font> in base folder to generate 3 part lib folder
7. Run <font style='color:red'>gulp config_dev</font> in base folder to generate config file

## Run in Browser
1. Disable Chrome's web security , by add the param <font style='color:red'>--disable-web-security</font> in shortcut of chrome<br>
also can install Chrome plugin https://github.com/vitvad/Access-Control-Allow-Origin
2. Run <font style='color:red'>ionic serve</font> in base folder

## Run in Android
1. Run <font style='color:red'>ionic platform add android</font> in base folder
1. Run <font style='color:red'>ionic run</font> in base folder