import { Hono } from "hono";
import { serve } from "@hono/node-server";
import type { Todo } from "./types.js";

const app = new Hono();

let Todos:Todo[] = [];

// Get All Todo
app.get("/todos", (c) => c.json(Todos))

// Create Todo
app.post("/todos", async(c) => {
  const body = await c.req.json();
  const newTodo:Todo = {
    id: Date.now(),
    title: body.title,
    isCompleted: false
  };
  Todos.push(newTodo);
  return c.json(newTodo);
})



serve({
  fetch: app.fetch,
  port: 3000,
}, (info) => {
  console.log(`Server is running on https://localhost:${info.port}`)
})