var request = require('request');
const Base64Url = require('base64url');
const express = require('express');
const crypto = require('crypto');
const fs = require('fs')


const app = express();
const port = 3000;

app.get('',(req, res) => {
    const payload = generatePayload();
    console.log('sssss--'+payload);
    const sign = crypto.createSign('RSA-SHA256')
    sign.update(payload)
    sign.end();
    const privateKey = fs.readFileSync('server.key').toString('utf8')
    const reqAssersition =    payload + '.' + Base64Url.encode(sign.sign(privateKey));
    console.log('------------------------');
    console.log(reqAssersition);
    getToken(reqAssersition);
    res.send('Hello');
});

app.listen(port, () => {
    console.log('App listining to PORT 3000');  
});



function generatePayload () {
    const header = { alg: 'RS256' };
    const claimsSet = {
      iss: "3MVG9Kip4IKAZQEU9tCcgBs7vFUHWsNieqYboeqXZHP1fHNDC5LQP4nAYPLvzY.Wo66.krp5J4hZDiOx5SQ4D",
      sub: "csaisagar@gmail.com.lwcdatatable",
      aud: "https://login.salesforce.com",
      exp: Math.floor(Date.now() / 1000) + 60 * 5
    }
    const encodedJWTHeader = Base64Url.encode(JSON.stringify(header))
    const encodedJWTClaimsSet = Base64Url.encode(JSON.stringify(claimsSet))
    const existingString = encodedJWTHeader + '.' + encodedJWTClaimsSet

    return existingString
}


async function getToken (assertionStr) {
    const options = {
        uri: 'https://login.salesforce.com/services/oauth2/token',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        form: {
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: assertionStr
        }        
      };
    const body = await doRequest(options);
    console.log(body);
    return body
  } 



  function doRequest(options) {
    return new Promise((resolve, reject) => {
        request(options, function (err, res, body) {
            resolve(JSON.parse(body));
        });

    });
  }