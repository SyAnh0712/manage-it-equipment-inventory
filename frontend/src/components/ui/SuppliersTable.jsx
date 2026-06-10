import PropTypes from "prop-types";
import { Table, Button as BSButton } from "react-bootstrap";
import { Link } from "react-router-dom";

const SuppliersTable = ({ suppliers, onDelete, isAdmin }) => {
  if (!suppliers || suppliers.length === 0) {
    return (
      <div className="alert alert-info text-center">No suppliers found</div>
    );
  }

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Phone</th>
          <th>Email</th>
          <th>Address</th>
          {isAdmin && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {suppliers.map((supplier, index) => (
          <tr key={supplier.id}>
            <td>{index + 1}</td>
            <td>{supplier.name}</td>
            <td>{supplier.phone}</td>
            <td>{supplier.email}</td>
            <td>{supplier.address}</td>
            {isAdmin && (
              <td>
                <Link to={`/suppliers/${supplier.id}/edit`}>
                  <BSButton variant="warning" size="sm" className="me-2">
                    <i className="bi bi-pencil"></i> Edit
                  </BSButton>
                </Link>
                <BSButton
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete(supplier.id)}
                >
                  <i className="bi bi-trash"></i> Delete
                </BSButton>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

SuppliersTable.propTypes = {
  suppliers: PropTypes.arrayOf(PropTypes.object).isRequired,
  onDelete: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool,
};

export default SuppliersTable;
