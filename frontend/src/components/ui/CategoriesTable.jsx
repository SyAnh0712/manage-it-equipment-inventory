import PropTypes from "prop-types";
import { Table, Button as BSButton } from "react-bootstrap";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/formatDate";

const CategoriesTable = ({ categories, onDelete, isAdmin }) => {
  if (!categories || categories.length === 0) {
    return (
      <div className="alert alert-info text-center">No categories found</div>
    );
  }

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>#</th>
          <th>Category Name</th>
          <th>Description</th>
          <th>Created At</th>
          {isAdmin && <th>Actions</th>}
        </tr>
      </thead>

      <tbody>
        {categories.map((category, index) => (
          <tr key={category.id}>
            <td>{index + 1}</td>

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
          </tr>
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
