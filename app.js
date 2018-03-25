const express = require('express')
const bodyParser = require('body-parser');
const db = require('./db.js')
const morgan = require('morgan')


const port = process.argv[2] || 5000;

//connect db
db.connect();


const app = express()
app.use(bodyParser.json());
app.use(morgan('short'));

app.post('/api/defaultCities', (req, res) => {
	res.json(db.CityDao.getDefaultCities);
});

app.post('/api/searchCityByName', (req, res) => {
	console.log(req.body);
	let name = req.body.name;

	db.CityDao.searchByName(name, cities => {
		res.json(cities);
	}, err => {
		res.json({error:err});
	});
});

app.post ('/api/searchCityByFuzzyName', (req, res) => {
	console.log(req.body);
	let name = req.body.name;
	let pageNum = req.body.pageNum || 1;
	let pageSize = req.body.pageSize || 20;

	db.CityDao.searchByFuzzyName(name, cities => {
		res.json(cities);
	}, err => {
		res.json({error:err});
	}, pageNum, pageSize);
});



app.listen(port, () => console.log('Example app listening on port ' + port) )