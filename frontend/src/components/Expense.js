import React, { useState } from 'react';
import { Button, Modal, Form, Table, Container } from 'react-bootstrap';

const Expense = ({ group, onAddExpense, onDeleteExpenses }) => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [expenseName, setExpenseName] = useState('');
  const [expenseCost, setExpenseCost] = useState('');
  const [expensePayer, setExpensePayer] = useState('');
  const [expenseParticipants, setExpenseParticipants] = useState([]);
  const [expensesToDelete, setExpensesToDelete] = useState([]);

  const handleAddExpense = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setExpenseName('');
    setExpenseCost('');
    setExpensePayer('');
    setExpenseParticipants([]);
  };

  const handleExpenseSubmit = (event) => {
    event.preventDefault();

    if (
      expenseName.trim() === '' ||
      expenseCost.trim() === '' ||
      expensePayer.trim() === '' ||
      expenseParticipants.length === 0
    ) {
      return;
    }

    const newExpense = {
      name: expenseName,
      cost: parseFloat(expenseCost),
      payer: expensePayer,
      participants: expenseParticipants
    };

    onAddExpense(group.id, newExpense);

    setShowModal(false);
    setExpenseName('');
    setExpenseCost('');
    setExpensePayer('');
    setExpenseParticipants([]);
  };

  const handleDeleteExpenses = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteModalClose = () => {
    setShowDeleteModal(false);
    setExpensesToDelete([]);
  };

  const handleDeleteModalSubmit = () => {
    onDeleteExpenses(group.id, expensesToDelete);
    setShowDeleteModal(false);
    setExpensesToDelete([]);
  };

  const handleExpenseDeleteToggle = (expenseIndex) => {
    if (expensesToDelete.includes(expenseIndex)) {
      setExpensesToDelete((prevExpenses) =>
        prevExpenses.filter((index) => index !== expenseIndex)
      );
    } else {
      setExpensesToDelete((prevExpenses) => [...prevExpenses, expenseIndex]);
    }
  };

  return (
    <div>
      <Container className="text-center mt-4 mb-4">
        <Button variant="primary" onClick={handleAddExpense}>
          Añadir Gasto
        </Button>

        {group.expenses.length > 0 && (
          <>
            <Button variant="danger" onClick={handleDeleteExpenses}>
              Eliminar Gastos
            </Button>
            <Table className="custom-table">
              <thead>
                <br />
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Costo</th>
                  <th>Pagador</th>
                  <th>Participantes</th>
                </tr>
              </thead>
              <tbody>
                {group.expenses.map((expense, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{expense.name}</td>
                    <td>{expense.cost}</td>
                    <td>{expense.payer}</td>
                    <td>{expense.participants.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
      </Container>
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Añadir Gasto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleExpenseSubmit}>
            <Form.Group controlId="expenseName">
              <Form.Label>Nombre del Gasto</Form.Label>
              <Form.Control
                type="text"
                value={expenseName}
                onChange={(e) => setExpenseName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="expenseCost">
              <Form.Label>Coste del Gasto</Form.Label>
              <Form.Control
                type="number"
                value={expenseCost}
                onChange={(e) => setExpenseCost(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="expensePayer">
              <Form.Label>Quién Pagó:</Form.Label>
              <Form.Control
                as="select"
                value={expensePayer}
                onChange={(event) => setExpensePayer(event.target.value)}
              >
                <option value="">Seleccionar pagador</option>
                {group.members.map((member, index) => (
                  <option key={index} value={member}>
                    {member}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="expenseParticipants">
              <Form.Label>Participantes</Form.Label>
              {group.members.map((member, index) => (
                <Form.Check
                  key={index}
                  type="checkbox"
                  id={`expenseParticipant${index}`}
                  label={member}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setExpenseParticipants((prevParticipants) => {
                      if (isChecked) {
                        return [...prevParticipants, member];
                      } else {
                        return prevParticipants.filter(
                          (participant) => participant !== member
                        );
                      }
                    });
                  }}
                />
              ))}
              <Form.Text className="text-muted">
                Selecciona los participantes del gasto.
              </Form.Text>
            </Form.Group>
            <Button variant="primary" type="submit">
              Añadir Gasto
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showDeleteModal} onHide={handleDeleteModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Gastos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {group.expenses.map((expense, index) => (
              <Form.Check
                key={index}
                type="checkbox"
                label={expense.name}
                checked={expensesToDelete.includes(index)}
                onChange={() => handleExpenseDeleteToggle(index)}
              />
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteModalClose}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteModalSubmit}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Expense;


