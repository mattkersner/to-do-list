import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';

class App extends Component {
  constructor() {
    super();
    this.state = { todos: {} };

    this.handleNewTodoInput = this.handleNewTodoInput.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
    this.renderSelectedTodo = this.renderSelectedTodo.bind(this);
  }

  componentDidMount() {
    this.getTodos();
  }

  getTodos() {
    axios({
      url: '/todos.json',
      baseURL: 'https://to-do-list-app-d3d22.firebaseio.com/',
      method: 'GET'
    }).then((response) => {
      this.setState({ todos: response.data });
    }).catch((error) => {
      console.log(error);
    });
  }

  createTodo(todoText) {
    let newTodo = { title: todoText, createdAt: new Date };
    axios({
      url: `/todos.json`,
      baseURL: `https://to-do-list-app-d3d22.firebaseio.com/`,
      method: 'POST',
      data: newTodo
    }).then((response) => {
      console.log(response);
      let todos = this.state.todos;
      let todoId = response.data.name;
      console.log(todoId);
      todos[todoId] = newTodo;
      this.setState({ todos });
    }).catch((error) => {
      console.log(error);
    });
  }

  handleNewTodoInput(event) {
    if (event.charCode === 13) {
      this.createTodo(event.target.value);
      event.target.value = "";
    }
  }


  renderNewTodoBox() {
    return (
      <div className="new-todo-box pb-2">
        <input className="w-100" placeholder="What do you have to do?" onKeyPress={ this.handleNewTodoInput } />
      </div>
    );
  }

  renderTodoList() {
    let todoElements = [];

    for(let todoId in this.state.todos) {
      let todo = this.state.todos[todoId]

      todoElements.push(
        <div className="todo d-flex justify-content-between pb-4" key={todoId}>
          <div className="mt-2" onClick={() => this.selectTodo(todoId)}>
            <h4>{todo.title}</h4>
            <div>{moment(todo.createdAt).calendar()}</div>
          </div>
          <button
            className="ml-4 btn btn-link"
            onClick={ () => { this.deleteTodo(todoId) } }
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      );
    }

    return (
      <div className="todo-list">
        {todoElements}
      </div>
    );
  }

  deleteTodo(todoId) {
    axios.delete(`https://to-do-list-app-d3d22.firebaseio.com/todos/${todoId}.json`)
    .then((response) => {
      this.getTodos();
    })
  }

  selectTodo(todoId) {
    console.log(todoId);
    this.setState({
      currentTodo: todoId
    })
  }

  renderSelectedTodo() {
    if (this.state.edit) {
      let currentTodo = this.state.todos[this.state.currentTodo];
      return (
        <div>
          <button onClick={() => this.updateCurrentTodo(this.state.currentTodo, this.newText.value)}>Save</button>
          <input
            type="text"
            defaultValue={currentTodo.title}
            ref={(input) => this.newText = input}
            />
        </div>
      )
    };
    if (this.state.currentTodo) {
      let currentTodo = this.state.todos[this.state.currentTodo];
      return (
        <div>
          <button onClick={() => this.enableEditMode()}>Edit</button>
          <p>{currentTodo.title}</p>
        </div>
      )
    };
  }

  enableEditMode() {
    this.setState({ edit: true })
  }

  updateCurrentTodo(todoId, newText) {
    axios.patch(`https://to-do-list-app-d3d22.firebaseio.com/todos/${todoId}.json`, {
      title: newText,
    })
    .then((res) => {
      this.getTodos();
      this.setState({ edit: false })
    })
  }

  render() {
    return (
      <div className="App container-fluid">
        <div className="row pt-3">
          <div className="col-6 px-4">
            {this.renderNewTodoBox()}
            {this.renderTodoList()}
          </div>
          <div className="col-6 px-4">
            {this.renderSelectedTodo()}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
