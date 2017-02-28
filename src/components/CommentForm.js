var React = require('react');

var CommentForm = React.createClass({
  getInitialState: function () {
    return {
      author: '',
      text: ''
    };
  },
  render: function () {
    return (
      <div className="comment-form">
        <h2 className="CommentFormHeading">Enter Comments Below ...</h2>
        <form onSubmit={this.handleSubmit}>
          
          <h4><label className="label">Name: </label></h4>
          <input className="nameBox" type="text" value={this.state.author} onChange={this.handleAuthorChange}/>
          
          <h4><label className="label">Comment: </label></h4>
          <input className="commentBox" type="text" value={this.state.text} onChange={this.handleTextChange}/>
          
          <button className="button" type="submit">POST COMMENT!</button>
        </form>
      </div>
    );
  },
  handleSubmit: function (event) {
    event.preventDefault();
    if (this.state.author.length === 0 || this.state.text.length === 0) return;
    
    var newComment = {
      author: this.state.author,
      text: this.state.text
    };
    this.props.addComment(newComment);
    
    this.setState({
      author: '', text: ''
    });
  },
  handleAuthorChange: function (event) {
    this.setState({
      author: event.target.value
    });
  },
  handleTextChange: function (event) {
    this.setState({
      text: event.target.value
    });
  }
});

module.exports = CommentForm;