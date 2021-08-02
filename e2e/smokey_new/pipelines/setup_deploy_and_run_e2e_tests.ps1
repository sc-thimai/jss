param ($baseurl, $apikey, $instancepath)
write-host "Using params $baseurl, $apikey, $instancepath"
cd ..\cypress-jss-cli-tests\
npm i
#npx cypress run --config baseUrl=$baseurl --spec .\cypress\integration\setup-and-deploy.spec.js --env APIKEY="$apikey",INSTANCE_PATH="$instancepath"


#TODO: jss start
cd ..\..\cypress\
npm i
npm run test

cd ..\wdio-ui-tests\
npm i
$env:APPNAME='etoereact'; npx wdio wdio.conf.js --baseUrl $baseurl --spec ./test/specs/experience-editor.spec.js
#TODO: JSS stop

#TODO: jss start
cd ..\..\cypress\
npm i
npm run test

cd ..\wdio-ui-tests\
npm i
#$env:APPNAME='etoeangular'; npx wdio wdio.conf.js --baseUrl $baseurl --spec ./test/specs/experience-editor.spec.js
#TODO: jss stop

#TODO: jss start
cd ..\..\cypress\
npm i
npm run test

cd ..\wdio-ui-tests\
npm i
#$env:APPNAME='etoevue'; npx wdio wdio.conf.js --baseUrl $baseurl --spec ./test/specs/experience-editor.spec.js
#TODO: jss stop

#TODO: jss start
cd ..\..\cypress\
npm i
npm run test

cd ..\wdio-ui-tests\
npm i
#$env:APPNAME='etoenextjs'; npx wdio wdio.conf.js --baseUrl $baseurl --spec ./test/specs/experience-editor.spec.js
#TODO: jss stop
