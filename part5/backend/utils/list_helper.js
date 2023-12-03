const _ = require('lodash');

const dummy = (blogs) => {
    return 1;
}
  

const totalLikes = (blogs) => {
    return blogs.reduce((sum,entry) => sum+entry.likes,0);
}

const favoriteBlog  = (blogs) => {
    const maxLikeBlog = blogs.reduce((maxBlog, currentBlog) => currentBlog.likes>maxBlog.likes ? currentBlog : maxBlog, blogs[0]);
    const { title, author, likes } = maxLikeBlog;
    return { title, author, likes };
}

const mostBlogs = (blogs) => {
    const authorCounts = _.countBy(blogs, 'author'); // Count the number of blogs for each author
    const maxAuthor = _.maxBy(_.toPairs(authorCounts), (pair) => pair[1]); // Find the author with the most blogs

    return { author: maxAuthor[0], blogs: maxAuthor[1] };
}

const mostLikes= (blogs) => {
    const authorLikes = _.groupBy(blogs, 'author'); // Group blogs by author
    const authorTotalLikes = _.mapValues(authorLikes, (blogs) => _.sumBy(blogs, 'likes')); // Calculate the total likes for each author
  
    const maxAuthor = _.maxBy(_.keys(authorTotalLikes), (author) => authorTotalLikes[author]); // Find the author with the most likes
  
    return { author: maxAuthor, likes: authorTotalLikes[maxAuthor] };
}

module.exports = {
  dummy, 
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}