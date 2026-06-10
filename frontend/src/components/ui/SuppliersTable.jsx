import PropTypes from "prop-types";
import { Table, Button as BSButton } from "react-bootstrap";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import EmptyState from "../common/EmptyState";

const SuppliersTable = ({ suppliers, onDelete, isAdmin }) => {
  if (!suppliers || suppliers.length === 0) {
    return <EmptyState icon="bi-truck" title="No suppliers found" />;
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
          <motion.tr
            key={supplier.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.025, duration: 0.18 }}
          >
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
          </motion.tr>
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
