const mysql = require('mysql')

module.exports = function (install) {
  const createConnection = function (options) {
    const connection = mysql.createConnection(options)

    return new Promise((resolve, reject) => {
      connection.connect(function (err) {
        if (err) {
          return reject(err)
        }
        return resolve(connection)
      })
    })
  }

  const registerConnections = async function (app, config) {
    for (let connection in config) {
      app.db[connection] = await createConnection(config[connection])
    }
    return true
  }

  return install(function (app, next) {
    app.db = {}

    registerConnections(app, app.config.database).then(() => {
      next()
    }).catch(err => {
      throw err
    })
  })
}
