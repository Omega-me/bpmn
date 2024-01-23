import { Client, logger } from 'camunda-external-task-client-js';

const config = { baseUrl: 'http://localhost:8080/engine-rest', use: logger };

const client = new Client(config);

client.subscribe('dergo_feedback_finance', async function ({ task, taskService }) {
  console.log('Duke printuar feedback ne lidhje me kandidatin tek departamenti i finances...');
  setTimeout(() => {
    console.log('Feedback u dergua me sukses');
  }, 1000);

  await taskService.complete(task);
  client.unsubscribe();
});

client.subscribe('ruan_cv', async function ({ task, taskService }) {
  console.log('Duke ruajtur CV ne databaze...');
  setTimeout(() => {
    console.log('CV u ruajt ne databaze');
  }, 1000);

  await taskService.complete(task);
  client.unsubscribe();
});
