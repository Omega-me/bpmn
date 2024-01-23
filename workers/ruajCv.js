import { Client, logger } from 'camunda-external-task-client-js';

const config = { baseUrl: 'http://localhost:8080/engine-rest', use: logger };

const client = new Client(config);

client.subscribe('ruan_cv', async function ({ task, taskService }) {
  console.log('Duke ruajtur CV ne databaze...');
  setTimeout(() => {
    console.log('CV u ruajt ne databaze');
  }, 1000);

  await taskService.complete(task);
});
