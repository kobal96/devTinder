import express from 'express';
import dotenv from 'dotenv';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use(express.json());

dotenv.config();

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use('/users', (req, res) => {
  // Logic to handle user-related operations
     res.send('User endpoint');
});


app.use('/about-us', (req, res) => {
  // Logic to handle user-related operations
     res.send('About Us endpoint');
});
