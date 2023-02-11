import logo from './logo.svg';
import './App.scss';
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import Toast from 'react-bootstrap/Toast';
import Container from 'react-bootstrap/Container';
import { Nav, Navbar } from 'react-bootstrap';


const ExampleToast = ({ children }) => {
  const [show, toggleShow] = useState(true);

  return (
    <Toast show={show} onClose={() => toggleShow(!show)}>
      <Toast.Header>
        <strong className="mr-auto">React-Bootstrap</strong>
      </Toast.Header>
      <Toast.Body>{children}</Toast.Body>
    </Toast>
  );
};


function App() {
  return (
    <div className="App">
      <Navbar bg="primary" variant="dark" >
        <Navbar.Brand href="#home">
          SCCS
        </Navbar.Brand>
        <Nav activeKey="/">
        <Nav.Item>
          <Nav.Link href="https://sccs.swarthmore.edu">Home</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="https://sccs.swarthmore.edu/docs">Docs</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/">GPA Calculator</Nav.Link>
        </Nav.Item>
      </Nav>
      </Navbar>

      
      <Container className="p-3">
      <h1 className="header">Welcome To React-Bootstrap</h1>
          <ExampleToast>
            We now have Toasts
            <span role="img" aria-label="tada">
              🎉
            </span>
          </ExampleToast>
      </Container>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and tod reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
