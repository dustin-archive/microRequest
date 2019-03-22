
# microRequest

## Manual Requests

```js
import http2 from 'http2'

const client = http2.connect('https://foobar.com')

client.on('error', error => console.log(error))

const fooPromise = microRequest(client, { method: 'GET', path: '/foo' })
const barPromise = microRequest(client, { method: 'GET', path: '/bar' })

const task = async () => {
  const foo = await fooPromise
  const bar = await barPromise

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
      hello: 'world'
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
