const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const db = new Sequelize({
	database: 'worldclock',
	username: 'frank',
	password: 'frank78524',
	dialect: 'mysql'
})

const CityDao = db.define('city', {
	id: {
		type: Sequelize.BIGINT,
		primaryKey: true,
		autoIncrement: true
	},
	geoname_id: Sequelize.BIGINT,
	name: Sequelize.STRING,
	ascii_name: Sequelize.STRING,
	display_name: Sequelize.STRING,
	lat: Sequelize.INTEGER,
	lng: Sequelize.INTEGER,
	country_code: Sequelize.STRING,
	admin1_code: Sequelize.STRING,
	time_zone_desc: Sequelize.STRING,
	time_zone_offset: Sequelize.FLOAT,  
	country_name: Sequelize.STRING, 
	state_name: Sequelize.STRING,
	feature_code: Sequelize.STRING, 
	population: Sequelize.INTEGER,
	search_priority: Sequelize.INTEGER,
	valid: Sequelize.INTEGER
}, {
	tableName: 'city'
});


class City {
	constructor(cityDao) {
		this.geonameId = cityDao.getDataValue('geoname_id');
		this.name = cityDao.getDataValue('ascii_name');
		this.displayName = cityDao.getDataValue('display_name');
		this.countryName = cityDao.getDataValue('country_name');
		this.stateName = cityDao.getDataValue('state_name');
		this.timeZoneDesc = cityDao.getDataValue('time_zone_desc');
		this.timezone = cityDao.getDataValue('time_zone_offset');
		this.countryCode = cityDao.getDataValue('country_code');
	}
}


/*
'BEIJING',
'SAN FRANCISCO',
'LONDON',
'BERLIN',
'SEOUL',
'TOKYO',
'SINGAPORE',
'NEW YORK'
*/

const defaultCityList = [
	{ geonameId : 1816670, name : 'Beijing', displayName : 'Beijing', countryName : 'China', stateName : 'Beijing', timeZoneDesc : 'Asia/Shanghai', timezone : 8, countryCode:
'CN'},
	{ geonameId : 5391959, name : 'San Francisco', displayName : 'San Francisco', countryName : 'United States', stateName : 'California', timeZoneDesc : 'America/Los_Angeles', timezone:-8, countryCode:'US'},
	{ geonameId : 2643743, name : 'London', displayName : 'London', countryName : 'United Kingdom', stateName : 'England', timeZoneDesc:'Europe/London', timezone:0, countryCode:'GB'},
	{ geonameId : 2950159, name : 'Berlin', displayName : 'Berlin', countryName : 'Germany', stateName : 'Berlin', timeZoneDesc : 'Europe/Berlin', timezone : 1, countryCode:'DE'},
	{ geonameId : 1835848, name : 'Seoul', displayName : 'Seoul', countryName : 'South Korea', stateName : 'Seoul', timeZoneDesc : 'Asia/Seoul', timezone : 9, countryCode:'KR'},
	{ geonameId : 1850147, name : 'Tokyo', displayName : 'Tokyo', countryName : 'Japan', stateName : 'Tokyo', timeZoneDesc : 'Asia/Tokyo', timezone : 9, countryCode:'JP'},
	{ geonameId : 1880252, name : 'Singapore', displayName : 'Singapore', countryName : 'Singapore', stateName : 'Central Singapore', timeZoneDesc : 'Asia/Singapore', timezone : 8, countryCode:'SG'},
	{ geonameId : 5128581, name : 'New York', displayName : 'New York', countryName : 'United States', stateName : 'New York', timeZoneDesc : 'America/New_York', timezone:-5, countryCode:'US'}
];


const connect = () => {
	db.authenticate()
	.then(() => {
		console.log("connect db successfully!");

	})
	.catch(err => {
		console.log("Failed to connect to the db", err);
	});
}

const toCities = cityDaoList => {
	let cityList = []
	cityDaoList.forEach( cityDao => {
		let city = new City(cityDao);
		cityList.push(city);
	});
	return cityList;
};



const searchByName = (name, success, error) => {
	CityDao.findAll({
		where: {
			ascii_name: name
		}
	}).then(cities => {
		success(toCities(cities));
	}).catch(err => {
		error(err)
	});
}

const searchByNameList = (nameList, success, error) => {
	CityDao.findAll({
		where: {
			ascii_name : {
				[Op.in] : nameList.map(name => name.toLowerCase())
			}
		}
	}).then(cities => {
		success(toCities(cities));
	}).catch(err => {
		error(err)
	});	
}

//pageNum start with 1
const searchByFuzzyName = (name, success, error, pageNum, pageSize) => {
	CityDao.findAll({
		where: {
			ascii_name : {
				[Op.like] : '%' + name + '%'
			}
		},
		limit : pageSize,
		offset : pageSize * (pageNum-1),
		order : [
			['population', 'DESC'] 
		]
	}).then(cities => {
		success(toCities(cities));
	}).catch(err => {
		console.log(err);
		error(err);
	});
}

module.exports = {
	db : db,
	connect : connect,
	CityDao : {
		searchByName : searchByName,
		searchByNameList : searchByNameList,
		getDefaultCities : defaultCityList,
		searchByFuzzyName : searchByFuzzyName
	}
	
}

