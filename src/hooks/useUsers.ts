import { useState, useEffect } from 'react';
import axios from 'axios';

const useUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  useEffect(() => {
    axios.get('https://randomuser.me/api/?results=10')
      .then(response => setUsers(response.data.results))
      .catch(error => console.error(error));
  }, []);
  return [users, setUsers] as const;
};

export default useUsers;
