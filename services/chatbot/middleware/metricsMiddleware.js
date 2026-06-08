import client from "prom-client";

const register = new client.Registry();
client.collectDefaultMetrics({ register, prefix: "chatbot_" });

const httpRequestDuration = new client.Histogram({
    name: "http_request_duration_seconds",
    help: "Duration of HTTP requests in seconds",
    labelNames: ["method", "route", "status_code", "service"],
    buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
    registers: [register],
});

const httpRequestsTotal = new client.Counter({
    name: "http_requests_total",
    help: "Total number of HTTP requests",
    labelNames: ["method", "route", "status_code", "service"],
    registers: [register],
});

const metricsMiddleware = (req, res, next) => {
    const start = Date.now();

    res.on("finish", () => {
        const duration = (Date.now() - start) / 1000;
        const route = req.route ? req.route.path : req.path;
        const labels = {
            method: req.method,
            route,
            status_code: res.statusCode,
            service: "chatbot",
        };

        httpRequestDuration.observe(labels, duration);
        httpRequestsTotal.inc(labels);
    });

    next();
};

export { register, metricsMiddleware };
