import logger from "../utils/logger.js";

const requestLogger = (req, res, next) => {
    const start = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - start;
        const logData = {
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration_ms: duration,
        };

        if (res.statusCode >= 500) {
            logger.error("Request failed", logData);
        } else if (res.statusCode >= 400) {
            logger.warn("Request client error", logData);
        } else {
            logger.info("Request completed", logData);
        }
    });

    next();
};

export default requestLogger;
