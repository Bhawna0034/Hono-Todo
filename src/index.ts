import { serve } from "@hono/node-server";
import { Hono } from "hono";

// Grouping
// const book = new Hono();
// book.get('/', (c) => c.text('List Books'))
// book.get('/:id', (c) => {
//    const id = c.req.param('id');
//    return c.text(`Get Book: ${id}`);
// })
// book.post('/', (c) => c.text('Create Book'));

// const app = new Hono();
// app.route('/book', book);

// Grouping without changing a base
const book = new Hono();
book.get('/book', (c) => c.text('List Books'))
book.post('/book', (c) => c.text('Create Book'));

const user = new Hono().basePath('/user')
user.get('/', (c) => c.text('List Users'))
user.post('/', (c) => c.text('Create User'))
const app = new Hono();
app.route('/', book);
app.route('/', user);


// BasePath
const api = new Hono().basePath('/api')
api.get('/books', (c) => c.text('List Books')); // Get api/book

app.route('/', api);

serve({
  fetch: app.fetch,
  port: 3000,
}, (info) => {
  console.log(`Server is running on https://localhost:${info.port}`)
})
