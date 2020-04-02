const config = {
    prices: {
        updateInterval: 2000
    }
};

const development = {
    session: {
        secret: '$eCuRiTy',
    }
};

const randomString = (rounds) => Array.from(
    {length: rounds},
    () => Math.random().toString(36).substring(2, 36))
    .join('');

const production = {
    session: {
        secret: randomString(2),
    }
};

const helpers = {
    isProduction() {
        return process.env.NODE_ENV === 'production';
    },
    isDevelopment() {
        return process.env.NODE_ENV === 'development';
    }
};

const envs = helpers.isProduction() ? production : development;

module.exports = {
    ...config,
    ...envs,
    ...helpers
};
