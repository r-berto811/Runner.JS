# Runner.JS

Simple framework for creating schedule commands or daemons/watchers.

## Getting started

Clone project from git repository:
```
$ git clone https://github.com/r-berto811/Runner.JS.git < your project name >
```
Install dependencies:
```
$ npm install
```

Create and edit your config file:
```
$ cp config.example.js config.js
```

## Usage
Create your bin file in */bin* folder, import runner function from *app/runner.js* and use this.

To write the basic logic of your aplication it is recommended to use core events or your custom events.

```js
	#!/usr/bin/env node
    const runner = require('../app/runner')

    runner(function (app, exit) {

        app.on('booted', function (data, next) {
			
            console.log('Booted');
            next();

        });

        exit();

    });
```

#### Using controllers:
For using controllers, make sure you have **actions** plugin in */plugins* folder and it is enabled in *runner.conf.js*

```js
  	app.on('booted', function (data, next) {
  
    	app.action('controllers/DefaultController', 'run').then(status => {
			next();
		});

  	});

```

Or you can use this async:

```js
	app.on('booted', async function () {

		await app.action('controllers/DefaultController', 'run');

	});
```

#### Using events:

It is available system events:

* **before** fire after start application and before installing any plugins
* **plugin:[name]** fire after installed each plugin
* **booted** fire after loading and installed all enabled plugins

Also you can create your custom events and fire it:

```js
	await app.event('booted', $yourData);
```

#### Usin plugins:

It is possible to easily create your own plugin. Just add your custom *[pluginname].js* file to plugins folder and enable it in *runner.conf.js*

```js
module.exports = function (install) {

	return install(function (app, next) {

		app.sayHello = function () {
			console.log('Hello world');
		};
		
		next();

	});

}
```
You can use this plugin in your controller trough ``this.sayHello()`` or in other plugins through ``app.sayHello()``

All data you put in **app** object will be available in your controller through this.

If you want put to **app** object your protected data, which should not be available in the controller, just call it with underscore. For example: ``app._settings = {}``