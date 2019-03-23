
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
        reject(new Error('Response took too long'))
      })

      request.on('data', chunk => {
        bytes += Buffer.byteLength(chunk)

        if (bytes > maxBytes) {
          return reject(new Error('Response is too large'))
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
