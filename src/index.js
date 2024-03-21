import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import initializeDb from './db';
import requestApiV1 from './v1/request/api';
import requestApiV2 from './v2/request/api';
import requestApiV3 from './v3';
import requestApiV4 from './v4';
import config from './config';
import dotenv from 'dotenv';
import compression from 'compression';

dotenv.load();

let app = express();
app.server = http.createServer(app);

app.all('/', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});

// logger
app.use(morgan('dev'));

// 3rd party middleware
app.use(cors({
	exposedHeaders: config.corsHeaders
}));

app.use(bodyParser.json({
	limit : config.bodyLimit
}));

// Compression 
app.use(compression())

// connect to db
initializeDb( db => {

	// api router
	app.use('/api/v1/', requestApiV1({ config, db }));
	app.use('/api/v2/', requestApiV2({ config, db }));
	app.use('/api/v3/', requestApiV3({ config, db }));
	app.use('/api/v4/', requestApiV4({ config, db }));

	app.server.listen(process.env.PORT || config.port, () => {
		console.log(`Started on port ${app.server.address().port}`);
	});
});

export default app;
