/**
 * ts-jest : Jest need to know how to handle ts file via the ts-jest prest coz I'm using ts in my project
 * setupFiles : I am using tsyringe for Dependency Injection. The config ensures reflect-metadata is loaded before tests start, which is required for injectors to work correctly
 * roots : Find test file only inside of tests folder 
 * moduleNameMapper : This config tells Jest where to find @ alias shared directory
 * testEnvironment : Node for testing environment
 */


/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/tests"],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
        "^@loan-mng/shared$": "<rootDir>/../shared/src"
    },
    setupFiles: ["reflect-metadata"],
};
