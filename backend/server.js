const express = require ('express');
const cors = require('cors');
const mongo = require('mongoose');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

mongo.connect(process.env.MONGO_URI)
.then(() => {
    console.log('Database connected!!');
})
.catch((err) => {
    console.log('error connecting',err);
})

app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/tasks', require('./routes/taskRoute'));

app.listen(process.env.PORT, () => {
    console.log('Server running at port',process.env.PORT);
})