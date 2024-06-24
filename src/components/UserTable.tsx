import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  CircularProgress,
} from "@mui/material";
import Swal from "sweetalert2";
import ColumnSelectorModal from "./ColumnSelectorModal";
import FilterModal from "./FilterModal";
import EditUserModal from "./EditUserModal";
import UserRow from "./UserRow";

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [compactView, setCompactView] = useState(true);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [columnModalOpen, setColumnModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true); // Estado de carga inicial
  const [error, setError] = useState<string | null>(null); // Estado para manejar errores de API

  useEffect(() => {
    axios
      .get("https://randomuser.me/api/?results=10")
      .then((response) => {
        setUsers(response.data.results);
        setFilteredUsers(response.data.results);
        setLoading(false); // Desactivar el estado de carga inicial después de obtener los datos
      })
      .catch((error) => {
        console.error(error);
        setLoading(false); // Asegurarse de desactivar el estado de carga inicial en caso de error
        setError("No se pudo obtener la información solicitada."); // Establecer el mensaje de error
      });
  }, []);

  const handleDelete = (index: number) => {
    Swal.fire({
      title: "¿Está seguro de eliminar este usuario?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "No, cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const newUsers = users.filter((_, i) => i !== index);
        setUsers(newUsers);
        setFilteredUsers(newUsers);
        Swal.fire({
          title: "Eliminado",
          text: "El usuario ha sido eliminado.",
          icon: "success",
          toast: true,
          position: "top-end",
          timer: 3000,
          showConfirmButton: false,
        });
      }
    });
  };

  const handleEdit = (user: any) => {
    setCurrentUser(user);
    setEditModalOpen(true);
  };

  const handleSave = (user: any) => {
    const newUsers = users.map((u) =>
      u.login.uuid === user.login.uuid ? user : u
    );
    setUsers(newUsers);
    setFilteredUsers(newUsers);
  };

  const handleFilter = (filters: any) => {
    const filtered = users.filter((user) => {
      const matchesCountry = filters.country
        ? user.location.country
            .toLowerCase()
            .includes(filters.country.toLowerCase())
        : true;
      const matchesEmail = filters.email
        ? user.email.toLowerCase().includes(filters.email.toLowerCase())
        : true;
      const matchesName = filters.name
        ? `${user.name.first} ${user.name.last}`
            .toLowerCase()
            .includes(filters.name.toLowerCase())
        : true;
      return matchesCountry && matchesEmail && matchesName;
    });
    setFilteredUsers(filtered);
  };

  const handleColumnChange = (column: string) => {
    setSelectedColumns((prev) =>
      prev.includes(column)
        ? prev.filter((c) => c !== column)
        : [...prev, column]
    );
  };

  // Si se está cargando, mostrar un indicador de carga
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column-reverse",
          minHeight: "80vh",
        }}
      >
        <p>Cargando...</p>
        <CircularProgress color="primary" />
      </div>
    );
  }

  // Si hay un error al obtener la información, mostrar el mensaje de error
  if (error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          minHeight: "80vh",
        }}
      >
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "left",
          alignItems: "left",
          gap: "10px",
        }}
      >
        <Button
          variant="contained"
          onClick={() => setCompactView(!compactView)}
        >
          {compactView ? "Versión Expandida" : "Versión Compacta"}
        </Button>
        <Button variant="contained" onClick={() => setColumnModalOpen(true)}>
          Seleccionar Columnas
        </Button>
        <Button variant="contained" onClick={() => setFilterModalOpen(true)}>
          Filtrar Usuarios
        </Button>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Correo</TableCell>
            <TableCell>País</TableCell>
            {!compactView && <TableCell>Teléfono</TableCell>}
            {!compactView && <TableCell>Edad</TableCell>}
            {compactView && selectedColumns.includes("Edad") && (
              <TableCell>Edad</TableCell>
            )}
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredUsers.map((user, index) => (
            <UserRow
              key={index}
              user={user}
              index={index}
              compactView={compactView}
              onDelete={handleDelete}
              onEdit={handleEdit}
              selectedColumns={selectedColumns}
            />
          ))}
        </TableBody>
      </Table>
      {currentUser && (
        <EditUserModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          user={currentUser}
          onSave={handleSave}
        />
      )}
      <ColumnSelectorModal
        open={columnModalOpen}
        onClose={() => setColumnModalOpen(false)}
        selectedColumns={selectedColumns}
        onChange={handleColumnChange}
      />
      <FilterModal
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        onFilter={handleFilter}
      />
    </>
  );
};

export default UserTable;
