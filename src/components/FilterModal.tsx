import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { Formik, Form, Field } from 'formik';

interface FilterModalProps {
  open: boolean;
  onClose: () => void;
  onFilter: (filters: any) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ open, onClose, onFilter }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Filtrar Usuarios</DialogTitle>
      <DialogContent>
        <Formik
          initialValues={{ country: '', email: '', name: '' }}
          onSubmit={(values) => {
            onFilter(values);
            onClose();
          }}
        >
          {() => (
            <Form>
              <Field name="country" as={TextField} label="País" fullWidth margin="dense" />
              <Field name="email" as={TextField} label="Correo" fullWidth margin="dense" />
              <Field name="name" as={TextField} label="Nombre" fullWidth margin="dense" />
              <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button type="submit">Aplicar</Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default FilterModal;
