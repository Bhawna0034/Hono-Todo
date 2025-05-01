import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { createMiddleware } from "hono/factory";

// Request Header
const app = new Hono<{Variables: Variables}>();
app.get('/hello', (c) => {
  const user_agent = c.req.header('User-Agent');
  return c.text(`Your user agent is ${user_agent}`);
})

// status()
app.post('/posts', (c) => {
   c.status(201);
   return c.text(`Your post is created`);
})

// header()
app.get('/hello1', (c) => {
  // Set headers
  c.header('X-Message', "My Message")
  return c.text('Hello!');
})

// body()
app.get('/hello2', (c) => {
  return c.body('Hi Learners!')
})

// html()
app.get('/hello3', (c) => {
  return c.html('<h1>Hello World!</h1>')
})

// notFound()
app.get('/notFound', (c) => {
  return c.notFound();
})

// res()
app.use('/', async(c, next) => {
  await next();
  c.res.headers.append('X-Debug', 'Debug Message');

})
app.get('/', (c) => {
  return c.text('Getting response');
})

type Variables = {
  message: string
}

// set() & get()
app.use(async (c,next) => {
   c.set('message', 'Hello from Hono');
   await next();
})
app.get('/message', (c) => {
  const message = c.get('message');
  return c.text(`The message is ${message}`);
})

// var()
type Env = {
  Variables: {
    echo: (str: string) => string
  }
}

const echoMiddleware = createMiddleware<Env>(async (c, next) => {
  c.set('echo', (str) => str);
  await next();
})

app.get('/echo', echoMiddleware, (c) => {
  return c.text(c.var.echo('Hello!'));

})

// render() & setRenderer()
app.use(async(c, next) => {
  c.setRenderer((content) => {
    return c.html(`
       <html>
       <body>
        <p>${content}</p>
       </body>
       </html>
    `)
    
  })
  await next();

})

app.get('/render', (c) => {
  return c.render('Hello from render()');
})

declare module 'hono' {
  interface ContextRender {
    (
      content: string | Promise<string>,
      head: {title: string}
    ): Response | Promise<Response>
  }
}

app.use('/pages/*', async(c, next) => {
  c.setRenderer((content, head) => {
    return c.html(
      `<html>
       <head>
       <title>${head.title}</title>
       </head>
       <body>
        <header>${head.title}</header>
        <p>${content}</p>
       </body>
      </html>`
    )
})
await next();

})
serve({
  fetch: app.fetch,
  port: 3000,
}, (info) => {
  console.log(`Server is running on https://localhost:${info.port}`)
})
