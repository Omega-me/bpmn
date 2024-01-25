import { Client, logger } from 'camunda-external-task-client-js';
// import mysql from 'mysql';

// var con = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '12345',
// });
// con.connect(function (err) {
//   if (err) throw err;
//   console.log('Connected!');
// });

const config = { baseUrl: 'http://localhost:8080/engine-rest', use: logger };
const client = new Client(config);

client.subscribe('ruan_cv', async function ({ task, taskService }) {
  const cv = task.variables.get('cv');
  // cv qe marrim nga aplikanti per ta ruajtur ne databaze
  console.log(cv);
  console.log('Duke ruajtur CV ne databaze...');
  setTimeout(() => {
    console.log(`${cv} u ruajt ne databaze`);
  }, 1000);

  await taskService.complete(task);
});

client.subscribe('dergo_feedback_finance', async function ({ task, taskService }) {
  console.log('Duke derguar feedback ne lidhje me kandidatin tek departamenti i finances...');
  setTimeout(() => {
    console.log('Feedback u dergua me sukses');
  }, 1000);

  await taskService.complete(task);
});
