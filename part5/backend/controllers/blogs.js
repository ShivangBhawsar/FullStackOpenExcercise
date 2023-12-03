const blogRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const blog = require('../models/blog')
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({}).populate('user', { username: 1, name: 1, id: 1 })
    response.json(blogs)
})

blogRouter.post('/', middleware.userExtractor, async (request, response) => {
    const body = request.body
    const user = await User.findById(request.user.id)

    const blog = new Blog({
        ...body,
        user: user.id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    const returnedBlog = await savedBlog.populate('user', { username: 1, name: 1, id: 1 })
    response.status(201).json(returnedBlog)
})

blogRouter.delete('/:id', middleware.userExtractor, async (request, response) => {

    console.log("Attempting to delete")
    const blog = await Blog.findById(request.params.id)
    console.log("Attempting Delete by userID: ", request.user.id, "for blog created by userID: ", blog.user)
    if (blog.user.toString() === request.user.id.toString()) {
        await Blog.findByIdAndDelete(request.params.id)
        return response.status(204).end()
    }
    return response.status(401).json({ error: 'User cannot delete this blog' })
})

blogRouter.put('/:id', async (request, response) => {
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog)
})

module.exports = blogRouter;
