let users = require('./users')
let devices = require('./devices')
let utils = require('./utils')
let auth = require('./auth')
let tokenMiddleware = require('../handlers/token-service')

exports.create = function(app) {
    let baseAPI = '/api'
    app.use(baseAPI + '/users', tokenMiddleware.ensureAuthenticated, users)
    app.use(baseAPI + '/devices', tokenMiddleware.ensureAuthenticated, devices)
    app.use(baseAPI,  utils)
    app.use(baseAPI + "/auth", auth)
}
