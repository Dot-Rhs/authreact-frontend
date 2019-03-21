import React from "react";

class Authed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: Boolean(localStorage.getItem("my_token")),
      email: "",
      password: "",
      secret: ""
    };
  }

  onChange = event => {
    const { value, name } = event.target;
    this.setState(state => ({
      [name]: value
    }));
  };

  login = event => {
    event.preventDefault();
    fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password
      })
    })
      .then(res => res.json())
      .then(({ success, token }) => {
        if (success && token) {
          this.setState(() => ({ isLoggedIn: true }));
        }
        localStorage.setItem("my_token", token);
      });
  };

  // .then(res => res.json())
  // .then(data => this.setState(state => ({ isLoggedIn: data.success })));
  // another way of doing await

  // const data = await response.json();
  // console.log(data);
  // };

  logout = () => {
    localStorage.removeItem("my_token");
    this.setState(() => ({
      isLoggedIn: false,
      secret: ""
    }));
  };

  showSecret = async () => {
    const token = localStorage.getItem("my_token");
    const response = await fetch(
      `http://localhost:5000/private?token=${token}`
    );
    const data = await response.json();
    console.log(data);
    this.setState(() => ({
      secret: data.message
    }));
  };

  render() {
    return (
      <div>
        {this.state.isLoggedIn ? "Welcome Home" : "You aren't allowed here man"}
        {!this.state.isLoggedIn ? (
          <>
            <form onSubmit={this.login}>
              <input
                onChange={this.onChange}
                value={this.state.email}
                name="email"
                type="email"
                placeholder="email"
              />
              <input
                onChange={this.onChange}
                value={this.state.password}
                name="password"
                type="password"
                placeholder="password"
              />
              <button type="submit">Log In</button>
            </form>
          </>
        ) : (
          <>
            <button onClick={this.showSecret}>Show Secret</button>
            <div>{this.state.secret}</div>
            <button onClick={this.logout}>Logout</button>
          </>
        )}
      </div>
    );
  }
}

export default Authed;
