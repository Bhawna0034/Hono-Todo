import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { basicAuth } from "hono/basic-auth";

const app = new Hono();

app.use('/auth', (
  basicAuth({
    username: "bhawnaasharma",
    password: "1234"
  })
))
app.get('/auth', (c) => {
  return c.text('You are authorized!');
})

serve({
  fetch: app.fetch,
  port: 3000,
}, (info) => {
  console.log(`Server is running on https://localhost:${info.port}`)
})