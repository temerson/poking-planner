const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Data = require('./data');

const API_PORT = 3001;
const app = express();
const router = express.Router();

const dbRoute = 'mongodb+srv://temerson:temerson@cluster0-26fiw.mongodb.net/test?retryWrites=true';
mongoose.connect(
  dbRoute,
  { useNewUrlParser: true },
);

const db = mongoose.connection;

db.once('open', () => console.log('connected to the database'));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

router.get('/data', (req, res) => {
  Data.find((error, data) => {
    if (error) return res.json({ success: false, error });
    return res.json({ success: true, data });
  });
});

router.post('/data', (req, res) => {
  let data = new Data();
  const { id, message } = req.body;
  if ((!id && id !== 0) || !message) {
    return res.json({ success: false, error: 'Invalid input' });
  }
  data.message = message;
  data.id = id;
  data.save(error => {
    if (error) return res.json({ success: false, error });
    return res.json({ success: true });
  });
});

router.put('/data', (req, res) => {
  const { id, update } = req.body;
  Data.findOneAndUpdate(id, update, error => {
    if (error) return res.json({ success: false, error });
    return res.json({ success: true });
  })
});

router.delete('/data', (req, res) => {
  const { id } = req.body;
  Data.findOneAndDelete(id, error => {
    if (error) return res.send(error);
    return res.json({ success: true });
  })
});

app.use('/api', router);
app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));
