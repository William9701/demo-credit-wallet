import express from 'express';
import bodyParser from 'body-parser';
import usersRouter from './routes/users'; // Adjust the path to your users router file
import path from 'path';
import { createUser, createLinkToken } from "./controllers/userController";





const app = express();
const PORT = 3000;
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));


// Middleware to parse incoming JSON
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.render('index', { title: 'Demo Credit', message: 'Welcome to Demo Credit!' });
  });
  
// Mount the users route
app.use('/api', usersRouter);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
