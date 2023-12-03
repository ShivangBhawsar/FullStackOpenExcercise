import { useState } from 'react'

const Blog = ({ blog, removeBlog, user, incrementLikeCount }) => {
  const [blogVisible, setBlogVisible] = useState(false)
  const [bloglikes, setBlogLikes] = useState(blog.likes) // only using blog.likes for setting the initial value of likes

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const incrementLike = async () => {
    await incrementLikeCount({...blog, likes: bloglikes})
    setBlogLikes(bloglikes+1)
  }

  const handleBlogDeletion = async () => {
    if (window.confirm(`Remove ${blog.title} by ${blog.author}?`))
      removeBlog(blog)
  }

  // console.log(blog);

  return (
    <div style={blogStyle} className='blog'>
      <div>
        {blog.title} {blog.author}
        {blogVisible ? (
          <button id="hide-blog-button" onClick={() => setBlogVisible(false)}>hide</button>
        ) : (
          <button id="view-blog-button" onClick={() => setBlogVisible(true)}>view</button>
        )}
      </div>
      <div style={{ display: blogVisible ? '' : 'none' }}>
        <div data-testid='blog-url'>{blog.url}</div>
        <div data-testid='number-of-likes'>
          likes {bloglikes} <button id="like-button" data-testid='like-button' onClick={incrementLike}>like</button>
        </div>
        <div>{blog.user.name}</div>
        {/* {console.log(user)} */}
        {user.id === blog.user.id ? (
          <button id="remove-blog" onClick={handleBlogDeletion}>remove</button>
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}

export default Blog
