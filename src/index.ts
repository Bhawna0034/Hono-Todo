import { serve } from '@hono/node-server'
import { Hono } from 'hono' // This line imports the Hono class from the Hono Framework

const app = new Hono() // This line created a new Hono application by calling the Hono() constructor. app is now your main web app, where you can define different routes like /, /about, /login, etc.

// This defines a GET route for the URL path '/', which is the homepage
app.get('/', (c) => { // (c) is a context object, which gives you access to the request, response and other info
  return c.text('Hello Hono!') // c.text('Hello Hono!') sends back a plain text response: 'Hello Hono!'

})

// Return JSON
app.get('/api/hello', (c) => { // This defines a GET API route at /api/hello
  return c.json({ // It tells Hono to send a JSON response
    ok: true, // It becomes the JSON response output
    message: 'Hello World!',
  })
});

// Request and Response
app.get('/posts/:id', (c) => { // This defines a GET route that includes a dynamic parameter in the URL.
  const page = c.req.query('page') // This extracts a query parameter from the URL. If the user visits /posts/123?page=2, then page will be "2".
  const id = c.req.param('id') // This gets the :id from the URL path. For /posts/123, the value of id will be "123".
  c.header('X-Message', 'Hi!') // This sets a custom response header called X-Message with the value "Hi!". Headers are extra information sent along with a response (useful for metadata, debugging, etc.).
  return c.text(`You want to see ${page} with this ${id}`); // This sends a plain text response using the values from page and id.
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
