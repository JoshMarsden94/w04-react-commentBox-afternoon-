var React = require('react');

var Comment = React.createClass ({
  render: function () {
    return (
      <div className="comment">
        <p>
          <b>{this.props.author}:</b>
          {" "}
          {this.props.children}
        </p>
      </div>
    );
  }
});

module.exports = Comment;