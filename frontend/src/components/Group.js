import React, { useState } from 'react';
import { Modal, Form, Button, Table, Container } from 'react-bootstrap';
import Expense from './Expense';
import SelectedGroup from './SelectedGroup';
import NavigationBar from './NavigationBar';
import Balance from './Balance';

const Group = () => {
  const [showModal, setShowModal] = useState(false);                            //Controla si se muestra o no el modal de añadir grupo
  const [showDeleteModal, setShowDeleteModal] = useState(false);                //Controla si se muestra o no el modal de eliminar grupo
  const [groupName, setGroupName] = useState('');                               //Almacena el nombre del grupo que se está creando o modificando
  const [groupDescription, setGroupDescription] = useState('');                 //Almacena la descripción del grupo que se está creando o modificando
  const [groupMembers, setGroupMembers] = useState([]);                         //Array que almacena los miembros del grupo que se está creando o modificando
  const [groups, setGroups] = useState([]);                                     //Array que almacena la lista de grupos existentes
  const [selectedGroupId, setSelectedGroupId] = useState(null);                 //Almacena el ID del grupo seleccionado actualmente
  const [groupsToDelete, setGroupsToDelete] = useState([]);                     //Array que almacena los IDs de los grupos que se han marcado para eliminar
  const [showSuggestedRepayment, setShowSuggestedRepayment] = useState(false);  //Controla si se muestra o no la sugerencia de reembolso
  const [suggestedRepayment, setSuggestedRepayment] = useState({});             //Objeto que almacena la información de reembolso sugerida para el grupo seleccionado

  //Se establecen los valores iniciales para la creación de un nuevo grupo
  const handleAddGroup = () => {
    setShowModal(true);
    setGroupName('');
    setGroupDescription('');
    setGroupMembers([]);
  };

  //Se elimina un gasto específico de un grupo y se recalcula el balance del grupo
  const handleDeleteExpense = (groupId, expenseIndexes) => {
    setGroups((prevGroups) => {
      const updatedGroups = [...prevGroups];
      const groupIndex = updatedGroups.findIndex((group) => group.id === groupId);

      if (groupIndex !== -1) {
        const group = updatedGroups[groupIndex];

        // Eliminar los gastos seleccionados
        const updatedExpenses = group.expenses.filter((_, index) => !expenseIndexes.includes(index));
        group.expenses = updatedExpenses;

        // Recalcular el balance del grupo
        const updatedMembers = group.members.map((member) => ({
          name: member,
          balance: 0
        }));

        updatedExpenses.forEach((expense) => {
          const { payer, participants, cost } = expense;
          const totalParticipants = participants.length || 1;

          const payerIndex = updatedMembers.findIndex((member) => member.name === payer);
          if (payerIndex !== -1) {
            updatedMembers[payerIndex].balance += cost;
          }

          const splitCost = cost / totalParticipants;
          participants.forEach((participant) => {
            const participantIndex = updatedMembers.findIndex((member) => member.name === participant);
            if (participantIndex !== -1) {
              updatedMembers[participantIndex].balance -= splitCost;
            }
          });
        });

        updatedGroups[groupIndex] = group;
      }

      return updatedGroups;
    });
  };

  //Se encarga de agregar un nuevo gasto a un grupo específico
  const handleAddExpense = (groupId, newExpense) => {
    setGroups((prevGroups) => {
      return prevGroups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            expenses: [...group.expenses, newExpense]
          };
        }
        return group;
      });
    });
  };

  //Se calcula un reembolso sugerido para el grupo seleccionado
  const handleSuggestedRepayment = () => {
    const group = groups.find((group) => group.id === selectedGroupId);

    // Calcula el reembolso sugerido
    const balances = group.members.map((member) => ({
      name: member,
      balance: 0,
    }));

    group.expenses.forEach((expense) => {
      const { payer, participants, cost } = expense;
      const totalParticipants = participants.length || 1;
      const payerIndex = balances.findIndex((member) => member.name === payer);

      if (payerIndex !== -1) {
        balances[payerIndex].balance += cost;
      }

      const splitCost = cost / totalParticipants;

      participants.forEach((participant) => {
        const participantIndex = balances.findIndex(
          (member) => member.name === participant
        );

        if (participantIndex !== -1) {
          balances[participantIndex].balance -= splitCost;
        }
      });
    });

    // Filtrar los miembros que tienen balance negativo
    const debtors = balances.filter((member) => member.balance < 0);

    // Filtrar los miembros que tienen balance positivo
    const creditors = balances.filter((member) => member.balance > 0);

    // Calcular el reembolso óptimo utilizando los deudores y acreedores filtrados
    const suggestedRepayment = {};

    debtors.forEach((debtor) => {
      let debtorBalance = debtor.balance; // Variable auxiliar

      while (debtorBalance !== 0) {
        const creditor = creditors.find(
          (creditor) => creditor.balance > 0 && Math.abs(creditor.balance) >= Math.abs(debtor.balance)
        );


        if (!creditor) {
          break;
        }

        const repaymentAmount = Math.min(Math.abs(debtorBalance), creditor.balance);
        suggestedRepayment[debtor.name] = {
          creditor: creditor.name,
          amount: repaymentAmount,
        };

        debtorBalance += repaymentAmount;
        creditor.balance -= repaymentAmount;
      }
    });

    setSuggestedRepayment(suggestedRepayment);
    setShowSuggestedRepayment(true);
  };



  const handleModalClose = () => {
    setShowModal(false);
    setGroupName('');
    setGroupDescription('');
    setGroupMembers([]);
  };

  const handleGroupSubmit = (event) => {
    event.preventDefault();

    if (groupName.trim() === '' || groupMembers.length === 0) {
      return;
    }

    const newGroup = {
      id: groups.length > 0 ? groups[groups.length - 1].id + 1 : 1,
      name: groupName,
      description: groupDescription,
      members: groupMembers,
      expenses: []
    };

    setGroups((prevGroups) => [...prevGroups, newGroup]);
    setGroupName('');
    setGroupDescription('');
    setGroupMembers([]);
  };

  const handleGroupSelect = (groupId) => {
    setSelectedGroupId(groupId);
  };

  const handleCloseBalance = () => {
    setSelectedGroupId(null);
  };

  const handleDeleteGroup = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteModalClose = () => {
    setShowDeleteModal(false);
    setGroupsToDelete([]);
  };

  const handleDeleteModalSubmit = () => {
    setGroups((prevGroups) =>
      prevGroups.filter((group) => !groupsToDelete.includes(group.id))
    );
    setGroupsToDelete([]);
    setShowDeleteModal(false);
    setSelectedGroupId(null);
  };

  const handleGroupDeleteToggle = (groupId) => {
    if (groupsToDelete.includes(groupId)) {
      setGroupsToDelete((prevGroups) =>
        prevGroups.filter((id) => id !== groupId)
      );
    } else {
      setGroupsToDelete((prevGroups) => [...prevGroups, groupId]);
    }
  };

  return (
    <div>
      <NavigationBar />
      <Container className="text-center mt-4 mb-4">
        <h3>Grupos</h3>
        {groups.length === 0 ? (
          <p>No hay grupos creados.</p>
        ) : (
          <Table className="custom-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Número de Usuarios</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group) => (
                <tr key={group.id}>
                  <td>{group.name}</td>
                  <td>{group.members.length}</td>
                  <td>
                    <Button
                      variant="primary"
                      onClick={() => handleGroupSelect(group.id)}
                    >
                      Ver Detalles
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        <Button variant="primary" onClick={handleAddGroup}>
          Añadir Grupo
        </Button>
        {selectedGroupId && (
          <>
            <Button variant="danger" onClick={handleDeleteGroup}>
              Eliminar Grupo
            </Button>
          </>
        )}
      </Container>

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Añadir Grupo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleGroupSubmit}>
            <Form.Group controlId="groupName">
              <Form.Label>Nombre del Grupo:</Form.Label>
              <Form.Control
                type="text"
                value={groupName}
                onChange={(event) => setGroupName(event.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="groupDescription">
              <Form.Label>Descripción:</Form.Label>
              <Form.Control
                type="text"
                value={groupDescription}
                onChange={(event) => setGroupDescription(event.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="groupMembers">
              <Form.Label>Integrantes:</Form.Label>
              {groupMembers.map((member, index) => (
                <Form.Control
                  key={index}
                  type="text"
                  value={member}
                  onChange={(event) =>
                    setGroupMembers((prevMembers) =>
                      prevMembers.map((m, i) =>
                        i === index ? event.target.value : m
                      )
                    )
                  }
                />
              ))}
              <br></br>
              <Button
                variant="secondary"
                onClick={() => setGroupMembers([...groupMembers, ''])}
              >

                Añadir Integrante
              </Button>
            </Form.Group>
            <br></br>
            <Button variant="primary" type="submit">
              Guardar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal
        show={showSuggestedRepayment}
        onHide={() => setShowSuggestedRepayment(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Reembolso Sugerido</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {Object.entries(suggestedRepayment).length > 0 ? (
            Object.entries(suggestedRepayment).map(([debtor, { creditor, amount }]) => (
              <p key={debtor}>
                {debtor} debe reembolsar ${amount} a {creditor}
              </p>
            ))
          ) : (
            <p>No hay reembolsos pendientes</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSuggestedRepayment(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal show={showDeleteModal} onHide={handleDeleteModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Grupos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {groups.map((group) => (
              <Form.Check
                key={group.id}
                type="checkbox"
                label={group.name}
                checked={groupsToDelete.includes(group.id)}
                onChange={() => handleGroupDeleteToggle(group.id)}
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
      {selectedGroupId && (
        <>
          <SelectedGroup
            group={groups.find((group) => group.id === selectedGroupId)}
          />
          <Expense
            group={groups.find((group) => group.id === selectedGroupId)}
            onAddExpense={handleAddExpense}
            onDeleteExpenses={handleDeleteExpense}
          />
          {groups.find((group) => group.id === selectedGroupId) && (
            <Balance
              group={groups.find((group) => group.id === selectedGroupId)}
              expenses={groups.find((group) => group.id === selectedGroupId).expenses}
            />
          )}
          <Container className="text-center mt-4 mb-4">
            <Button variant="secondary" onClick={handleCloseBalance}>
              Cerrar Grupo
            </Button>
            <Button variant="success" onClick={handleSuggestedRepayment}>
              Reembolso sugerido
            </Button>
          </Container>
        </>
      )}
    </div>
  );
};

export default Group;