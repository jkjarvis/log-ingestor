const express = require('express');
const bodyParser = require('body-parser');
const LogIngestionController = require( './controllers/logInjestionController' );
const QueryInterfaceController = require('./controllers/queryInterfaceController');
const cors = require('cors');

const app = express();
app.use(cors()); // enabling cors
const port = 3000;
const logIngestionController = new LogIngestionController();
const queryInterfaceController = new QueryInterfaceController();


app.use(bodyParser.json());

// Api route for log ingestion service
app.post('/', (req, res) => {
  logIngestionController.ingestLogs(req.body);
  res.send('Log ingested successfully!');
});

// api route for search interface
app.post('/search', async(req, res) => {
  res.send(await queryInterfaceController.queryData(req.body));
});

// running server on port 3000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
