// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Silence only the specific React act() warning to keep CI logs clean
const realConsoleError = console.error
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation((...args) => {
    const first = args[0]
    if (typeof first === 'string' && first.includes('not wrapped in act(')) {
      return
    }
    realConsoleError(...args)
  })
})
afterAll(() => {
  if (typeof (console.error).mockRestore === 'function') {
    ;(console.error).mockRestore()
  } else {
    console.error = realConsoleError
  }
})
