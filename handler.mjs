// handler.js (después con ESM)
import awsServerlessExpress from 'aws-serverless-express';
import app from './src/app.js';  // Asegúrate de que la ruta también sea correcta
const server = awsServerlessExpress.createServer(app);

export const handler = (event, context) => {

return awsServerlessExpress.proxy(server, event, context);
};
