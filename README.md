# Comment Box

We will be building a simple comments box following the main bits of functionality from services like Disqus or Facebook.

We will provide:

- A view of all of the comments
- A form to submit a comment
- Hooks to connect to a backend that will provide the data
- Live updates: other users' comments are popped into the comment view in real time.

## A note on the React libraries

- React is the library that let's us create components.
- ReactDOM is the library that renders a hierarchy of components into the DOM.
- They are 2 separate libraries to improve flexibility.
- React is not a framework, its purpose is to build UI components, not to structure your application or anything else.
- It provides a way of rendering, but you might want to do it somehow else, so you have the option of not having ReactDOM as a dependency of your project.

## Thinking in React

1. Start with a mock
  - Whiteboard ideas with students.
  - Make a simple mock of the application
  - Here's what our application's structure is going to look like:

  ```javascript
  ___CommentBox
    |
    |____CommentList
    |   |____Comment
    |   |____Comment
    |   |____...
    |
    |____CommentForm
  ```
2. Break the UI into a component hierarchy
  - Draw boxes around every component
3. Build a static version (skeleton)
4. Identify the minimal (but complete) representation of UI state
5. Identify where your state should live
6. Add inverse data flow a.k.a. lifting state up

- It's really useful to thing of our apps as a hierarchical tree of components.


- Let's build our top level component `CommentBox`:

```javascript
var React = require('react');
var ReactDOM = require('react-dom');

var CommentBox = React.createClass({
  render: function () {
    return (
      <div className="comment-box">
        <h1>CommentBox</h1>
      </div>
    );
  }
});

ReactDOM.render(
  <CommentBox />,
  document.getElementById('root')
);
```

Now we can build our child components one by one:

- Comment
```javascript
var Comment = React.createClass({
  render: function () {
    return (
      <div className="comment">
        <p>Comment</p>
      </div>
    );
  }
});
```
- CommentList
```javascript
var CommentList = React.createClass({
  render: function () {
    return (
      <div className="comment-list">
        <h2>CommentList</h2>
        <Comment />
        <Comment />
        <Comment />
      </div>
    );
  }
});
```

- CommentForm
```javascript
var CommentForm = React.createClass({
  render: function () {
    return (
      <div className="comment-form">
        <h2>CommentForm</h2>
      </div>
    );
  }
});
```

And now we can finally add them to our root component `CommenBox`:

```javascript
var CommentBox = React.createClass({
  render: function () {
    return (
      <div className="comment-box">
        <h1>Comments</h1>
        <CommentList />
        <CommentForm />
      </div>
    );
  }
});
```

## Identifying state

- What represents the state of our application?
- Let's represent our state by an array of object comments like:

```javascript
[
  {author: 'Mauro', text: 'Cashew nuts are the best!'},
  {author: 'Harriet', text: 'Pistachios are better.'},
  ...
]
```

- Now we need to decide where this state should live. What parts of our application need which parts of this state?
- `CommentList` needs the entire array of comments and it should map it to an array of `Comment` components, each with an individual object's data.
- It's a good rule of thumb to place state on the direct parent of the first component that needs it.
- In our case `CommentList` is the first component that needs the state, so it would be a good first guess to place our step in its direct parent, `CommentBox`.
 - This also makes sense because `CommentForm` will adding data to this state, as we will see later.

```javascript
var CommentBox = React.createClass({
  getInitialState: function () {
    return {
      data: [
        {author: 'Mauro', text: 'Cashew nuts are the best!'},
        {author: 'Harriet', text: 'Pistachios are better.'},
        ...
      ]
    };
  },
  render: function () {
    return (
      <div className="comment-box">
        <h1>Comments</h1>
        <CommentList comments={this.state.data}/>
        <CommentForm />
      </div>
    );
  }
});
```

- Now `CommentList` has access to the state through a `prop` called `comments` and everytime it gets updated, `CommentBox` will re-render `CommentList` with the updated data.
- Let's make `CommentList` render the UI state:

```javascript
var CommentList = React.createClass({
  render: function () {
    var commentNodes = this.props.comments.map(function (comment, i) {
      return (
        <Comment key={i} author={comment.author}>{comment.text}</Comment>
      );
    });
    return (
      <div className="comment-list">
        {commentNodes}
      </div>
    );
  }
});
```

- Now each instance of `Comment` receives data as the `author` and `children` props. Let's make it render them properly:

```javascript
var Comment = React.createClass({
  render: function () {
    return (
      <div className="comment">
        <h2 className="comment-author">{this.props.author}</h2>
        {this.props.children}
      </div>
    );
  }
});
```

## Implementing a controlled form component

- Form elements work a bit differently from other DOM elements bacause they naturally have some internal state.
- React respects the default behaviour of an HTML from element, but in most cases it's much more convenient to store the data input by the user in our component's state and handle the submission of the form through a JavaScript function. 
- The standard React way of doing this is through a "controlled component".
- The main problem that we are trying to solve here is that, normally, from the time the user starts typing until they submit a form, we have no idea of what the state of our UI is. 
- Controlled components solve this problem by storing every single input the user provides in their `state`, effectively having a **single source of truth** for the state of our UI. 
- The state of our UI is not what's on the screen. The state of our UI is what we have stored in `state` and that's what we render on the screen.
- Let's implement our `CommentForm` as a controlled component:

```javascript
var CommentForm = React.createClass({
  getInitialState: function () {
    return {
      author: '',
      text: ''
    }
  },
  render: function () {
    return (
      <form className="commentForm">
        <input 
          type="text" 
          placeholder="Your name" 
          value={this.state.author}
          onChange={this.handleAuthorChange}
        />
        <input 
          type="text" 
          placeholder="Say something..." 
          value={this.state.text} 
          onChange={this.handleTextChange}
        />
        <input type="submit" value="Post" />
      </form>
    );
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
```

- Here we define the state of our component as two strings: one for the author and one for the text.
- We link our state to our input elements through the `value` attribute. Now the inputs only display what we have in state, not what's typed into them (yet).
- We add `onChange` event handlers to both input elements. The `change` event gets fired every time the user makes a change to one of the inputs.
- We get access to the value of the input element via the `event` argument passed to our event handler, under the `target.value` property.
- Once we have the updated value of the input element, we update our component's state.
- Updating a component's state triggers a re-render that updates the value of the corresponding input element.
- Let's now handle the `submit` event of our form: when a button of type `submit` inside a form gets clicked, the `submit` event of that form gets fired. This is standard HTML behaviour and React recreates it.

```javascript
var CommentForm = React.createClass({
  // ...
  render: function () {
    return (
      <form className="commentForm" onSubmit={this.handleFormSubmit}>
        <input 
          type="text" 
          placeholder="Your name" 
          value={this.state.author}
          onChange={this.handleAuthorChange}
        />
        <input 
          type="text" 
          placeholder="Say something..." 
          value={this.state.text} 
          onChange={this.handleTextChange}
        />
        <input type="submit" value="Post" />
      </form>
    );
  },
  // ...
  handleFormSubmit: function (event) {
    // prevent the submit event from redirecting the browser
    event.preventDefault();
    console.log(this.state);
  }
});
```

- When the `submit` event gets fired we don't need to get any data from the event object because everything we need is already stored in state.

## Adding inverse data flow

- We have a problem now: our `CommentForm` component has the state with the new comment we want to add but the state with the list of comments is in its parent component, `CommentBox`.
- So far data flow in React has been unidirectional, parents pass data to children through props. That's it. So how could we solve this?
- We can create a handler function in `CommentBox` that receives a new comment and updates the state. Then, we can pass that handler as a prop to `CommentForm` and use that handler when the form is submitted.
- This is called inverse data flow and it's the React way of sending data from children to parents.

```javascript
var CommentBox = React.createClass({
  // ...
  render: function () {
    return (
      <div className="comment-box">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm addComment={this.addComment} />
      </div>
    );
  },
  addComment: function (author, text) {
    var newData = this.state.data.concat([{author: author, text: text}]);    
    this.setState({ data: newData });
  }
});

var CommentForm = React.createClass({
  // ...
  render: function () {
    return (
      <form className="comment-form" onSubmit={this.handleSubmit}>
        <h2>Anything to say?</h2>
        <input 
          type="text" 
          placeholder="Your name" 
          value={this.state.author}
          onChange={this.handleAuthorChange}
        />
        <input 
          type="text" 
          placeholder="Say something..." 
          value={this.state.text} 
          onChange={this.handleTextChange}
        />
        <input type="submit" value="Post" />
      </form>
    );
  },
  handleSubmit: function (event) {
    event.preventDefault();
    this.props.addComment(this.state.author, this.state.text);
    this.setState({
      author: '', text: ''
    });
  },
  // ...
});
```

## Fetching data from an API

- The static version of our app is finished. Let's try connecting our app to data that we fetch from an API instead of a hardcoded array.
- To handle the AJAX requests we will use a library called [superagent](https://github.com/visionmedia/superagent).
- Let's see an example of making an HTTP GET request to the [`CommentBox` API](https://comment-box-api.herokuapp.com):

```javascript
var request = require('superagent');

request
  .get('https://comment-box-api.herokuapp.com/api/comments')
  .end(function (error, response) {
    if (error) return console.log(error);
    console.log(response.body);
  });
```

- If the GET request is successful we will see an array of comment objects logged on the screen.
- It's important to understand that fetching data from an API is an asynchronous task, i.e. it doesn't happen immediately and it doesn't block execution of code after it.
- When we call the `end()` method we are sending the request. The information gets translated to the HTTP protocol and the message travels to the server where the API is hosted (somewhere in Ireland).
- The server processes the request (in JavaScript), finds the appropriate data in the database and responds with it. The message gets translated back to HTTP protocol and sent back to our application (the original sender of the request).
- With the `end()` method we are defining a callback function, i.e. what should happen once the response comes back. This callback takes 2 arguments: an error (which will be nothing if everything went fine) and the response object, which carries all the information we requested.
- Asynchronous tasks in JavaScript are non-blocking by default (we will see how to make them blocking later). This means that, for example, if you logged something to the screen after the `end()` method call, that would happen before the callback gets called.
- **Remember!** We are passing a function to the `end()` method, we are not calling it. The `end()` method calls it later when it has all the information it needs.
- Without this non-blocking asynchronous behaviour, our applications would freeze while waiting for things to load.
- Let's add data fetching to our `CommentBox` component (where our state lives):

```javascript
var CommentBox = React.createClass({
  getInitialState: function () {
    return {
      data: []
    };
  },
  componentDidMount: function () {
    request
      .get(URL + '/comments')
      .end(function (err, res) {
        if (err) return console.log(err);
        this.setState({data: res.body});
      }.bind(this));
  },
  render: function () {
    return (
      <div className="comment-box">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm addComment={this.addComment} />
      </div>
    );
  },
  addComment: // ...
});
```

- First of all we deleted our hardcoded data from `getInitialState`.
- We added our `superagent` GET request to a method called `componentDidMount`. This method is a special React lifecycle method that runs once after the component mounts and before it renders for the first time.
- In the callback to the GET request we update the component's state with the body of the response.
- Even though we fire the request before the first render, because of its non-blocking behaviour, React continues its process and renders `CommentBox`. Here's where assigining `state.data` to an empty array in `getInitialState` becomes important.
- If we hadn't done it, `state.data` would be `undefined` and `CommentList` wouldn't know what to do. Because it's an empty array, `CommentList` can still map it and render nothing while the data comes back.

## Posting data to an API

- Making a POST request works similarly to making a GET request, with the only difference that we need to send some data on the request.
- Let's see how we would make a POST request to the provided API:

```javascript
request
  .post(https://comment-box-api.herokuapp.com/api/comments)
  .send({
    author: "Mauro", text: "Test comment"
  })
  .end(function (error, response) {
    if (error) return console.log(error);
    console.log(response.body);
  });
```
- If no errors occurred this snippet should log into the console the same comment object that the server would have stored in the database.
- If no author or text fields were provided the request would fail and nothing would get saved into the database. The response would come back with an error object.
- Let's add this POST request to our `addCOmment` method in `CommentBox`:

```javascript
var CommentBox = React.createClass({
  // ...
  addComment: function (author, text) {
    request
      .post('https://comment-box-api.herokuapp.com/api/comments')
      .send({author: author, text: text})
      .end(function (err, res) {
        if (err) return console.log(err);
        var newData = this.state.data.concat([res.body]);    
        this.setState({ data: newData });
      }.bind(this));
  }
});
```

- Here we send in the body of the request the arguments passed to the function (which come from the form submit event) and we update the state in the callback.
- It's important to wait until the response comes back from the server to update the state because we don't know for sure if the operation will succeed and we could end up with out-of-sync data between the server and the client.


## Implementing Live update

- We want our app to update automatically once new comments are posted to the API from other clients.
- Because we have no control over the server that hosts the API, we can't make it "push" data when it updates.
- We can solve this problem using the HTTP requests by "polling" the server, i.e. requesting data from it every X amount of time and updating our client side data when appropriate.
- Every time we update the state of a component React will re-render everything affected by said update and our app will magically "refresh" without us even telling it to.

```javascript
var CommentBox = React.createClass({
  // ...
  componentDidMount: function () {
    setInterval(this.fetchComments(), this.props.pollInterval);
  },
  render: function () {
    return (
      <div className="comment-box">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm addComment={this.addComment} />
      </div>
    );
  },
  fetchComments: function () {
    request
      .get(this.props.url + '/comments')
      .end(function (err, res) {
        if (err) return console.log(err);
        this.setState({data: res.body});
      }.bind(this));
  },
  // ...
});

ReactDOM.render(
  <CommentBox url='https://comment-box-api.herokuapp.com/api' pollInterval={1000} />,
  document.getElementById('root')
);
```

- First we extract the comment fetching functionality into its own method. It's a common enough task to do so.
- Then, we use the prop `pollInterval` to create a recurrent call of the `fetchComments()` method by calling `setInterval()` in `componentDidMount()`.
- We need to remember to pass the `pollInterval` prop where we instantiate `CommentBox` and, since we are here`, we can also move the API url from a global variable to a prop.
- Our application will now refresh itself every 1000 milliseconds and because React only re-renders the parts of the DOM that have changed, it will look like new comments keep appearing ath the end of the list.

## Separating components into files

- As our components grow in complexity, it's a good idea to start separating components into individual files. This improves maintainability adn it makes it easier to follow the hierarchy of components (a parent only needs to worry about their direct children).
- It usually makes sense to do this refactor from the bottom up:

```javascript
// src/components/Comment.js
var React = require('react');

var Comment = React.createClass({
  // ...
});

module.exports = Comment;
```

```javascript
// src/components/CommentList.js
var React = require('react');

var Comment = require('./Comment');

var CommentList = React.createClass({
  // ...
});

module.exports = CommentList;
```

```javascript
// src/components/CommentForm
var React = require('react');

var CommentForm = React.createClass({
  // ...
});

module.exports = CommentForm;
```

```javascript
var React = require('react');
var request = require('superagent');

var CommentList = require('./CommentList');
var CommentForm = require('./CommentForm');

var CommentBox = React.createClass({
  // ...
});

module.exports = CommentBox;
```

```javascript
var React = require('react');
var ReactDOM = require('react-dom');

var CommentBox = require('./components/CommentBox');

ReactDOM.render(
  <CommentBox url='https://comment-box-api.herokuapp.com/api' pollInterval={1000} />,
  document.getElementById('root')
);
```

- Notice how the amount of code in each file is much more manageable. Usually you will be making changes in one component at a time, so having them in separate files makes them easier to find. 
- If your changes span across several components, it's easy to find parents/children by following the chain of require/exports.

