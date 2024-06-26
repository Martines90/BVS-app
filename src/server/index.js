/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */

require('dotenv').config({
  path: `${__dirname}/./../../.env`,
});

const helpers = require('./helpers');

const axios = require('axios');
const express = require('express');
const fs = require('fs');
const multer = require('multer');

const cors = require('cors');

const app = express();

const FormData = require('form-data');

const DEFAULT_API_PORT = 3333;

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, `${__dirname}/files/`);
  },
  filename(req, file, cb) {
    // FIX ME: QuickNode has issues with accented chars, etc filenames
    cb(null, helpers.normalizeFileName(`${Date.now()}_${file.originalname}`));
  },
});

const upload = multer({ storage });

app.use(cors());
app.use(express.json());

const uploadToIPFS = async (filePath, fileName) => {
  try {
    const formData = new FormData();

    formData.append('Body', fs.createReadStream(filePath));
    formData.append('Key', fileName);
    formData.append('ContentType', 'application/pdf');

    const response = await axios.post(
      'https://api.quicknode.com/ipfs/rest/v1/s3/put-object',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'Content-Type': 'application/pdf',
          'x-api-key': `${process.env.QUICK_NODE_API_KEY}`,
        },
      },
    ).then((res) => res).catch((error) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
    });
    if (response.status === 201 || response.status === 200) {
      return response.data;
    }
    return response;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw error;
  }
};

app.post('/upload', upload.single('file'), async (req, res) => {
  const normalizedFileName = helpers.normalizeFileName(req.file.filename);
  const filePath = `${__dirname}/files/${normalizedFileName}`;

  await uploadToIPFS(
    filePath,
    normalizedFileName,
  ).then((data) => res.status(200).send(JSON.stringify({ ipfsHashKey: data.pin.cid })))
    .catch((err) => {
      res.status(400).send(JSON.stringify({ defaultErrMessage: 'Something went wrong', err }));
    });
});

app.listen(DEFAULT_API_PORT, () => {
  console.log(`Server is listening on port: ${DEFAULT_API_PORT}`);
});
