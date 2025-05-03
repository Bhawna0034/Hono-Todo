import dotenv from "dotenv";
import { Hono, type Next } from "hono";
import { serve } from "@hono/node-server";
import { HTTPException } from "hono/http-exception";
import { logger } from 'hono/logger'
import jwt from 'jsonwebtoken'
import type { Todo, User } from "./types.js";
import type { Context } from "hono";
import { auth } from "hono/utils/basic-auth";

const app = new Hono();

let Todos: Todo[] = [];
let Users: User[] = [];

dotenv.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;
if (!JWT_SECRET_KEY) {
  throw new Error("JWT_SECRET is not defined in .env");
}
app.use(logger()); 
// Signup
app.post("/signup", async (c) => {
  const { email, password } = await c.req.json();
  const isUserExists = Users.find((user) => user.email === email);
  if (isUserExists) {
    throw new HTTPException(409, { message: "User already exists!" });
  }
  const newUser: User = {
    id: Date.now(),
    email,
    password: password,
  };
  Users.push(newUser);
  return c.json(
    {
      message: "Signup Successful!",
      email,
    },
    201
  );
});

// login
app.post("/login", async(c) => {
  const {email, password} = await c.req.json();
  const user = Users.find((user) => user.email === email);
  if(!user){
    throw new HTTPException(401, {message: "Invalid email and password"});
  }
  const passwordMatched = user.password === password;
  if(!passwordMatched){
    throw new HTTPException(401, {message: "Password Do not Match!"});
  }
  


  const token = jwt.sign({id: user.id, email: user.email}, JWT_SECRET_KEY, {
    expiresIn: "1h",
  })


  return c.json({
    message: "Login Successful!",
    token
  });
});

// Authentication
const authMiddleware = async(c: Context, next: Next) => {
  const authHeader = c.req.header("Authorization");
  if(!authHeader || !authHeader.startsWith("Bearer ")){
    throw new HTTPException(401, {message: "Missing or Malformed Token"});
  }

  const token = authHeader.split(" ")[1];
  try{
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    c.set("user", decoded);
    await next();
  }catch{
    throw new HTTPException(401, {message: 
      "Invalid or expired token"
    });
  }

}
// Get All Todo
app.get("/todos", authMiddleware, (c) => {
  return c.json(Todos)
}

);

// Create Todo
app.post("/todos", authMiddleware, async (c) => {
  const body = await c.req.json();
  if (!body.title) {
    throw new HTTPException(400, { message: "Task is required" });
  }

  const newTodo: Todo = {
    id: Date.now(),
    title: body.title,
    isCompleted: false,
  };
  Todos.push(newTodo);
  return c.json(newTodo, 201);
});

// Get Todo By Id
app.get("/todos/:id", authMiddleware, (c) => {
  const id = Number(c.req.param("id"));
  const todoById = Todos.find((todo) => todo.id === id);
  if (!todoById) {
    return c.json(
      {
        message: `Todo with id ${id} not Found!`,
      },
      404
    );
  }
  return c.json(todoById);
});

// Delete Todo By Id
app.delete("/todos/:id", authMiddleware, (c) => {
  const id = Number(c.req.param("id"));
  const todoExists = Todos.some((todo) => todo.id === id);
  if (!todoExists) {
    return c.json(
      {
        message: `Todo with id ${id} is not Found`,
      },
      404
    );
  }
  Todos = Todos.filter((todo) => todo.id !== id);
  return c.json({
    message: `Todo with id ${id} is deleted successfully!`,
  });
});

// Delete Todo
app.delete("/todos", authMiddleware, (c) => {
  Todos = [];
  return c.json("All Todos have been deleted successfully!");
});

// Edit Todo By Id
app.put("/todos/:id", authMiddleware, async (c) => {
  const id = Number(c.req.param("id"));
  const body = await c.req.json();
  const TodoById = Todos.find((todo) => todo.id === id);
  if (!TodoById) {
    return c.json(
      {
        message: `Todo with id ${id} not Found!`,
      },
      404
    );
  }
  TodoById.title = body.title ?? TodoById.title;
  TodoById.isCompleted = body.isCompleted ?? TodoById.isCompleted;
  return c.json(TodoById);
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on https://localhost:${info.port}`);
  }
);
