import { Client, logger } from 'camunda-external-task-client-js';

const config = { baseUrl: 'http://localhost:8080/engine-rest', use: logger };

const client = new Client(config);

client.subscribe('printo_kontraten', async function ({ task, taskService }) {
  console.log('Duke printuar kontraten...');
  setTimeout(() => {
    console.log('Kontrata u printua');
  }, 1000);

  await taskService.complete(task);
});
