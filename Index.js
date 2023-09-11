let express = require("express")
let app = express()

// let config = require("config")
// let port = config.get("port");

let route = require("./Route")
const { logger } = require("./helper/log")

app.use(route.app)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.listen(3001, () => {
    logger("error", "connected")
})