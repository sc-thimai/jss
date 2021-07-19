param ($baseurl, $apikey, $instancepath)
write-host "Using params $baseurl, $apikey, $instancepath"
cd ..\cypress-jss-cli-tests\
#npx cypress run --config baseUrl=$baseurl --spec .\cypress\integration\setup-and-deploy.spec.js --env APIKEY="$apikey",INSTANCE_PATH="$instancepath"
cd ..\wdio-ui-tests\

$env:APPNAME='etoereact'; npx wdio wdio.conf.js --baseUrl $baseurl --spec ./test/specs/experience-editor.spec.js
#$env:APPNAME='etoeangular'; npx wdio wdio.conf.js --baseUrl $baseurl --spec ./test/specs/experience-editor.spec.js
#$env:APPNAME='etoevue'; npx wdio wdio.conf.js --baseUrl $baseurl --spec ./test/specs/experience-editor.spec.js
#$env:APPNAME='etoenextjs'; npx wdio wdio.conf.js --baseUrl $baseurl --spec ./test/specs/experience-editor.spec.js
