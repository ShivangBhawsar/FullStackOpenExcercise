import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Toggleable'
import BlogForm from './components/BlogForm'

const Notification = ({ message, isError }) => {
  if (message === null) {
    return null
  }
  if (!isError) {
    return <div className="message">{message}</div>
  } else {
    return (
      <div className="message" style={{ color: 'red' }}>
        {message}
      </div>
    )
  }
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [isError, setIsError] = useState(false)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(blogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogsAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })
      window.localStorage.setItem('loggedBlogsAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setMessage('login successful')
      setIsError(false)
      setTimeout(() => {
        setMessage(null)
      }, 3500)
    } catch (exception) {
      console.log('Exception: ', exception)
      setMessage('wrong username or password')
      setIsError(true)
      setTimeout(() => {
        setMessage(null)
      }, 3500)
    }
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBlogsAppUser')
    setMessage('Logout Successful')
  }

  const createBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then((returnedBlog) => {
        setBlogs(blogs.concat(returnedBlog))
        setMessage(
          `a new blog ${blogObject.title} by ${blogObject.author} added`
        )
        setIsError(false)
        setTimeout(() => {
          setMessage(null)
        }, 3500)
      })
      .catch((error) => {
        console.log(error)
        setIsError(true)
        setMessage('Failed to add the Blog.')
        setTimeout(() => {
          setMessage(null)
        }, 3500)
      })
  }

  const removeBlog = async (blogObject) => {
    try {
      await blogService.remove(blogObject.id)
      setBlogs(blogs.filter(blog => blog.id !== blogObject.id))
      setIsError(false)
    } catch (error) {
      setIsError(true) 
      setMessage('User cannot delete this blog')
      console.error('Blog cannot be deleted:', error)
    }
  }

  const incrementLikeCount = async (blogObject) => {
    try {
      const updatedBlog = await blogService.update(blogObject.id, {
        ...blogObject,
        likes: blogObject.likes + 1,
      })
    } catch (error) {
      console.error('Error updating like count:', error)
    }
  }

  if (user === null) {
    return (
      <div>
        <Notification message={message} isError={isError} />
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              id="username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              id="password"
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit" id="login-button">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} isError={false} />
      <p>
        {user.name} logged in
        <button id="logout-button" onClick={handleLogout}>logout</button>
      </p>

      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>

      <br />

      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} removeBlog={removeBlog} user={user} incrementLikeCount={incrementLikeCount} />
      ))}
    </div>
  )
}

export default App