const fs = require('fs');
const path = require('path');

// Logger middleware improved: log to console and file
module.exports = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;
    console.log(log);
    // write the log in access.log in the root of the backend
    const logPath = path.join(__dirname, '../../access.log');
    fs.appendFileSync(logPath, log + '\n');
  });
  next();
};