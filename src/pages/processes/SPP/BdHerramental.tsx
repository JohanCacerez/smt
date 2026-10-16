import { Button, Dropdown, Stack } from "react-bootstrap";
import DataTable from "react-data-table-component";

export default function BdHerramental() {
  const columns = [
    {
      name: "Familia",
      selector: (row) => row.familia,
      sortable: true,
    },
    {
      name: "Modelo",
      selector: (row) => row.modelo,
      sortable: true,
    },
    {
      name: "Setup",
      selector: (row) => row.setup,
      sortable: true,
    },
    {
      name: "Estencil top",
      selector: (row) => row.estencilTop,
      sortable: true,
    },
    {
      name: "Estencil bottom",
      selector: (row) => row.estencilBottom,
      sortable: true,
    },
    {
      name: "Navaja front",
      selector: (row) => row.navajaFront,
      sortable: true,
    },
    {
      name: "Navaja rear",
      selector: (row) => row.navajaRear,
      sortable: true,
    },
    {
      name: "Base",
      selector: (row) => row.base,
      sortable: true,
    },
  ];
  const data = [
    {
      familia: "Familia 1",
      modelo: "Modelo 1",
      setup: "Setup 1",
      estencilTop: "Estencil Top 1",
      estencilBottom: "Estencil Bottom 1",
      navajaFront: "Navaja Front 1",
      navajaRear: "Navaja Rear 1",
      base: "Base 1",
    },
  ];
  return (
    <div className="container mt-4">
      <h3 className="fw-bold">Base de Datos de Herramental</h3>
      <p className="text-muted">
        Gestión y registro de todos los herramentales disponibles en el proceso.
      </p>
      <Stack
        gap={2}
        direction="horizontal"
        className="d-flex justify-content-center mb"
      >
        <Dropdown>
          <Dropdown.Toggle>Agregar Herramental</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Estencil</Dropdown.Item>
            <Dropdown.Item>Navaja</Dropdown.Item>
            <Dropdown.Item>Base</Dropdown.Item>
            <Dropdown.Item>Pasta</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Button variant="primary">Gestion de familias</Button>
        <Button variant="primary">Gestion de modelos</Button>
        <Button variant="primary">Configurar setup</Button>
      </Stack>
      <div className="mb-3"></div>
      <DataTable columns={columns} data={data} pagination />
    </div>
  );
}
