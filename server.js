const express = require('express');
var cors = require('cors')
const http = require('http');
const bodyParser = require('body-parser');
const app = express();
const config = require('./config');
const router_admin_v1 = require('./router/router_admin_v1');
const ev = require('express-validation');

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

router_admin_v1.set(app);

const db = require('./db');
db.sync().then(() => {
	console.log('DB Connection successful.');
}).catch((error) => { console.log(error) });


app.use(function (err, req, res, next) {
	if (err instanceof ev.ValidationError) return res.status(err.status).json(err);
	if (process.env.NODE_ENV !== 'production') {
		return res.status(500).send(err.stack);
	} else {
		return res.status(500);
	}
});

app.listen(config.port, () => console.log('App listening on port ' + config.port));
