
import http2 from 'http2'
import http from 'http'

const microRequest = (client, options) => {
  return new Promise((resolve, reject) => {
    const payload = []
    let bytes = 0

    const handler = headers => {
      const statusCode = headers[':status']

      if (statusCode !== 200) {
        const error = new Error('Request failed: ' + http.STATUS_CODES[statusCode])
        error.statusCode = statusCode
        return reject(error)
      }

      request.setTimeout(options.maxTime)

      request.on('timeout', () => {
        reject(new Error('Response took too long'))
      })

      request.on('data', chunk => {
        bytes += Buffer.byteLength(chunk)

        if (bytes < options.maxBytes) {
          payload.push(chunk)
        } else {
          reject(new Error('Response is too large'))
        }
      })

      request.on('end', () => {
        resolve({
          headers,
          body: Buffer.concat(payload)
        })
      })
    }

    const request = client.request({
      ':status': options.status,
      ':method': options.method,
      ':authority': options.authority,
      ':scheme': options.scheme,
      ':path': options.path,
      ':protocol': options.protocol,
      ...options.headers
    }, handler)

    request.end(options.body)
  })
}

export default microRequest
