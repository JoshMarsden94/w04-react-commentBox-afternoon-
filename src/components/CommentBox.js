var React = require('react');
var request = require('superagent');
var CommentList = require('./CommentList');
var CommentForm = require('./CommentForm');

var CommentBox = React.createClass({
  getInitialState: function () {
    return {
      comments: []
    };
  },
  componentDidMount: function () {
    console.log('component did mount!')
    request
      .get('https://comment-box-api.herokuapp.com/api/comments')
      .end(function (err, response) {
        this.setState({
          comments: response.body
        });
      }.bind(this))
  },
  render: function () {
    console.log('render!')
    if (this.state.comments.length === 0) {
      return (
        <p>Loading...</p>
      )
    }
    return (
      <div className="comment-box">
        <h1 className="CommentBoxHeading">NorthCoders Chat Room</h1>
        <CommentList comments={this.state.comments} />
        <CommentForm addComment={this.addComment}/>
      </div>
    );
  },
  addComment: function (newComment) {
    request.post('https://comment-box-api.herokuapp.com/api/comments')
      .set('Content-Type', 'application/json')
      .send(newComment)
      .end(function (err, response) {
        const newComments = this.state.comments.slice();
        newComments.push(response.body)
        this.setState({
        comments: newComments
      });
    }.bind(this));
  }
});

module.exports = CommentBox;