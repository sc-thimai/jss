ECHO OFF
start /B npm run deploy ^&^& cd ..\\..\\samples\\nextjs ^&^& jss start:connected
start /B wait-on http://localhost:3000 ^&^& npm run test
PAUSE
