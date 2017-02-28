var React = require('react');
var Comment = require('./Comment');

var CommentList = React.createClass({
  render: function () {
    return (
      <div className="comment-list">
        <h2 className="CommentListHeading">Comment List:</h2>
        {this.renderComments()}
      </div>
    );
  },
  renderComments: function () {
    return this.props.comments.map(function (comment, i) {
      return (
        <Comment key={i} author={comment.author}>
          {comment.text} {/* this passes down as props.children */}
        </Comment>
      );
    });
  }
});

module.exports = CommentList;