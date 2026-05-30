import { utils, writeFile } from "xlsx";
import jsPDF from "jspdf";

const downloadExcel = (fileName, rows, headers) => {
  const worksheetData = [headers.map((header) => header.label)];
  rows.forEach((row) => {
    worksheetData.push(headers.map((header) => row[header.key] ?? ""));
  });

  const worksheet = utils.aoa_to_sheet(worksheetData);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "Report");
  writeFile(workbook, fileName);
};

const downloadPdf = (fileName, title, headers, rows) => {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const leftMargin = 40;
  const topMargin = 40;
  const lineHeight = 18;
  let y = topMargin;

  doc.setFontSize(16);
  doc.text(title, leftMargin, y);
  y += lineHeight * 1.5;

  const headerLabels = headers.map((header) => header.label).join(" | ");
  doc.setFontSize(11);
  doc.text(headerLabels, leftMargin, y);
  y += lineHeight;

  rows.forEach((row, index) => {
    const rowText = headers
      .map((header) => String(row[header.key] ?? ""))
      .join(" | ");

    const splitText = doc.splitTextToSize(rowText, 520);
    splitText.forEach((line) => {
      if (y > 740) {
        doc.addPage();
        y = topMargin;
      }
      doc.text(line, leftMargin, y);
      y += lineHeight;
    });

    if (index !== rows.length - 1) {
      y += 4;
    }
  });

  doc.save(fileName);
};

export const exportImportOrdersToExcel = (orders) => {
  const headers = [
    { label: "Order Code", key: "code" },
    { label: "Supplier", key: "supplier" },
    { label: "Status", key: "status" },
    { label: "Note", key: "note" },
    { label: "Created By", key: "creator" },
    { label: "Created At", key: "created_at" },
  ];

  const rows = orders.map((order) => ({
    code: order.code,
    supplier: order.supplier?.name || "-",
    status: order.status,
    note: order.note || "-",
    creator: order.creator?.full_name || order.creator?.username || "-",
    created_at: new Date(order.created_at).toLocaleString(),
  }));

  downloadExcel(`import-orders-${Date.now()}.xlsx`, rows, headers);
};

export const exportImportOrdersToPdf = (orders) => {
  const headers = [
    { label: "Order Code", key: "code" },
    { label: "Supplier", key: "supplier" },
    { label: "Status", key: "status" },
    { label: "Note", key: "note" },
    { label: "Created By", key: "creator" },
    { label: "Created At", key: "created_at" },
  ];

  const rows = orders.map((order) => ({
    code: order.code,
    supplier: order.supplier?.name || "-",
    status: order.status,
    note: order.note || "-",
    creator: order.creator?.full_name || order.creator?.username || "-",
    created_at: new Date(order.created_at).toLocaleString(),
  }));

  downloadPdf(
    `import-orders-${Date.now()}.pdf`,
    "Import Orders Report",
    headers,
    rows,
  );
};

export const exportExportOrdersToExcel = (orders) => {
  const headers = [
    { label: "Order Code", key: "code" },
    { label: "Department", key: "department" },
    { label: "Receiver", key: "receiver" },
    { label: "Status", key: "status" },
    { label: "Note", key: "note" },
    { label: "Created By", key: "creator" },
    { label: "Created At", key: "created_at" },
  ];

  const rows = orders.map((order) => ({
    code: order.code,
    department: order.department || "-",
    receiver: order.receiver || "-",
    status: order.status,
    note: order.note || "-",
    creator: order.creator?.full_name || order.creator?.username || "-",
    created_at: new Date(order.created_at).toLocaleString(),
  }));

  downloadExcel(`export-orders-${Date.now()}.xlsx`, rows, headers);
};

export const exportExportOrdersToPdf = (orders) => {
  const headers = [
    { label: "Order Code", key: "code" },
    { label: "Department", key: "department" },
    { label: "Receiver", key: "receiver" },
    { label: "Status", key: "status" },
    { label: "Note", key: "note" },
    { label: "Created By", key: "creator" },
    { label: "Created At", key: "created_at" },
  ];

  const rows = orders.map((order) => ({
    code: order.code,
    department: order.department || "-",
    receiver: order.receiver || "-",
    status: order.status,
    note: order.note || "-",
    creator: order.creator?.full_name || order.creator?.username || "-",
    created_at: new Date(order.created_at).toLocaleString(),
  }));

  downloadPdf(
    `export-orders-${Date.now()}.pdf`,
    "Export Orders Report",
    headers,
    rows,
  );
};

const buildDetailRows = (order, items, includePrice = false) =>
  items.map((item) => {
    const equipment = item.equipment || item.equipment_id;
    return {
      code:
        equipment?.code || item.equipmentCode || item.equipment_id || "-",
      name: equipment?.name || item.equipmentName || "-",
      quantity: item.quantity,
      unit_price: includePrice ? item.unit_price || 0 : undefined,
      total: includePrice
        ? (item.quantity || 0) * (item.unit_price || 0)
        : undefined,
    };
  });

export const exportImportOrderDetailsToExcel = (order, items) => {
  const headers = [
    { label: "Equipment Code", key: "code" },
    { label: "Equipment Name", key: "name" },
    { label: "Quantity", key: "quantity" },
    { label: "Unit Price", key: "unit_price" },
    { label: "Total", key: "total" },
  ];

  const rows = buildDetailRows(order, items, true);
  downloadExcel(
    `import-order-${order.code || order.id}-details.xlsx`,
    rows,
    headers,
  );
};

export const exportImportOrderDetailsToPdf = (order, items) => {
  const headers = [
    { label: "Equipment Code", key: "code" },
    { label: "Equipment Name", key: "name" },
    { label: "Quantity", key: "quantity" },
    { label: "Unit Price", key: "unit_price" },
    { label: "Total", key: "total" },
  ];

  const rows = buildDetailRows(order, items, true);
  downloadPdf(
    `import-order-${order.code || order.id}-details.pdf`,
    `Import Order ${order.code || order.id} Details`,
    headers,
    rows,
  );
};

export const exportExportOrderDetailsToExcel = (order, items) => {
  const headers = [
    { label: "Equipment Code", key: "code" },
    { label: "Equipment Name", key: "name" },
    { label: "Quantity", key: "quantity" },
  ];

  const rows = buildDetailRows(order, items, false);
  downloadExcel(
    `export-order-${order.code || order.id}-details.xlsx`,
    rows,
    headers,
  );
};

export const exportExportOrderDetailsToPdf = (order, items) => {
  const headers = [
    { label: "Equipment Code", key: "code" },
    { label: "Equipment Name", key: "name" },
    { label: "Quantity", key: "quantity" },
  ];

  const rows = buildDetailRows(order, items, false);
  downloadPdf(
    `export-order-${order.code || order.id}-details.pdf`,
    `Export Order ${order.code || order.id} Details`,
    headers,
    rows,
  );
};

export const exportInventoryLogsToExcel = (logs) => {
  const headers = [
    { label: "Thời gian", key: "created_at" },
    { label: "Loại", key: "action_type" },
    { label: "Thiết bị", key: "equipment" },
    { label: "Trước", key: "quantity_before" },
    { label: "Thay đổi", key: "quantity_changed" },
    { label: "Sau", key: "quantity_after" },
    { label: "Mã tham chiếu", key: "reference_code" },
    { label: "Người thao tác", key: "creator" },
  ];

  const rows = logs.map((log) => ({
    created_at: new Date(log.created_at).toLocaleString(),
    action_type: log.action_type,
    equipment: log.equipment
      ? `${log.equipment.code} - ${log.equipment.name}`
      : "-",
    quantity_before: log.quantity_before,
    quantity_changed: log.quantity_changed,
    quantity_after: log.quantity_after,
    reference_code: log.reference_code || "-",
    creator: log.creator?.full_name || log.creator?.username || "-",
  }));

  downloadExcel(`inventory-logs-${Date.now()}.xlsx`, rows, headers);
};

export const exportInventoryLogsToPdf = (logs) => {
  const headers = [
    { label: "Thời gian", key: "created_at" },
    { label: "Loại", key: "action_type" },
    { label: "Thiết bị", key: "equipment" },
    { label: "Trước", key: "quantity_before" },
    { label: "Thay đổi", key: "quantity_changed" },
    { label: "Sau", key: "quantity_after" },
    { label: "Mã tham chiếu", key: "reference_code" },
    { label: "Người thao tác", key: "creator" },
  ];

  const rows = logs.map((log) => ({
    created_at: new Date(log.created_at).toLocaleString(),
    action_type: log.action_type,
    equipment: log.equipment
      ? `${log.equipment.code} - ${log.equipment.name}`
      : "-",
    quantity_before: log.quantity_before,
    quantity_changed: log.quantity_changed,
    quantity_after: log.quantity_after,
    reference_code: log.reference_code || "-",
    creator: log.creator?.full_name || log.creator?.username || "-",
  }));

  downloadPdf(
    `inventory-logs-${Date.now()}.pdf`,
    "Inventory History Report",
    headers,
    rows,
  );
};
