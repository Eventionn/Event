import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import routes from './routes/routes.js';
import swaggerUi from 'swagger-ui-express';

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', routes);

// Swagger Docs
const swaggerDocument = JSON.parse(fs.readFileSync(path.resolve('docs/swagger.json')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Endpoint de teste
app.get('/', (req, res) => {
  res.json('hello there');
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
