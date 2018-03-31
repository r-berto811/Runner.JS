const Memcached = require('memcached');

module.exports = function (install) {

	return install(function (app, next) {

		app.cache = new Memcached(app.config.memcached.host, app.config.memcached.port);
		next();

	});

}