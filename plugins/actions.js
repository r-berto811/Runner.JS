const path = require('path')

module.exports = function (install) {
  return install(function (app, next) {
    const callActionMethod = function (controller, method) {
      const obj = {}

      for (let key in app) {
        if (key.charAt(0) !== '_') {
          obj[key] = app[key]
        }
      }

      controller = require(path.resolve(controller))

      Object.assign(obj, controller)

      method = method || 'run'
      obj[method] = controller[method]
      obj['boot'] = controller['boot'] ? controller['boot'] : function () { }
      obj['boot']()

      return obj[method]()
      
    }

    app.action = function (controller, method) {
      return callActionMethod(controller, method)
    }

    next()
  })
}
