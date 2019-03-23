
import http from 'http'

const microRequest = (client, options) => {
  const {
    method = 'GET',
    path = '/',
    body = null,
    maxTime = 90000, // 90s
    maxBytes = 32000000 // 32mb
  } = options

  const requestHeaders = {
    ...options.headers,
    ':method': method,
    ':path': path
  }

  return new Promise((resolve, reject) => {
    const payload = []
    let bytes = 0

    const handler = headers => {
      const statusCode = headers[':status']

      if (statusCode !== 200) {
        const error = new Error(http.STATUS_CODES[statusCode])
        error.statusCode = statusCode
        return reject(error)
      }

      const request = client.request(requestHeaders, handler)

      request.setTimeout(maxTime)

      request.on('timeout', () => {
        const error = new Error('Response took too long')
        error.statusCode = 408
        reject(error)
      })

      request.on('data', chunk => {
        bytes += Buffer.byteLength(chunk)

        if (bytes > maxBytes) {
          const error = new Error('Response is too large')
          error.statusCode = 400
          return reject(error)
        }

        payload.push(chunk)
      })

      request.on('end', () => {
        resolve({ headers, body: Buffer.concat(payload) })
      })

      request.end(body)
    }
  })
}

export default microRequest
