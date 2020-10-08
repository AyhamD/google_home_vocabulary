'use strict'
// const functions = require('firebase-functions')
const express = require('express')
const { WebhookClient } = require('dialogflow-fulfillment')
const { Text } = require('dialogflow-fulfillment')
const translate = require('@k3rn31p4nic/google-translate-api')
const requestHttp = require('request')
const app = express()

process.env.DEBUG = 'dialogflow:debug'
/* process.on('unhandledRejection', error => {
  // Will print "unhandledRejection err is not defined"
  console.log('unhandledRejection', error.message)
}) */
app.get('/', (req, res) => res.send('online'))
app.post('/dialogflow', express.json(), (req, res) => {
  const agent = new WebhookClient({ request: req, response: res })
  let word = []

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
          var date = agent.parameters.any
          if (date) {
            agent.context.set({ name: 'veckorna', lifespan: 5, parameters: { date: date } })
            var nowWeek = getWeekNumber(new Date())
            var week = nowWeek[1].toString() - 1
            // console.log(body.vecka[week][week + 1].words)
            if (body.vecka[week][week + 1].words) {
              // console.log(body.vecka[week][week + 1].words)
              const arrWords = (body.vecka[week][week + 1].words).split(',')
              const enWord = arrWords.join(',')

              var englishword
              translatee1(enWord).then((res) => {
                // var result = '<break time = "3"/>du är nu klar med förhöret de rätta svaret är'
                // var sentences = '<speak>'+ result  + res.join('</prosody> <break time = "3"/> nästa ord <prosody rate="x-slow">') +  '</prosody> </speak>'
                // console.log(res)
                englishword = res
                agent.add(englishword)
              }).catch(err => {
                console.log(err)
              })

              // agent.add("börja med att skriva ordet " + arrWords[0] + " på engelska")
              const start = 'börja med att skriva ordet <prosody rate="x-slow">' + arrWords[0] + '</prosody> på engelska <break time = "3"/> nästa ord <prosody rate="x-slow">'
              const end = ' vill du träna på lyssna på engelska?'
              var splicesWord = arrWords
              splicesWord.splice(0, 1)
              var sentence = '<speak>' + start + splicesWord.join('</prosody> <break time = "3"/> nästa ord <prosody rate="x-slow">') + '<break time = "3"/>' + end + '</prosody> </speak>'

              // + '<speak>'+ 'du är nu klar med förhöret de rätta svaret är <break time = "3"/> <prosody rate="x-slow">' + englishword + '</prosody></speak> '

              const text = new Text('')
              text.setSsml(sentence)
              agent.add(text)
            } else {
              agent.add('error')
            }
            // agent.add('It\'s currently week ' + result[1] + ' of ' + result[0]);
          }
          return resolve()
        })
    })
  }
  function vecyes (agent) {
    return new Promise((resolve, reject) => {
      requestHttp({ url: 'http://studenter.miun.se/~mhda1800/writeable/app/json/Vocabulary-word.json', json: true },
        (error, response, body) => {
          if (error) {
            agent.add('OOPS! det gick inte att ansluta med server')
            return resolve()
          }
          var nowWeek = getWeekNumber(new Date())
          var week = nowWeek[1].toString() - 1
          // console.log(body.vecka[week][week + 1].words)
          if (body.vecka[week][week + 1].words) {
            // console.log(body.vecka[week][week + 1].words)
            const arrWords = (body.vecka[week][week + 1].words).split(',')
            const enWord = arrWords.join(',')
            let englishword = ' '
            englishword = (translatee1(enWord).then((res) => {
              /*var splicesWord = res
              splicesWord.splice(0, 1)
              var start = 'Okej då börjar jag med <prosody rate="x-slow"> ' + splicesWord[0] + '</prosody> <break time = "3"/> nästa ord <prosody rate="x-slow">'
              let sentences = '<speak>' + start + splicesWord.join('</prosody> <break time = "3"/> nästa ord <prosody rate="x-slow">') + '</prosody> </speak>'*/
              res = englishword
              //console.log(res)
              return engkishword
            }).catch(err => {
              agent.add(err)
            }))
            console.log(englishword + "asd")
            agent.add("asdaz")
            
          }
          return resolve()
        })
    })
  }
  /* function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  } */
  function languagePick (agent) {
    // var contextIn = agent.getContext('language')
    var lang = agent.parameters.language

    if (lang) {
      agent.context.set({ name: 'language', lifespan: 5, parameters: { lang: lang } })

      agent.add('okej ' + lang + ', säg alla glosor som du vill lära dig med att säga redo i början')
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
    var counter = 1
    var ord = agent.parameters.any
    if (ord) {
      agent.context.set({ name: 'testapp', lifespan: 5, parameters: { ord: ord } })
      word = ord.split(' ')
      // console.log(word[3])
      // arr.push(word)
      counter = word.length
      /* for (var i = 0; i < word.length; i++) {
        // results = ord.substring(i, " ") //first word
        // i = word
       text.setSsml('<speak>' +
                      '<break time = "1"/>' + word[i] +
                  '</speak>')
      } */
      // agent.add(arr.join() +'\t' + counter)
      console.log(word)
      await translate(word, { from: 'en', to: 'sv' }).then(res => {
        // agent.add(res.text)
        agent.add('du har lagt in ' + counter + ' glosor, vill du träna på lyssna och skriva')
      })
    }
    /* for(var i = 0; i < arr.length ;i++){
        agent.add(arr.join())
      }
      //agent.add(text + ' ' + counter)
    } */
    /* const arr = []
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
    } */
  }
  /* function spell (words = []) {
    var i = 0
    var results = ''
    for (var j = 1; j <= words.length; j++) {
      results += words.substring(i, j) + '   '
      i++
    }
    return results
  } */
  function WordsYes (agent) {
    /* agent.add('Okej då börjar med ordet ' + word[0])
    agent.add(spell(word[0]))
    for (var i = 1; i <= word.length; i++) {
      agent.add('nästa ' + word[i])
      agent.add(spell(word[i]))
    } */
    agent.add(word.join())
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
    /* const word = ['kod', 'spion']

    agent.add(word.join()) */
    // const arr = []
    // var results = ''
    /* let start = new Date()
    let date = ("0" + start.getDate()).slice(-2);
    let month = ("0" + (start.getMonth() + 1)).slice(-2);
    let week = date + 7
    agent.add('starting timer...' + date + "/" + month) */

  }
  function getWeekNumber (d) {
    // Copy date so don't modify original
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
    // Get first day of year
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
    // Return array of year and week number
    return [d.getUTCFullYear(), weekNo]
  }
  /* function getweek() {
    var onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
  } */
  async function translatee (agent) {
    var ord = agent.parameters.any
    if (ord) {
      agent.context.set({ name: 'translate', lifespan: 5, parameters: { ord: ord } })
      await translate(ord, { to: 'en' }).then(res => {
        agent.add(res.text)
      }).catch(err => {
        agent.add(err)
      })
    }
  }
  async function translatee1 (ord) {
    let resolve = ' '
    await translate(ord, { to: 'en' }).then(res => {
      resolve = res.text
    }).catch(err => {
      console.log(err)
    })
    return resolve
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
      agent.context.set({ name: 'spelling', lifespan: 5, parameters: { ord: ord } })
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
  intentMap.set('WordsYes', WordsYes)
  intentMap.set('veckor_yes', vecyes)
  agent.handleRequest(intentMap)
})

module.exports = app
