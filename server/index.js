const Koa = require('koa')
const consola = require('consola')
const json = require('koa-json')
const session = require('koa-generic-session')
const bodyParser = require('koa-bodyparser')
const passport = require('./utils/passport')
const { Nuxt, Builder } = require('nuxt')

const app = new Koa()

app.use(bodyParser({
    enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(passport.initialize())
app.use(passport.session())

app.keys = ['keys', 'keyskeys']
app.use(session({
    key: 'fin',
    prefix: 'fin:uid',
    maxAge: 1000,
    /** (number) maxAge in ms (default is 1 days)，cookie的过期时间 */
    overwrite: true,
    /** (boolean) can overwrite or not (default true) */
    httpOnly: true,
    /** cookie是否只有服务器端可以访问 (boolean) httpOnly or not (default true) */
    signed: true,
    /** (boolean) signed or not (default true) */
}))

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = app.env !== 'production'

async function start() {
    // Instantiate nuxt.js
    const nuxt = new Nuxt(config)

    const {
        host = process.env.HOST || '127.0.0.1',
            port = process.env.PORT || 3000
    } = nuxt.options.server

    // Build in development
    if (config.dev) {
        const builder = new Builder(nuxt)
        await builder.build()
    } else {
        await nuxt.ready()
    }

    app.use((ctx) => {
        ctx.status = 200
        ctx.respond = false // Bypass Koa's built-in response handling
        ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
        nuxt.render(ctx.req, ctx.res)
    })

    app.listen(port, host)
    consola.ready({
        message: `Server listening on http://${host}:${port}`,
        badge: true
    })
}

start()