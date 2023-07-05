import React from 'react';
import {Navbar, Container} from 'react-bootstrap';


function NavigationBar() {
  return (
    <Navbar bg="primary" variant="dark">
      <Container fluid>
        <Navbar.Brand href="/home" className="mx-auto">Group Pay</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-dark-example" />
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
