import express from 'express';
import bodyParser from 'body-parser';
import usersRouter from './routes/users'; // Adjust the path to your users router file

const app = express();
const PORT = 3000;

// Middleware to parse incoming JSON
app.use(bodyParser.json());

// Mount the users route
app.use('/api', usersRouter);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
