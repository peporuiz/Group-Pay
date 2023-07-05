import React from 'react';
import { Container, Card, ListGroup } from 'react-bootstrap';

const SelectedGroup = ({ group }) => {
  return (
    <Container className="text-center mt-4 mb-4">
  <Card>
    <Card.Header>Detalles del Grupo</Card.Header>
    <Card.Body>
      <Card.Title>{group.name}</Card.Title>
      <Card.Text>{group.description}</Card.Text>
    </Card.Body>
    <ListGroup variant="flush">
      <ListGroup.Item>
        <strong>Participantes:</strong> {group.members.join(', ')}
      </ListGroup.Item>
    </ListGroup>
  </Card>
</Container>
  

  );
};

export default SelectedGroup;










