'use strict';
 
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');

admin.initializeApp({
credential: admin.credential.applicationDefault(),
  databaseURL: 'ws://pro-ujxg.firebaseio.com/'

});
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }
function read (agent){
return admin.database().ref('data').once('value').then((snapshot) => {
    const value = snapshot.child('vecka1').val();
      if(value !== null){
          agent.add(`glosor för vecka 1 är ${value}`);
       
        }
    });


}
  function save(agent){
    const vecka1 = agent.parameters.vecka1;
    return admin.database().ref('data').set({
      Address: 'yes',
      vecka1: vecka1
    
    });
  }
 
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('getaddress', read);
  intentMap.set('savetodb', save);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
});
