let cache = {};
const TTL = 60 * 1000;

const cacheMiddleware = (req, res, next) => {
    if (req.method !== 'GET') {
        return next();
    }

    const key = req.originalUrl;
    const cachedEntry = cache[key];

    if (cachedEntry) {
        const now = Date.now();
        const age = now - cachedEntry.timestamp;

        if (age < TTL) {
            res.setHeader('X-Cache', 'HIT');
            return res.json(cachedEntry.data);
        } else {
            delete cache[key];
        }
    }

    res.setHeader('X-Cache', 'MISS');

    const originalJson = res.json.bind(res);
    res.json = (body) => {
        cache[key] = {
            data: body,
            timestamp: Date.now()
        };
        return originalJson(body);
    };

    next();
};

const invalidateCache = (req, res, next) => {
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
        res.on('finish', () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                cache = {};
            }
        });
    }
    next();
};

module.exports = {
    cacheMiddleware,
    invalidateCache
};
