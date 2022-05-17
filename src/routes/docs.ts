import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const router = express.Router();

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Sasil-Server',
      version: '1.0.0',
      description: 'REST API with Express',
    },
    servers: [
      { url: 'http://localhost:4000', description: '개발 서버' },
      { url: 'https://api.sasil.app', description: '배포 서버' },
    ],
  },
  apis: ['./src/swagger/routes/*', './src/swagger/components/*'],
};

const swaggerSpec = swaggerJSDoc(options);

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerSpec, { explorer: true }));

export default router;
