const hrsToMilliseconds = hours => hours * 60 * 60 * 1000;

exports.ONE_DAY_IN_MS = hrsToMilliseconds(24);
exports.ONE_HOUR_IN_SECONDS = hrsToMilliseconds(1) / 1000;
