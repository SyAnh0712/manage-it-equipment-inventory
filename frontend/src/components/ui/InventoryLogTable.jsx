import { Image, Table } from "react-bootstrap";

import { resolveImageUrl } from "../../utils/imageUtils";

const InventoryLogTable = ({ logs, equipments = [] }) => {
  if (!logs || logs.length === 0) {
    return (
      <div className="alert alert-info text-center">
        No inventory logs found
      </div>
    );
  }

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>#</th>
          <th>Date</th>
          <th>Action</th>
          <th>Image</th>
          <th>Equipment</th>
          <th>Before</th>
          <th>Change</th>
          <th>After</th>
          <th>Reference</th>
          <th>User</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log, index) => {
          const equipment =
            equipments.find(
              (item) => String(item.id) === String(log.equipment_id),
            ) ||
            log.equipment ||
            {};
          const equipmentImageUrl =
            equipment.image_url || log.equipment?.image_url || "";

          return (
            <tr key={log.id || index}>
              <td>{index + 1}</td>
              <td>{new Date(log.created_at).toLocaleString()}</td>
              <td>{log.action_type}</td>
              <td>
                {equipmentImageUrl ? (
                  <Image
                    src={resolveImageUrl(equipmentImageUrl)}
                    width={56}
                    height={56}
                    rounded
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  "No Image"
                )}
              </td>
              <td>
                {equipment.code
                  ? `${equipment.code} - ${equipment.name}`
                  : equipment.name || "Unknown"}
              </td>
              <td>{log.quantity_before}</td>
              <td>{log.quantity_changed}</td>
              <td>{log.quantity_after}</td>
              <td>{log.reference_code || "-"}</td>
              <td>
                {log.creator?.full_name || log.creator?.username || "System"}
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default InventoryLogTable;
