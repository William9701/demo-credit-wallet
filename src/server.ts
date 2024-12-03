import express from 'express';
import bodyParser from 'body-parser';
import usersRouter from './routes/users'; // Adjust the path to your users router file
import path from 'path';







const app = express();
const PORT = process.env.PORT || 4000;
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));


app.use(express.json());


app.get('/', (req, res) => {
    res.render('index', { token: '1', message: 'Welcome to Demo Credit!' });
});
  
  
// Mount the users route
app.use('/api', usersRouter);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app