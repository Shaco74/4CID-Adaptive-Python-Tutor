import '@testing-library/jest-dom'

// Mock environment variables for testing
process.env.OPENAI_API_KEY = 'test-api-key'

// Global test setup
const { TextEncoder, TextDecoder } = require('util')
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Mock sessionStorage and localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
})