import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Nav, Navbar, Container } from "react-bootstrap";

import { Home } from "./components/Home";
import { About } from "./components/About";
import { HandicapCalculator } from "./components/HandicapCalculator";

function App() {
  const linkStyle = { color: "#fff" };
  return (
    <Router>
      <Navbar bg="dark" variant="dark" expand="md" collapseOnSelect sticky="top">
        <Navbar.Brand>
          <Link to="/" style={linkStyle}>
            Local Golf
            <span role="img" aria-label="Golf Flag Emoji">
              ⛳️
            </span>
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse>
          <Nav className="mr-auto">
            <Nav.Link>
              <Link to="/handicapCalculator" style={linkStyle}>
                Course Handicap Calculator
              </Link>
            </Nav.Link>
            <Nav.Link>
              <Link to="/about" style={linkStyle}>
                About
              </Link>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Container fluid>
        <Switch>
          <Route path="/about">
            <About></About>
          </Route>
          <Route path="/handicapCalculator">
            <HandicapCalculator></HandicapCalculator>
          </Route>
          <Route path="/">
            <Home></Home>
          </Route>
        </Switch>
      </Container>
    </Router>
  );
}

export default App;
