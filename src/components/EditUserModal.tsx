import React, { useState, useEffect } from "react";
import { Modal, TextField, Button, CircularProgress } from "@mui/material";
import { Formik, Form, Field } from "formik";
import Swal from "sweetalert2";

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  user: any;
  onSave: (user: any) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  open,
  onClose,
  user,
  onSave,
}) => {
  const [initialValues, setInitialValues] = useState<any>(null); // Inicializar como null
  const [showSweetAlert, setShowSweetAlert] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(false); // Estado de carga de datos

  useEffect(() => {
    setLoadingData(true); // Activar el estado de carga de datos

    // Simular carga de datos desde una API (ejemplo: setTimeout)
    const fetchData = async () => {
      try {
        // Aquí deberías realizar tu lógica para obtener datos de una API
        // Simulamos una carga de datos con setTimeout
        setTimeout(() => {
          setInitialValues(user);
          setLoadingData(false); // Desactivar el estado de carga de datos después de obtener los datos
        }, 2000); // Simular una carga de 2 segundos (ajustar según la lógica real)
      } catch (error) {
        console.error("Error al obtener datos:", error);
        setLoadingData(false); // Asegurarse de desactivar el estado de carga de datos en caso de error
      }
    };

    fetchData();
  }, [user]); // Dependencia de user para recargar datos cuando cambie el usuario

  const handleSave = async (values: any) => {
    setFormSubmitting(true); // Indicar que se está enviando el formulario

    // Mostrar SweetAlert para confirmar la acción
    const result = await Swal.fire({
      title: "¿Está seguro de guardar los cambios?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "No, cancelar",
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return onSave(values);
      },
    });

    setFormSubmitting(false); // Finalizar el envío del formulario

    // Procesar la respuesta de SweetAlert después de onSave
    if (result.isConfirmed) {
      onClose(); // Cerrar el modal de MUI después de confirmar
      Swal.fire({
        title: "Guardado",
        text: "Los cambios han sido guardados.",
        icon: "success",
        toast: true,
        position: "top-end",
        timer: 3000,
        showConfirmButton: false,
      });
    }
  };

  // Si se está cargando los datos, mostrar un indicador de carga
  if (loadingData) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 9999,
        }}
      >
        <CircularProgress color="inherit" />
      </div>
    );
  }

  // Cuando se hayan cargado los datos, mostrar el modal de edición de usuario
  return (
    <Modal open={open && !formSubmitting} onClose={onClose}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          maxWidth: "80vw",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <Formik
          initialValues={initialValues}
          enableReinitialize
          onSubmit={handleSave}
        >
          {({ values, dirty }) => (
            <Form>
              <Field
                as={TextField}
                name="name.first"
                label="Nombre"
                fullWidth
                margin="normal"
                required
              />
              <Field
                as={TextField}
                name="name.last"
                label="Apellido"
                fullWidth
                margin="normal"
                required
              />
              <Field
                as={TextField}
                name="email"
                label="Correo"
                fullWidth
                margin="normal"
                required
                type="email"
              />
              <Field
                as={TextField}
                name="location.country"
                label="País"
                fullWidth
                margin="normal"
                required
              />
              <Field
                as={TextField}
                name="phone"
                label="Teléfono"
                fullWidth
                margin="normal"
                required
              />
              <Field
                as={TextField}
                name="dob.age"
                label="Edad"
                fullWidth
                margin="normal"
                required
              />
              <div style={{ marginTop: "16px", textAlign: "right" }}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={!dirty || formSubmitting}
                >
                  Guardar
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  style={{ marginLeft: "8px" }}
                  onClick={onClose}
                  disabled={formSubmitting}
                >
                  Cancelar
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};

export default EditUserModal;
