import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';

const Login = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = (event) => {
    event.preventDefault();

    // Verificar las credenciales del usuario
    if (username === 'user' && password === 'password') {
      // Usuario válido, realizar acciones necesarias (cambiar el estado de isLoggedIn)
      setIsLoggedIn(true);
    } else {
      // Usuario inválido, mostrar mensaje de error
      setErrorMessage('Credenciales incorrectas');
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center vh-100">
      <Form onSubmit={handleLogin}>
        <h2 className="text-center mb-4">LOGIN</h2>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <Form.Group controlId="username">
          <Form.Label>Usuario</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <br></br>
        <Button variant="primary" type="submit" onClick={handleLogin}>
          Iniciar sesión
        </Button>
      </Form>
    </Container>
  );
};

export default Login;
