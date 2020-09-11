const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
const helmet = require('helmet');
const axios = require('axios');

const app = express();
const router = express.Router();

router.use(helmet());
router.use(compression());
router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(awsServerlessExpressMiddleware.eventContext());

router.get('/', async (req, res) => {
  const config = {
    method: 'GET',
    url: 'https://xkcd.com/info.0.json',
  };

  try {
    const response = await axios(config);
    if (response.status === 200) {
      return res.status(200).send(response.data);
    }
    return res.sendStatus(500);
  } catch (error) {
    console.error(error.message);
    return res.sendStatus(500);
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (isNaN(id) || id < 1) {
    // Error
    return res.sendStatus(404);
  }

  const config = {
    method: 'GET',
    url: 'https://xkcd.com/info.0.json',
  };

  try {
    const response = await axios(config);
    if (response.status === 200) {
      if (id > response.data.num) {
        return res.sendStatus(404);
      } if (id == 0) {
        return res.status(200).send(response.data);
      }
    } else {
      return res.sendStatus(500);
    }
  } catch (error) {
    console.error(error.message);
    return res.sendStatus(500);
  }

  config.url = `https://xkcd.com/${id}/info.0.json`;

  try {
    const response = await axios(config);
    if (response.status === 200) {
      return res.status(200).send(response.data);
    }
    return res.sendStatus(500);
  } catch (error) {
    console.error(error.message);
    return res.sendStatus(500);
  }
});

// The aws-serverless-express library creates a server and listens on a Unix
// Domain Socket for you, so you can remove the usual call to app.listen.
if (process.env.isLocal) {
  app.listen(3000);
  console.log('Server listening on port 3000');
}

app.use('/xkcd-cors-lambda', router);

// Export your express server so you can import it in the lambda function.
module.exports = app;
