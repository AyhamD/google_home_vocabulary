const express = require('express')
const functions = require('firebase-functions')
const { WebhookClient } = require('dialogflow-fulfillment')
const { Suggestion } = require('dialogflow-fulfillment')
const translate = require('@k3rn31p4nic/google-translate-api')
// const translate = require('google-translate-api');
// const token = require('google-translate-token');
// const {Translate} = require('@google-cloud/translate').v2;
const { requestHttp } = require('request')
const app = express()

app.get('/', (req, res) => res.send('online'))
app.post('/dialogflow', express.json(), (req, res) => {
  const agent = new WebhookClient({ request: req, response: res })

  function fallback (agent) {
    agent.add('I didn\'t understand')
    agent.add('I\'m sorry, can you try again?')
  }
  function addVocabulary (agent) {
    agent.add('Hej, vilket språk lär du dig?')
    agent.add(new Suggestion('english'))
    agent.add(new Suggestion('svenska språket'))
  }
  function voc (agent) {
    return new Promise((resolve, reject) => {
      requestHttp({ url: 'http://studenter.miun.se/~mhda1800/writeable/app/json/Vocabulary-word.json', json: true },
        (error, response, body) => {
          if (error) {
            agent.add('OOPS! det gick inte att ansluta med server')
            return resolve()
          }
          var contextIn = agent.getContext('veckor')
          var ord
          if (ord === agent.parameters.date || contextIn.parameters.ord) {
            agent.setContext({ name: 'veckor', lifespan: 5, parameters: { ord: ord } })
          }
          return resolve()
        })
    })
  }
  function languagePick (agent) {
    var contextIn = agent.getContext('language')
    var lang
    var langcode = 0
    if (agent.locale === 'en') { langcode = 1 } else { langcode = 0 }
    if (lang === agent.parameters.language || contextIn.parameters.lang) {
      agent.setContext({ name: 'language', lifespan: 5, parameters: { lang: lang } })
      // agent.add("okej " + lang + " säga ord med ett pause emelan");
      /* let text = new Text("");
   text.setSsml('<speak>' +
                   '<break time = "1"/>kod' + '<break time = "1"/> spion' + '<break time = "1"/>hund' +' <break time = "1"/>åska'+ ' <break time = "1"/>ballerina'+
               '</speak>');
    text.setText("kod"+ "spion");
    agent.add(text); */
      // let text = new Text("");
      /* let word = ('kod' ,'spion');
    for(var i = 0; i<= word.length;i++){
        agent.add(word[i]);
    } */
      /* text.setSsml('<speak>' +
                    '<break time = "1"/>' +
                 '</speak>');

      agent.add(text); */

      /* text.forEach(element => {
        text.setSsml('<speak>' +
                  '<break time = "1"/>' + element +
                  '</speak');
      agent.add(element);
  }); */

      const words = ['kod , spion , hund , åska , ballerina',
        'code, spy , dog , thunderstorm , ballerina']
      agent.add(words[langcode])
    } else {
      agent.add('error')
    }
  }

  async function test (agent) {
    /* let text = new Text("");
  var word = "kod ,spoin";
  //for(var i = 0; i < 2; i++){
       text.setSsml('<speak>' +
              '<break time = "1"/>' + word +
              '</speak>');
      agent.add(text); */
    // var translator = require('google-translator');
    /* const projectID = 'vocabulary-uwbu';
  const translate = new Translate({projectID});
  async function quickstart(){
      const text = 'hey';
        const target = 'sv';
        const [translation] = await translate.translate(text, target);
        console.log(`Text: ${text}`);
        console.log(`Translation: ${translation}`);
  } */

    // }

    /* const text = 'hej'
    const target = 'en'
    return detectLanguage(agent, text, target).then(result => {
      agent.add('${result}')
    }) */

    await translate('hej', { to: 'en' }).then(res => {
      console.log(res.text) // OUTPUT: You are amazing!
      agent.add(res.text)
    }).catch(err => {
      console.log(err)
    })
  }

  function translatee (agent) {
  // const translate = new Translate();
    /* var contextIn = agent.getContext("translate");
  var ord;
  if(ord = agent.parameters.any || contextIn.parameters.ord){
      agent.setContext({name:"translate", lifespan:5 , parameters:{ord:ord}});
        agent.add(ord); */

    /* translator('en' , 'fr', 'hey', response=>{
          agent.add(response);
      }).catch(error=>{
          agent.add("error");
      }); */
    // }

    /* return new Promise ((resolve , reject) => {
      requestHttp({url:'http://studenter.miun.se/~mhda1800/writeable/app/json/package-lock.json', json:true},
        (error, response, body) =>{
          if(error){
              agent.add("OOPS! det gick inte att ansluta med server");
                return resolve();
          }
        if(body.googleTranslateApi){
             agent.add("asdasf");

        }else{
            agent.add("OOPS! det gick inte att hämta data");
        }
        return resolve();
      });
  }); */
  }
  function spellingWord (agent) {
    var contextIn = agent.getContext('spelling')
    var ord
    if (ord === agent.parameters.any || contextIn.parameters.ord) {
      agent.setContext({ name: 'spelling', lifespan: 5, parameters: { ord: ord } })
      var i = 0
      var results = ''
      for (var j = 1; j <= ord.length; j++) {
        results += ord.substring(i, j) + '   '
        i++
      }
      agent.add(results)
    }
  }
  /* async function detectLanguage (agent, text, target) {
    const translate = new Translate()
    const [translations] = await translate.translate(text, target)
    // translations = Array.isArray(translations) ? translations : [translations];
    agent.add('Translations:')
    translations.forEach((translation, i) => {
      agent.add(`${text[i]} => (${target}) ${translation}`)
    })
  } */

  const intentMap = new Map()
  intentMap.set('Default Fallback Intent', fallback)
  intentMap.set('Start', addVocabulary)
  intentMap.set('veckor', voc)
  intentMap.set('valja-sprak', languagePick)
  intentMap.set('translate', translatee)
  intentMap.set('spell', spellingWord)
  intentMap.set('test', test)
  agent.handleRequest(intentMap)
})

app.listen(process.env.PORT || 8080)
