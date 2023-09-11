let winston = require("winston")

let logger = winston.createLogger({
    transports: [new winston.transports.File({ filename: "e.log", level: "error" })
    ]
});

function log(level, message, data = undefined) {
    logger.log({
        level,
        message,
        data,
        date: Date.now()
    })
}

module.exports = { logger: log }
//logger.log({ level: "error", message: "this is error" })
