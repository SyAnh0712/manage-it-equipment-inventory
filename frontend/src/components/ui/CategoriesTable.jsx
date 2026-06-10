import PropTypes from "prop-types";
import { Table, Button as BSButton } from "react-bootstrap";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/formatDate";
import EmptyState from "../common/EmptyState";

const CategoriesTable = ({ categories, onDelete, isAdmin }) => {
  if (!categories || categories.length === 0) {
    return <EmptyState icon="bi-bookmark" title="No categories found" />;
  }

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>#</th>
          <th>Image</th>
          <th>Category Name</th>
          <th>Description</th>
          <th>Created At</th>
          {isAdmin && <th>Actions</th>}
        </tr>
      </thead>

      <tbody>
        {categories.map((category, index) => (
          <motion.tr
            key={category.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.025, duration: 0.18 }}
          >
            <td>{index + 1}</td>

            <td>
              {category.image_url ? (
                <img
                  src={category.image_url}
                  alt={category.name}
                  style={{ width: 60, height: 60, objectFit: "cover" }}
                />
              ) : (
                "No Image"
              )}
            </td>

            <td>{category.name}</td>

            <td>{category.description}</td>

            <td>{formatDate(category.created_at)}</td>

            {isAdmin && (
              <td>
                <Link to={`/categories/${category.id}/edit`}>
                  <BSButton variant="warning" size="sm" className="me-2">
                    <i className="bi bi-pencil"></i> Edit
                  </BSButton>
                </Link>

                <BSButton
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete(category.id)}
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

CategoriesTable.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.object).isRequired,
  onDelete: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool,
};

export default CategoriesTable;
