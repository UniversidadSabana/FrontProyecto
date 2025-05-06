// Habilita los matchers de RTL
import '@testing-library/jest-dom'

// Arranca MSW antes de todos los tests
import { server } from './src/mocks/server.js'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
