var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();

require('dotenv').config()


const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.set('port', (process.env.PORT || 5000));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/public');
app.get('/cool', (req, res) => res.send(cool()))
app.get('/times', (req, res) => res.send(showTimes()))
.get('/contact', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT Name, Email FROM salesforce.contact ORDER BY Name');
    const results = { 'results': (result) ? result.rows : null};
    var test = result.rows;
    var stringToParse = JSON.stringify(test);
    
    res.render('viewContact.html', { names: stringToParse} );
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})
.get('/contract', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT ContractNumber, StartDate, ContractTerm FROM salesforce.contract');
    const results = { 'results': (result) ? result.rows : null};
    var test = result.rows;
    console.log(test)
    var stringToParse = JSON.stringify(test);
    
    res.render('viewContract.html', { names: stringToParse} );
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})

.get('/product', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT Name  FROM salesforce.product2');
    const results = { 'results': (result) ? result.rows : null};
    var test = result.rows;
    console.log(test)
    var stringToParse = JSON.stringify(test);
    
    res.render('viewProduct.html', { names: stringToParse} );
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})

.get('/account', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT Name, Phone FROM salesforce.account');
    const results = { 'results': (result) ? result.rows : null};
    var test = result.rows;
    console.log(test)
    var stringToParse = JSON.stringify(test);
    
    res.render('viewAccount.html', { names: stringToParse} );
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})

app.get('/', function(request, response) {
  var env = process.env.APP_ENV;
  if (env == 'staging') {
    var envName = 'staging'
  } else if (env == 'production') {
    var envName = 'production'
  } else {
    var envName = 'review app'
  }
  response.render('index.html', { env: envName});
});

app.listen(app.get('port'), function() {
  console.log("Node app running at localhost:" + app.get('port'));
});

module.exports = app

showTimes = () => {
  let result = '';
  const times = process.env.TIMES || 5;
  for(i = 0; i < times; i++){
    result += i + ' ';
  }
  return result;
}
