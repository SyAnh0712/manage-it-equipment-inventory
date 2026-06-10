import { Image, Table } from "react-bootstrap";
import { motion } from "motion/react";

import { resolveImageUrl } from "../../utils/imageUtils";
import EmptyState from "../common/EmptyState";

const InventoryLogTable = ({ logs, equipments = [] }) => {
  if (!logs || logs.length === 0) {
    return (
      <EmptyState
        icon="bi-journal-text"
        title="No inventory logs found"
        message="Inventory activity will appear here after stock changes."
      />
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
            <motion.tr
              key={log.id || index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.025, duration: 0.18 }}
            >
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
            </motion.tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default InventoryLogTable;
