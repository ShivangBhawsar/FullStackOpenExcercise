const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
mongoose.set("bufferTimeoutMS", 30000)

beforeEach(async () => {
    await User.deleteMany({})

    const userObjects = helper.initialUsers
        .map(user => new User(user))
    const promiseArrayUser = userObjects.map(user => user.save())
    await Promise.all(promiseArrayUser)

    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
}, 100000)

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
})


test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const expectedBlog = {
        title: "First class tests",
        author: "Robert C. Martin"
    }

    const blogArray = response.body;
    const blogExists = blogArray.some(blog => {
        return blog.title === expectedBlog.title && blog.author === expectedBlog.author;
    });

    expect(blogExists).toBe(true);
})

test('the unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach(blog => {
        expect(blog.id).toBeDefined();
    });
})

test('a valid blog can be added', async () => {

    const user = {
        username: "Shivang",
        password: "asdf",
    }

    const login = await api
        .post('/api/login')
        .send(user)

    const newBlog = {
        title: "New Blog in test",
        author: "blogtester leviosa",
        url: "http://abcd.com",
        likes: 10,
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const expectedBlog = {
        title: "New Blog in test",
        author: "blogtester leviosa",
        url: "http://abcd.com",
        likes: 10
    }

    const blogExists = blogsAtEnd.some(blog => {
        return blog.title === expectedBlog.title && blog.author === expectedBlog.author;
    });

    expect(blogExists).toBe(true);
})

test('if like property is missing from the request it is set to 0', async () => {
    
    const user = {
        username: "Shivang",
        password: "asdf",
    }

    const login = await api
        .post('/api/login')
        .send(user)

    const newBlog = {
        title: "New Blog in test",
        author: "blogtester leviosa",
        url: "http://abcd.com"
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const expectedBlog = {
        title: "New Blog in test",
        author: "blogtester leviosa",
        url: "http://abcd.com",
        likes: 0
    }

    const blogExists = blogsAtEnd.some(blog => {
        return blog.title === expectedBlog.title && blog.author === expectedBlog.author && blog.url === expectedBlog.url && blog.likes === expectedBlog.likes;
    });

    expect(blogExists).toBe(true);
})

test('if the title is missing from the request data backend responds with code 400', async () => {
    const user = {
        username: "Shivang",
        password: "asdf",
    }

    const login = await api
        .post('/api/login')
        .send(user)

    const newBlog = {
        title: "New Blog in test",
        author: "blogtester leviosa"
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send(newBlog)
        .expect(400)
})

test('if the url is missing from the request data backend responds with code 400', async () => {
    const user = {
        username: "Shivang",
        password: "asdf",
    }

    const login = await api
        .post('/api/login')
        .send(user)

    const newBlog = {
        author: "blogtester leviosa",
        url: "http://abcd.com"
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${login.body.token}`)
        .send(newBlog)
        .expect(400)
})

test('deletion of a blog', async () => {
    const user = {
        username: "Shivang",
        password: "asdf",
    }

    const login = await api
        .post('/api/login')
        .send(user)

    const blogsAtStart = await helper.blogsInDb()
    const blogsToDelete = blogsAtStart[0]

    await api
        .delete(`/api/blogs/${blogsToDelete.id}`)
        .set('Authorization', `Bearer ${login.body.token}`)
        .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
        helper.initialBlogs.length - 1
    )

    expect(blogsAtEnd).not.toContain(blogsToDelete.content)
})

test('updating number of likes for a blog post', async () => {

    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = {
        likes: 125
    }

    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    const expectedBlog = {
        ...blogToUpdate,
        ...updatedBlog
    }

    const blogExists = blogsAtEnd.some(blog => {
        return blog.id === expectedBlog.id && blog.likes === expectedBlog.likes;
    });

    expect(blogExists).toBe(true);
})

test('Adding a blog fails if token is not provided', async () => {

    const newBlog = {
        title: "New Blog in test",
        author: "blogtester leviosa",
        url: "http://abcd.com",
        likes: 10,
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})

afterAll(async () => {
    await mongoose.connection.close()
})