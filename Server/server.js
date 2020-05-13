const express = require('express');
const mongoose = require('mongoose');

// Connect DB
mongoose.connect('mongodb://localhost:27017/pia', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  }
);

// Route files
const users = require('./routes/users.js');
const company = require('./routes/companies.js');

const app = express();

app.use(express.json());

// Mount routers
app.use('/users', users);
app.use('/companies', company);

const PORT = 5000

const server = app.listen(PORT, console.log(`Server is listening on port: ${PORT}`));

