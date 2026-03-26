process.env.TZ = 'UTC';

const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

const customConfig = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testEnvironment: 'jest-environment-jsdom',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    testMatch: ['<rootDir>/tests/**/*.test.[jt]s?(x)'],
};

module.exports = createJestConfig(customConfig);
