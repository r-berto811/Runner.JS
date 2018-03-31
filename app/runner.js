const path = require('path');
const config = require('../runner.conf');

const app = {};

// register events container
app._events = {};

// register config
app.config = require('../config');

// register function to catch events

const registerPlugins = async function () {

	const register = async function (plugin) {
		const installer = function (install) {
			return new Promise(resolve => {
				install(app, function () {
					return resolve()
				});
			});
		}
		return await plugin(installer);
	};

	for (let plugin of config.plugins) {
		plugin = require(path.resolve(plugin));
		await register(plugin);
		// fire if registred plugin
		await app.event('plugin:' + plugin);
	}

	return true;

};

const registerEvents = async function () {

	app.on = function (event, callback) {

		if (typeof app._events[event] === 'object') {
			app._events[event].push(callback);
		} else {
			app._events[event] = [callback];
		}

	};

	app.event = async function (event, data) {

		const callEventCallback = function (cb, data) {

			if (cb.constructor.name === 'AsyncFunction') {
				return cb();
			}

			return new Promise(resolve => {
				cb(data, function () {
					return resolve(true);
				});
			});

		}

		if (typeof app._events[event] !== 'object') {
			return;
		}

		for (let callback of app._events[event]) {
			if (typeof callback !== 'function') {
				return;
			}
			await callEventCallback(callback, data);
		}

		app._events[event] = [];

		return;
	};

};

const runApplication = function (runner) {
	return new Promise(resolve => {
		runner(app, function () {
			return resolve();
		}).catch(err => {
			console.error(err)
		});
	});
};

const Runner = async function (runner) {

	// register events
	await registerEvents();
	// run main application
	await runApplication(runner);
	// before register plugins
	await app.event('before');
	// register all plugins
	await registerPlugins();
	// fire if registred all plugins
	await app.event('booted');

	process.exit();

};

module.exports = Runner;