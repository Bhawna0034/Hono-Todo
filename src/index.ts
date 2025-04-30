import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { basicAuth } from "hono/basic-auth";

const app = new Hono();

// Any HTTP Method
app.all('/hello', (c) => {
 return c.text('Any Method, /hello')
})

// Multiple Method
app.on(['PUT', 'DELETE'], '/posts', (c) => {
   return c.text('PUT or Delete /posts');
})

// Multiple Paths
app.on('GET', ['/hello', '/foo/hello', '/boo/hello'], (c) => {
  return c.text('Hello Multiple Paths');
})

// Path Parameter
app.get('/profile/:username', (c) => {
  const username = c.req.param('username');
  return c.text(`Profile: ${username}`);
})

app.get('/profile/:id/comment/:comment_id', (c) => {
  const {id, comment_id} = c.req.param();
  return c.text(`Id: ${id}, Comment Id: ${comment_id}`);
})

// Optional Paramter
app.get('/profile/:id/:bio?', (c) => {
  const {id, bio} = c.req.param();
  return c.text(`Id: ${id} ${bio}`);
})

serve({
  fetch: app.fetch,
  port: 3000,
}, (info) => {
  console.log(`Server is running on https://localhost:${info.port}`)
})
