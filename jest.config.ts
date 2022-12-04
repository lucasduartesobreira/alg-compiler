import type { Config } from 'jest'
import { defaults } from 'jest-config'

const config: Config = {
  ...defaults,
  verbose: true,
  moduleFileExtensions: ['ts', ...defaults.moduleFileExtensions],
  collectCoverageFrom: ['src/**/*.ts', '!**/node_modules/**'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80
    }
  }
}

export default config

