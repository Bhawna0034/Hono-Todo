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

// Get Todo By Id
app.get("/todos/:id", (c) => {
  const id = Number(c.req.param('id'));
  const todoById = Todos.find((todo) => todo.id === id)
  if(!todoById){ 
    return c.json({
      message: `Todo with id ${id} not Found!`
    }, 404)
  }
  return c.json(todoById);

})

// Delete Todo By Id
app.delete("/todos/:id", (c) => {
  const id = Number(c.req.param('id'));
  const todoExists = Todos.some((todo) => todo.id === id);
  if(!todoExists){
    return c.json({
      message: `Todo with id ${id} is not Found`
    }, 404)
  }
  Todos = Todos.filter((todo) => todo.id !== id);
  return c.json({
    message: `Todo with id ${id} is deleted successfully!`
  })
})

// Delete Todo
app.delete("/todos", (c) => {
  Todos=[];
  return c.json("All Todos have been deleted successfully!")
})

// Edit Todo By Id
app.put("/todos/:id", async(c) => {
  const id = Number(c.req.param('id'));
  const body = await c.req.json();
  const TodoById = Todos.find((todo) => todo.id === id);
  if(!TodoById) {
    return c.json({
      message: `Todo with id ${id} not Found!`
    }, 404)
  }
  TodoById.title = body.title ?? TodoById.title
  TodoById.isCompleted = body.isCompleted ?? TodoById.isCompleted
  return c.json(TodoById)
})


serve({
  fetch: app.fetch,
  port: 3000,
}, (info) => {
  console.log(`Server is running on https://localhost:${info.port}`)
})