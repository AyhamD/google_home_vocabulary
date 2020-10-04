'use strict'
// const functions = require('firebase-functions')
const express = require('express')
const { WebhookClient } = require('dialogflow-fulfillment')
// const { Suggestion, Text } = require('dialogflow-fulfillment')
const translate = require('@k3rn31p4nic/google-translate-api')
const { requestHttp } = require('request')
const app = express()

process.env.DEBUG = 'dialogflow:debug'
/* process.on('unhandledRejection', error => {
  // Will print "unhandledRejection err is not defined"
  console.log('unhandledRejection', error.message)
}) */
app.get('/', (req, res) => res.send('online'))
app.post('/dialogflow', express.json(), (req, res) => {
  const agent = new WebhookClient({ request: req, response: res })

  function fallback (agent) {
    agent.add('I didn\'t understand')
    agent.add('I\'m sorry, can you try again?')
  }
  function addVocabulary (agent) {
    agent.add('Hej, vilket språk lär du dig?')
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
    // var contextIn = agent.getContext('language')
    var lang = agent.parameters.language

    if (lang) {
      agent.setContext({ name: 'language', lifespan: 5, parameters: { lang: lang } })

      agent.add('okej ' + lang + ', säg 9 glosor som du vill lära dig med att säga redo i början')
    }
    // skärm ordet månad inkorg klocka penna miniräknare kupp kudde
    /* let text = new Text("");
   text.setSsml('<speak>' +
                   '<break time = "1"/>kod' + '<break time = "1"/> spion' + '<break time = "1"/>hund' +' <break time = "1"/>åska'+ ' <break time = "1"/>ballerina'+
               '</speak>');
    text.setText("kod"+ "spion");
    agent.add(text); */
    /* const text = new Text('')
    const word = ('kod', 'spion')
    text.setSsml('<speak>' +
          word.join('<break time = "1"/>') +
          '</speak>') */
    /* for(var i = 0; i<= word.length;i++){
        //agent.add(word[i]);
    text.setSsml('<speak>' +
                    '<break time = "1"/>' + word[i] +
                 '</speak>');

      agent.add(text);
    } */
    /* text.forEach(element => {
        text.setSsml('<speak>' +
                  '<break time = "1"/>' + element +
                  '</speak');
      agent.add(element);
  }); */

    /* const words = ['kod , spion , hund , åska , ballerina',
        'code, spy , dog , thunderstorm , ballerina']
      agent.add(words[langcode])
    } else {
      agent.add('error')
    } */
  }
  async function words (agent) {
    const arr = []
    var wordett = agent.parameters.any
    var wordtva = agent.parameters.any1
    var wordtre = agent.parameters.any2
    var wordfyra = agent.parameters.any3
    var wordfem = agent.parameters.any4
    var wordsex = agent.parameters.any5
    var wordsju = agent.parameters.any6
    var wordatta = agent.parameters.any7
    var wordnio = agent.parameters.any8
    if (wordett) {
      if (wordtva) {
        if (wordtre) {
          if (wordfyra) {
            if (wordfem) {
              if (wordsex) {
                if (wordsju) {
                  if (wordatta) {
                    if (wordnio) {
                      const arr2 = []
                      arr.push(wordett, wordtva, wordtre, wordfyra, wordfem, wordsex, wordsju, wordatta, wordnio)
                      agent.setContext({ name: 'words', lifespan: 5, parameters: { wordett: wordett, wordtva: wordtva, wordtre: wordtre, wordfyra: wordfyra, wordfem: wordfem, wordsex: wordsex, wordsju: wordsju, wordatta: wordatta, wordnio: wordnio } })
                      for (var i = 0; i < arr.length; i++) {
                        await translate(arr[i], { from: 'sv', to: 'en' }).then(res => {
                          arr2.push(res.text)
                        }).catch(err => {
                          console.error(err)
                        })
                      }
                      agent.add('Okej du har sagt ' + arr.join(','))
                      agent.add('Skriv ' + arr[0] + ' på engelska')
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  /* function WordsYes (agent) {
    const arr = []
    agent.add('Okej då börjar med ordet ' + arr[0])
    for (var i = 1; i <= arr.length; i++) {
      agent.add('nästa ' + arr[i])
      const ord = arr[i]
      var s = 0
      var results = ''
      for (var j = 1; j <= 100; j++) {
        results += ord.substring(s, j) + '   '
        s++
      }
      agent.add(results)
    }
  } */
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

    /* var contextIn = agent.getContext('testapp')
    var ord
    if (ord === agent.parameters.any || contextIn.parameters.ord) {
      agent.setContext({ name: 'testapp', lifespan: 5, parameters: { ord: ord } })
      await translate(ord, { to: 'en' }).then(res => {
        agent.add(res.text)
      }).catch(err => {
        agent.add(err)
      })
    } */
    /* var contextIn = agent.getContext('testapp')
    var ord = agent.parameters.any
    try {
      if (ord) {
        agent.setContext({ name: 'testapp', lifespan: 5, parameters: { ord: ord } })
        await translate(ord, { to: 'en' }).then(res => {
          agent.add(res.text)
        }).catch(err => {
          agent.add(err)
        })
      }
    } catch (error) {
      agent.add(error)
    } */

    /* await translate('bokstav', { to: 'en' }).then(res => {
      agent.add(res.text)
    }).catch(err => {
      agent.add(err)
    }) */
    /* var contextIn = agent.getContext('testapp')
    var ord = agent.parameters.any

    if (ord) {
      agent.setContext({ name: 'testapp', lifespan: 5, parameters: { ord: ord }})
      var i = 0
      var results = ''
      for (var j = 1; j <= ord.length; j++) {
        results += ord.substring(i, j) + '   '
        i++
      }
      agent.add(results)
    } */
    const word = ['kod', 'spion']

    agent.add(word.join())
  }

  async function translatee (agent) {
    var ord = agent.parameters.any
    if (ord) {
      agent.setContext({ name: 'translate', lifespan: 5, parameters: { ord: ord } })
      await translate(ord, { to: 'en' }).then(res => {
        agent.add(res.text)
      }).catch(err => {
        agent.add(err)
      })
    }
  }
  /* async function h (ord) {
    await translate(ord, { to: 'en' }).then(res => {
      agent.add(res.text)
    }).catch(err => {
      agent.add(err)
    })
  } */
  function spellingWord (agent) {
    var ord = agent.parameters.any
    if (ord) {
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
  intentMap.set('Start-form', addVocabulary)
  intentMap.set('veckor', voc)
  intentMap.set('valja-sprak', languagePick)
  intentMap.set('translate', translatee)
  intentMap.set('spell', spellingWord)
  intentMap.set('test', test)
  intentMap.set('Words', words)
  // intentMap.set('WordsYes', WordsYes)
  agent.handleRequest(intentMap)
})

module.exports = app
