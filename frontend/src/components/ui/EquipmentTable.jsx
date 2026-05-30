import PropTypes from "prop-types";
import { Table, Button as BSButton, Image } from "react-bootstrap";
import { Link } from "react-router-dom";

const EquipmentTable = ({ equipments, onDelete, isAdmin }) => {
  if (!equipments || equipments.length === 0) {
    return (
      <div className="alert alert-info text-center">No equipment found</div>
    );
  }

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>#</th>
          <th>Image</th>
          <th>Code</th>
          <th>Name</th>
          <th>Unit</th>
          <th>Quantity</th>
          <th>Price</th>
          {isAdmin && <th>Actions</th>}
        </tr>
      </thead>

      <tbody>
        {equipments.map((item, index) => (
          <tr key={item.id}>
            <td>{index + 1}</td>

            <td>
              {item.image_url ? (
                <Image
                  src={item.image_url}
                  width={60}
                  height={60}
                  rounded
                  style={{ objectFit: "cover" }}
                />
              ) : (
                "No Image"
              )}
            </td>

            <td>{item.code}</td>

            <td>{item.name}</td>

            <td>{item.unit}</td>

            <td>{item.quantity}</td>

            <td>${item.price}</td>

            {isAdmin && (
              <td>
                <Link to={`/equipment/${item.id}/edit`}>
                  <BSButton variant="warning" size="sm" className="me-2">
                    <i className="bi bi-pencil"></i> Edit
                  </BSButton>
                </Link>

                <BSButton
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete(item.id)}
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

EquipmentTable.propTypes = {
  equipments: PropTypes.arrayOf(PropTypes.object).isRequired,
  onDelete: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool,
};

export default EquipmentTable;
