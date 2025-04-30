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

serve({
  fetch: app.fetch,
  port: 3000,
}, (info) => {
  console.log(`Server is running on https://localhost:${info.port}`)
})
