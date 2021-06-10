# Introduction 
JSS Cypress Automation
# Getting Started
1.	run `$npm i`
2.	use cypress.json to update baseUrl, USERNAME, PASSWORD

# Run Tests
1. Using gui, `npm run open`

2. Using cmdline,
    - to run specific file `npx cypress run --spec .\cypress\integration\example.spec.js`
    - to run all `npx cypress run`
    - to run with different baseUrl `npm run open --config baseUrl=https://sc102xp0cm`
    - to run with env var `npm run open -- --config baseUrl=https://sc102xp0cm --env foo="hello"`
    - to run with teamcity reporter `npm run open -- --config baseUrl=https://sc102xp0cm --reporter cypress-teamcity-reporter`

3. run cypress containerized
    1.  cypress is only supported for linux containers and sitecore container setup is only supported for windows containers. To resolve, still use docker window containers, open docker desktop, go to docker engine settings, add `"experimental": true` 
    2. run `ngrok http -host-header=cm.jssdev.localhost 443` in cmd prompt
    3. update docker-compose.yml CYPRESS_baseUrl value to the output from ngrok cmd above 
    4. `docker-compose up`
  
