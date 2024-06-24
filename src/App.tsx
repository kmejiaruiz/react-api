import React from 'react';
import { Container } from '@mui/material';
import UserTable from './components/UserTable';

const App: React.FC = () => {
  return (
    <Container>
      <h1>Proyecto Final</h1>
      <UserTable />
    </Container>
  );
};

export default App;
