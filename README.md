
# microRequest

## Making Requests

```js
import http2 from 'http2'

const client = http2.connect('https://foobar.com')

client.on('error', error => console.log(error))

const fooPromise = microRequest(client, { method: 'GET', path: '/foo' })
const barPromise = microRequest(client, { method: 'GET', path: '/bar' })

const task = async () => {
  const fooResponse = await fooPromise
  const barResponse = await barPromise

  const foo = fooResponse.body.toString() // buffer to string
  const bar = JSON.parse(barResponse.body) // parse json

  // do things...
}

task.then(() => client.close())
task.catch(error => console.log(error))
```

## Dynamic Requests

```js
import http2 from 'http2'

const client = http2.connect('https://foobar.com')

client.on('error', error => console.log(error))

const requestArray = []

for (let i = 0; i < 99; i++) {
  const options = {
    method: 'POST',
    path: '/foo'
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      data: i
    })
  }

  requestArray.push(microRequest(client, options))
}

const task = async () => {
  const responseArray = await Promise.all(requestArray)

  // do things...
}

task.then(() => client.close())
task.catch(error => console.log(error))
```
