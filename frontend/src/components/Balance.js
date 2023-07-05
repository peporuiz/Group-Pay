import React, { useState, useEffect } from 'react';
import { Button, Table, Container } from 'react-bootstrap';

const Balance = ({ group, selectedGroupId }) => {
  const [balance, setBalance] = useState([]);

  useEffect(() => {
    setBalance([]);
  }, [selectedGroupId]);

  const calculateBalance = () => {
    // Crear un objeto para realizar el seguimiento del balance de cada participante
    const balanceMap = {};
  
    // Calcular el total pagado por cada participante
    group.expenses.forEach((expense) => {
      const { payer, participants, cost } = expense;
  
      // Calcular el número de participantes (excluyendo al pagador)
      const numParticipants = participants.length;
  
      // Calcular el monto que cada participante (excluyendo al pagador) debe pagar
      const amountPerParticipant = cost / numParticipants;
  
      // Registrar el pago del pagador
      if (balanceMap[payer]) {
        balanceMap[payer] += cost;
      } else {
        balanceMap[payer] = cost;
      }
  
      // Registrar el cobro para cada participante (excluyendo al pagador)
      participants.forEach((participant) => {
        if (balanceMap[participant]) {
          balanceMap[participant] -= amountPerParticipant;
        } else {
          balanceMap[participant] = -amountPerParticipant;
        }
      });
    });
  
    // Convertir el objeto de balance en un array de objetos
    const balanceArray = Object.entries(balanceMap).map(([participant, amount]) => ({
      participant,
      amount,
    }));
  
    // Actualizar el estado con el balance calculado
    setBalance(balanceArray);
  };
  

  return (
    <div>
      <Container className="text-center mt-4 mb-4">
        
      <Button variant="primary" onClick={calculateBalance}>
        Calcular Balance de Gastos
      </Button>
     
      {balance.length > 0 && (
        <Table className="custom-table">
          <thead>
          <br></br>
            <tr>
              <th>Participante</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {balance.map((item, index) => (
              <tr key={index}>
                <td>{item.participant}</td>
                <td>{item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      </Container>
    </div>
  );
};

export default Balance;