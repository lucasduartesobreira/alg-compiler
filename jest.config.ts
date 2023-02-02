import type { Config } from 'jest'
import { defaults } from 'jest-config'

const config: Config = {
  ...defaults,
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  moduleFileExtensions: ['ts', ...defaults.moduleFileExtensions],
  moduleNameMapper: { '^@/(.*)/(.*)$': '<rootDir>/src/$1/$2' },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/index.ts',
    '!src/**/*.types.ts',
    '!src/utils/types.ts',
    '!**/node_modules/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80
    }
  }
}

export default config
