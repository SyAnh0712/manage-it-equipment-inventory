import { Table } from "react-bootstrap";

const InventoryLogTable = ({ logs }) => {
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
          <th>Equipment</th>
          <th>Before</th>
          <th>Change</th>
          <th>After</th>
          <th>Reference</th>
          <th>User</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log, index) => (
          <tr key={log.id || index}>
            <td>{index + 1}</td>
            <td>{new Date(log.created_at).toLocaleString()}</td>
            <td>{log.action_type}</td>
            <td>
              {log.equipment?.code
                ? `${log.equipment.code} — ${log.equipment.name}`
                : log.equipment?.name || "Unknown"}
            </td>
            <td>{log.quantity_before}</td>
            <td>{log.quantity_changed}</td>
            <td>{log.quantity_after}</td>
            <td>{log.reference_code || "-"}</td>
            <td>
              {log.creator?.full_name || log.creator?.username || "System"}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default InventoryLogTable;
