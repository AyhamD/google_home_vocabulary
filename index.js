'use strict'
// const functions = require('firebase-functions')
const express = require('express')
const { WebhookClient } = require('dialogflow-fulfillment')
const { Text } = require('dialogflow-fulfillment')
const translate = require('@k3rn31p4nic/google-translate-api')
const requestHttp = require('request')
// const localStorage = require('node-localstorage')
const app = express()

process.env.DEBUG = 'dialogflow:debug'
/* process.on('unhandledRejection', error => {
  // Will print "unhandledRejection err is not defined"
  console.log('unhandledRejection', error.message)
}) */
app.get('/', (req, res) => res.send('online'))
app.post('/dialogflow', express.json(), (req, res) => {
  const agent = new WebhookClient({ request: req, response: res })
  // let word = []

  function fallback (agent) {
    agent.add('I didn\'t understand')
    agent.add('I\'m sorry, can you try again?')
  }
  function addVocabulary (agent) {
    agent.add('Okej, säg alla glosor med att säga redo i början?')
  }
  async function weekWords (agent) {
    /* return new Promise((resolve, reject) => {
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
              //const enWord = arrWords.join(',')
*/

    /* translatee1(enWord).then((res) => {
                // var result = '<break time = "3"/>du är nu klar med förhöret de rätta svaret är'
                // var sentences = '<speak>'+ result  + res.join('</prosody> <break time = "3"/> nästa ord <prosody rate="x-slow">') +  '</prosody> </speak>'
                // console.log(res)
                englishword = res
                agent.add(englishword)
              }).catch(err => {
                console.log(err)
              }) */

    // agent.add("börja med att skriva ordet " + arrWords[0] + " på engelska")
    const arrWords = await readWeeks()
    const arr = arrWords.split(',')
    const start = 'börja med att skriva ordet <prosody rate="x-slow">' + arr[0] + '</prosody> <break time = "5"/> nästa ord <prosody rate="x-slow">'
    const end = ' vill du träna på lyssna på engelska?'
    var splicesWord = arr
    splicesWord.splice(0, 1)
    var sentence = '<speak>' + start + splicesWord.join('</prosody> <break time = "5"/> nästa ord <prosody rate="x-slow">') + '<break time = "5"/>' + end + '</prosody> </speak>'

    // + '<speak>'+ 'du är nu klar med förhöret de rätta svaret är <break time = "3"/> <prosody rate="x-slow">' + englishword + '</prosody></speak> '

    const text = new Text('')
    text.setSsml(sentence)
    agent.add(text)
    /* } else {
              agent.add('error')
            }
            // agent.add('It\'s currently week ' + result[1] + ' of ' + result[0]);
          }
          return resolve()
        })
    }) */
  }
  function readDataTrain () {
    return new Promise((resolve, reject) => {
      requestHttp({ url: 'http://studenter.miun.se/~mhda1800/writeable/app/json/saveDate1.json', json: true },
        (error, response, body) => {
          if (error) {
            agent.add('OOPS! det gick inte att ansluta med server')
            return reject([])
          }
          var nowday = nowDay(new Date())
          var nowmonth = nowMonth(new Date())
          var day = nowday.toString()
          var month = nowmonth.toString() - 1
          if (body.days[month][month + 1][day - 1].word) {
            const arr = body.days[month][month + 1][day - 1].word
            return resolve(arr)
          }
          // console.log("asd")
          return resolve([])
        })
    })
  }
  function readDataExercise () {
    return new Promise((resolve, reject) => {
      requestHttp({ url: 'http://studenter.miun.se/~mhda1800/writeable/app/json/saveDate.json', json: true },
        (error, response, body) => {
          if (error) {
            agent.add('OOPS! det gick inte att ansluta med server')
            return reject([])
          }
          var nowday = nowDay(new Date())
          var nowmonth = nowMonth(new Date())
          var day = nowday.toString()
          var month = nowmonth.toString() - 1
          // console.log(body.vecka[week][week + 1].words)
          if (body.days[month][month + 1][day - 1].word) {
            const arr = body.days[month][month + 1][day - 1].word
            // console.log(arr)
            // console.log(body.vecka[week][week + 1].words)
            // const arrWords = (body.vecka[week][week + 1].words).split(',')
            // const enWord = arrWords.join(',')

            return resolve(arr)
          }
          // console.log("asd")
          return resolve([])
        })
    })
  }
  function readWeeks () {
    return new Promise((resolve, reject) => {
      requestHttp({ url: 'http://studenter.miun.se/~mhda1800/writeable/app/json/Vocabulary-word.json', json: true },
        (error, response, body) => {
          if (error) {
            agent.add('OOPS! det gick inte att ansluta med server')
            return reject([])
          }
          var nowWeek = getWeekNumber(new Date())
          var week = nowWeek[1].toString() - 1
          // console.log(body.vecka[week][week + 1].words)
          if (body.vecka[week][week + 1].words) {
            // console.log(body.vecka[week][week + 1].words)
            const arrWords = (body.vecka[week][week + 1].words).split(',')
            const enWord = arrWords.join(',')

            return resolve(enWord)
          }

          return resolve([])
        })
    })
  }
  async function weekyes (agent) {
    const words = await readWeeks()
    /* words.then((res)=>{
      translatee1(res)
      console.log(res.text)
    }).catch((error)=>{
      console.log(error)
    }) */
    var arr = []
    const res = await translatefunc(words)

    arr = res.split(',')
    // arr.push(res.text)
    // console.log(arr)
    const start = 'börja med att skriva ordet <prosody rate="x-slow">' + arr[0] + '</prosody> på engelska <break time = "5"/> nästa ord <prosody rate="x-slow">'
    // var splicesWord = arr
    var splicesWord = arr
    splicesWord.splice(0, 1)
    var sentence = '<speak>' + start + splicesWord.join('</prosody> <break time = "5"/> nästa ord <prosody rate="x-slow">') + '<break time = "5"/>' + '</prosody> </speak>'
    // console.log(words)
    const text = new Text('')
    text.setSsml(sentence)
    agent.add(text)
    /* return new Promise((resolve, reject) => {
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
            translatee1(enWord).then((res) => { */
    /* var splicesWord = res
              splicesWord.splice(0, 1)
              var start = 'Okej då börjar jag med <prosody rate="x-slow"> ' + splicesWord[0] + '</prosody> <break time = "3"/> nästa ord <prosody rate="x-slow">'
              let sentences = '<speak>' + start + splicesWord.join('</prosody> <break time = "3"/> nästa ord <prosody rate="x-slow">') + '</prosody> </speak>' */
    /* englishword = res.text
              //console.log(res)

            }).catch(err => {
              agent.add(err)
            })
            console.log(englishword)
          }
          return resolve()
        })
    }) */
  }
  /*function languagePick (agent) {
    var lang = agent.parameters.language

    if (lang) {
      agent.context.set({ name: 'language', lifespan: 5, parameters: { lang: lang } })

      agent.add('okej ' + lang + ', säg alla glosor som du vill lära dig med att säga redo i början')
    }*/
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
  //}
  async function words (agent) {
    var counter = 1
    var ord = agent.parameters.any
    if (ord) {
      agent.context.set({ name: 'word', lifespan: 5, parameters: { ord: ord } })
      const word = ord.split(' ')
      // console.log(word[3])
      // arr.push(word)
      counter = word.length
      let enWord = []
      /* for (var i = 0; i < word.length; i++) {
        // results = ord.substring(i, " ") //first word
        // i = word
       text.setSsml('<speak>' +
                      '<break time = "1"/>' + word[i] +
                  '</speak>')
      } */
      // agent.add(arr.join() +'\t' + counter)

      // const engkishWord = await translate(word, { from: 'sv', to: 'en' })
      const englishWord = await translatefunc(word)
      enWord = englishWord.split(' ')
      // console.log(enWord)

      // agent.add(res.text)

      const start = 'börja med att skriva ordet <prosody rate="x-slow">' + word[0] + '</prosody> <break time = "5"/> nästa ord <prosody rate="x-slow">'
      // var splicesWord = arr
      var splicesWord = word
      splicesWord.splice(0, 1)
      var sentence = '<speak>' + start + splicesWord.join('</prosody> <break time = "5"/> nästa ord <prosody rate="x-slow">') + '<break time = "5"/></prosody>som betyder på engelska<break time = "5"/><prosody rate="x-slow">' + enWord.join(' </prosody><break time = "5"/>  <prosody rate="x-slow">') + '</prosody> </speak>'
      agent.add('du har lagt in ' + counter + ' glosor')
      const text = new Text('')
      text.setSsml(sentence)
      agent.add(sentence)
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
  /* function WordsYes (agent) {
     agent.add('Okej då börjar med ordet ' + word[0])
    agent.add(spell(word[0]))
    for (var i = 1; i <= word.length; i++) {
      agent.add('nästa ' + word[i])
      agent.add(spell(word[i]))
    }
    agent.add(word.join())
  } */

  /*async function test (agent) {

  }*/
  function nowMonth (date) {
    date = new Date()
    var currentmonth = date.getMonth() + 1
    return currentmonth
  }
  function nowDay (date) {
    date = new Date()
    var currentday = date.getDate()
    return currentday
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
    var word = agent.parameters.any
    if (word) {
      agent.context.set({ name: 'translate', lifespan: 5, parameters: { word: word } })
      await translate(word, { to: 'en' }).then(res => {
        agent.add('Så här säger man ' + res.text + ' på engelska')
      }).catch(err => {
        agent.add(err)
      })
    }
  }
  async function translatefunc (word) {
    // let resolve = ' '
    /* translate(ord, { to: 'en' }).then(res => {
      resolve = res.text
      //console.log(resolve)
    }).catch(err => {
      console.log(err)
    }) */
    // console.log(resolve)
    // return resolve
    const res = await translate(word, { to: 'en' })
    // console.log(res.text)
    return res.text
  }
  /* async function h (ord) {
    await translate(ord, { to: 'en' }).then(res => {
      agent.add(res.text)
    }).catch(err => {
      agent.add(err)
    })
  } */
  function spellingWord (agent) {
    var word = agent.parameters.any
    if (word) {
      agent.context.set({ name: 'spelling', lifespan: 5, parameters: { word: word } })
      var i = 0
      var results = ''
      for (var j = 1; j <= word.length; j++) {
        results += word.substring(i, j) + '   '
        i++
      }
      agent.add(results)
    }
  }

  async function exercise (agent) {
    /* var word = agent.parameters.any
    if (word){
      agent.context.set({name: 'exercise', lifespan:5, parameters:{word:word}}) */
    var getdata = await readDataExercise()
    var w = getdata.split(', ')
    agent.add('Okej, idag ska du bokstavera ordet ' + w[0] + ' på engelska')

    // console.log(w[1])
  }
  async function exerciseword (agent) {
    var word = agent.parameters.any
    if (word) {
      agent.context.set({ name: 'exercise', lifespan: 5, parameters: { word: word } })
      var str = word.replace(/\s/g, '')
      var getdata = await readDataExercise()
      var w = getdata.split(', ')
      var endata = await translatefunc(w[0])
      if (str === endata) {
        agent.add('rätt svar bra jobbat vill du träna på nästa ord ')
      } else {
        var sentence = '<speak>fel svar. rätt svar är <prosody rate="slow">' + endata + '</prosody> </speak> vill du träna på nästa ord'
        var text = new Text('')
        text.setSsml(sentence)
        agent.add(text)
      }
    }
  }
  async function exercisewordyes(agent){
    var getdata = await readDataExercise()
    var w = getdata.split(', ')
    //var number = getRandomInt(w.length)
    //console.log(number)
    agent.add('Okej nästa ord är ' + w[1])
  }
  async function exerciseSecWord (agent) {
    var word = agent.parameters.any
    if (word) {
      agent.context.set({ name: 'exercise', lifespan: 5, parameters: { word: word } })
      var str = word.replace(/\s/g, '')
      var getdata = await readDataExercise()
      var w = getdata.split(', ')
      var endata = await translatefunc(w[1])
      if (str === endata) {
        agent.add('rätt svar bra jobbat vill du träna på nästa ord')
      } else {
        var sentence = '<speak>fel svar. rätt svar är <prosody rate="slow">' + endata + '</prosody> </speak>vill du träna på nästa ord'
        var text = new Text('')
        text.setSsml(sentence)
        agent.add(text)
      }
    }
  }
  async function exerciseSecWordyes(agent){
    var getdata = await readDataExercise()
    var w = getdata.split(', ')
    //var number = getRandomInt(w.length)
    //console.log(number)
    agent.add('Okej nästa ord är ' + w[2])
  }
  async function exerciseThrWord (agent) {
    var word = agent.parameters.any
    if (word) {
      agent.context.set({ name: 'exercise', lifespan: 5, parameters: { word: word } })
      var str = word.replace(/\s/g, '')
      var getdata = await readDataExercise()
      var w = getdata.split(', ')
      var endata = await translatefunc(w[2])
      if (str === endata) {
        agent.add('rätt svar bra jobbat vill du träna på nästa ord')
      } else {
        var sentence = '<speak>fel svar. rätt svar är <prosody rate="slow">' + endata + '</prosody> </speak>vill du träna på nästa ord'
        var text = new Text('')
        text.setSsml(sentence)
        agent.add(text)
      }
    }
  }
  async function exerciseforWordyes(agent){
    var getdata = await readDataExercise()
    var w = getdata.split(', ')
    //var number = getRandomInt(w.length)
    //console.log(number)
    agent.add('Okej nästa ord är ' + w[3])
  }
  async function exerciseForWord (agent) {
    var word = agent.parameters.any
    if (word) {
      agent.context.set({ name: 'exercise', lifespan: 5, parameters: { word: word } })
      var str = word.replace(/\s/g, '')
      var getdata = await readDataExercise()
      var w = getdata.split(', ')
      var endata = await translatefunc(w[3])
      if (str === endata) {
        agent.add('rätt svar bra jobbat vill du träna på nästa ord')
      } else {
        var sentence = '<speak>fel svar. rätt svar är <prosody rate="slow">' + endata + '</prosody> </speak>vill du träna på nästa ord'
        var text = new Text('')
        text.setSsml(sentence)
        agent.add(text)
      }
    }
  }
  async function exercisefifWordyes(agent){
    var getdata = await readDataExercise()
    var w = getdata.split(', ')
    //var number = getRandomInt(w.length)
    //console.log(number)
    agent.add('Okej nästa ord är ' + w[4])
  }
  async function exerciseFifWord (agent) {
    var word = agent.parameters.any
    if (word) {
      agent.context.set({ name: 'exercise', lifespan: 5, parameters: { word: word } })
      var str = word.replace(/\s/g, '')
      var getdata = await readDataExercise()
      var w = getdata.split(', ')
      var endata = await translatefunc(w[4])
      if (str === endata) {
        agent.add('rätt svar bra jobbat och det var alla ord för idag')
      } else {
        var sentence = '<speak>fel svar. rätt svar är <prosody rate="slow">' + endata + '</prosody> </speak> och det var alla ord för idag'
        var text = new Text('')
        text.setSsml(sentence)
        agent.add(text)
      }
    }
  }
  async function train (agent) {
    var getdata = await readDataTrain()
    agent.add('okej idag ska du träna på ordet ' + getdata + ' på engelska')
  }
  async function trainword (agent) {
    var word = agent.parameters.any
    if (word) {
      agent.context.set({ name: 'exercise', lifespan: 5, parameters: { word: word } })
      var getdata = await readDataTrain()
      var w = getdata.split(', ')
      var endata = await translatefunc(w[0])
      if (word === endata) {
        agent.add('rätt svar bra jobbat nästa ord är ' + w[1])
      } else {
        var sentence = '<speak>fel svar . rätt svar är <prosody rate="slow">' + endata + '</prosody> </speak> nästa ord är ' + w[1]
        var text = new Text('')
        text.setSsml(sentence)
        agent.add(text)
      }
    }
  }
  async function trainSecword (agent) {
    var word = agent.parameters.any
    if (word) {
      agent.context.set({ name: 'exercise', lifespan: 5, parameters: { word: word } })
      var getdata = await readDataTrain()
      var w = getdata.split(', ')
      var endata = await translatefunc(w[1])
      if (word === endata) {
        agent.add('rätt svar bra jobbat nästa ord är ' + w[2])
      } else {
        var sentence = '<speak>fel svar . rätt svar är <prosody rate="slow">' + endata + '</prosody> </speak> nästa ord är ' + w[2]
        var text = new Text('')
        text.setSsml(sentence)
        agent.add(text)
      }
    }
  }
  async function trainThword (agent) {
    var word = agent.parameters.any
    if (word) {
      agent.context.set({ name: 'exercise', lifespan: 5, parameters: { word: word } })
      var getdata = await readDataTrain()
      var w = getdata.split(', ')
      var endata = await translatefunc(w[2])
      if (word === endata) {
        agent.add('rätt svar bra jobbat och det var alla ord för idag ' )
      } else {
        var sentence = '<speak>fel svar . rätt svar är <prosody rate="slow">' + endata + '</prosody> </speak> och det var alla ord för idag ' 
        var text = new Text('')
        text.setSsml(sentence)
        agent.add(text)
      }
    }
  }
  /*function getRandomInt(max){
    return Math.floor(Math.random() * Math.floor(max))
  }*/
  /* function exercisewordspell (agent) {
    var word = agent.parameters.any
    if (word) {
      agent.context.set({ name: 'exercise', lifespan: 5, parameters: { word: word } })
      console.log(arr)
    }
  } */
  /* function read (agent) {
    return admin.database().ref('data').once('value').then((snapshot) => {
      const value = snapshot.child('vecka').val()
      if (value !== null) {
        agent.add(`your address is ${value}`)
      }
    })
  } */

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
  intentMap.set('vocabulary', addVocabulary)
  intentMap.set('weekWords', weekWords)
  //intentMap.set('valja-sprak', languagePick)
  intentMap.set('translate', translatee)
  intentMap.set('spelling', spellingWord)
  //intentMap.set('test', test)
  intentMap.set('Words', words)
  // intentMap.set('WordsYes', WordsYes)
  intentMap.set('veckor_yes', weekyes)
  intentMap.set('exercise', exercise)
  intentMap.set('exerciseword', exerciseword)
  intentMap.set('train', train)
  intentMap.set('trainword', trainword)
  intentMap.set('exerciseSecWord', exerciseSecWord)
  intentMap.set('exercisewordyes',exercisewordyes)
  intentMap.set('exerciseSecWordyes', exerciseSecWordyes)
  intentMap.set('exerciseThrWord',exerciseThrWord)
  intentMap.set('exerciseforWordyes', exerciseforWordyes)
  intentMap.set('exerciseForWord',exerciseForWord)
  intentMap.set('exercisefifWordyes', exercisefifWordyes)
  intentMap.set('exerciseFifWord',exerciseFifWord)
  intentMap.set('trainSecword',trainSecword)
  intentMap.set('trainThword',trainThword)
  // intentMap.set('exercisewordspell', exercisewordspell)
  // intentMap.set('get', read)
  agent.handleRequest(intentMap)
})

module.exports = app
