/*Todo esto es una prueba para probar el docker, luego se borrara ya que la única forma de hablar con el backend
 debe ser a traves del gateway usando las colas de rabbit.*/
import express from 'express';
import { Request, Response } from 'express';
import 'reflect-metadata';

// Create Express server
const app = express();

// Express configuration
app.set('port', process.env.PORT || 2750);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/prueba', (req: Request, res: Response) => {
  res.send('Backend funcionando!');
});

export default app;
