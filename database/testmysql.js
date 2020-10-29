const mysql = require('mysql');

function connectToMysql(){
    const connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'glosor',
      password : '',
      database : 'sims1'
    });
    return new Promise((resolve,reject) => {
       connection.connect();
       resolve(connection);
    });
  }
 
  function queryDatabase(connection){
    return new Promise((resolve, reject) => {
      connection.query('SELECT * from sims1', (error, results, fields) => {
        resolve(results);
      });
    });
  }

   function AddDataTOMysql(connection, data){
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO sims1 SET ?', data, (error, results, fields) => {
        resolve(results);
      });
    });
  }

  function handleGetInfo(agent){
    const glosor_Id = agent.parameters.Id;
    return connectToMysql()
    .then(connection => {
      return queryDatabase(connection)
      .then(result => {
        console.log(result);
        result.map(glosor => {
          if(glosor_Id === glosor.Id){
            agent.add(`week number: ${glosor.week} and glosor: ${glosor.glosor}`);
          }
        });        
        connection.end();
      });
    });
  }

  function handleWrite(agent){
    const data = {
      week: "test",
      golosr: "glosor",
      Id: ""
    };
    return connectToMysql()
    .then(connection => {
      return AddDataTOMysql(connection, data)
      .then(result => {
  agent.add(`Data have been saved!`);      
        connection.end();
      });
    });
  }


  let intentMap = new Map();
  intentMap.set('getData', handleGetInfo);
  intentMap.set('writeData', handleWrite);
  agent.handleRequest(intentMap);
