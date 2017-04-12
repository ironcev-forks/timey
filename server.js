var express = require('express')
var app = express()
var lessMiddleware = require('less-middleware')

var webpack = require('webpack')
var webpackConfig = require(process.env.WEBPACK_CONFIG ? process.env.WEBPACK_CONFIG : './webpack.config')
var compiler = webpack(webpackConfig)

app.engine('ejs', require('ejs-locals'))

app.set('port', process.env.PORT || 8080)
app.set('views', __dirname + '/app/views')
app.set('view engine', 'ejs')

app.use(lessMiddleware(__dirname + '/app', {
  force: true
}))

// Step 2: Attach the dev middleware to the compiler & the server
app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true, publicPath: webpackConfig.output.publicPath
}))

// // Step 3: Attach the hot middleware to the compiler & the server
// app.use(require("webpack-hot-middleware")(compiler, {
//   log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000
// }))

app.use(express.static(__dirname + '/app'))

app.get('/*', function (req, res) {
  console.log('server.request.index', req)
  res.render('index')
})

app.listen(app.get('port'), function () {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.settings.env)
})
