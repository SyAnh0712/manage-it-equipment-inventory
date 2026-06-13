const downloadExcel = async (fileName, rows, headers) => {
  const { utils, writeFile } = await import("xlsx");
  const worksheetData = [headers.map((header) => header.label)];
  rows.forEach((row) => {
    worksheetData.push(headers.map((header) => row[header.key] ?? ""));
  });

  const worksheet = utils.aoa_to_sheet(worksheetData);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "Report");
  writeFile(workbook, fileName);
};

const PDF_FONT = "times";
const PDF_MARGIN = 32;
const PDF_HEADER_FILL = [241, 245, 249];
const PDF_BORDER = [203, 213, 225];
const PDF_TEXT = [15, 23, 42];

const sanitizePdfText = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");

const getColumnWidths = (headers, availableWidth) => {
  const preferredWidths = {
    code: 72,
    supplier: 86,
    department: 76,
    receiver: 74,
    status: 58,
    note: 96,
    creator: 82,
    created_at: 92,
    name: 130,
    equipment: 126,
    action_type: 58,
    quantity: 54,
    unit_price: 62,
    total: 62,
    quantity_before: 50,
    quantity_changed: 54,
    quantity_after: 50,
    reference_code: 82,
  };

  const widths = headers.map(
    (header) => preferredWidths[header.key] || Math.max(56, header.label.length * 5),
  );
  const total = widths.reduce((sum, width) => sum + width, 0);

  if (total <= availableWidth) {
    const extra = (availableWidth - total) / widths.length;
    return widths.map((width) => width + extra);
  }

  const scale = availableWidth / total;
  return widths.map((width) => Math.max(42, width * scale));
};

const getRowHeight = (doc, cells, columnWidths, fontSize = 8, minHeight = 24, padding = 5) => {
  doc.setFont(PDF_FONT, "normal");
  doc.setFontSize(fontSize);

  const wrappedCells = cells.map((cell, index) =>
    doc.splitTextToSize(sanitizePdfText(cell), columnWidths[index] - padding * 2),
  );

  return Math.max(
    minHeight,
    ...wrappedCells.map((lines) => lines.length * (fontSize + 2) + padding * 2),
  );
};

const drawTableRow = (doc, cells, columnWidths, y, options = {}) => {
  const {
    x = PDF_MARGIN,
    fontSize = 8,
    isHeader = false,
    minHeight = 24,
    padding = 5,
  } = options;

  doc.setFont(PDF_FONT, isHeader ? "bold" : "normal");
  doc.setFontSize(fontSize);

  const wrappedCells = cells.map((cell, index) =>
    doc.splitTextToSize(sanitizePdfText(cell), columnWidths[index] - padding * 2),
  );
  const rowHeight = getRowHeight(
    doc,
    cells,
    columnWidths,
    fontSize,
    minHeight,
    padding,
  );

  let currentX = x;
  wrappedCells.forEach((lines, index) => {
    const width = columnWidths[index];

    if (isHeader) {
      doc.setFillColor(...PDF_HEADER_FILL);
      doc.rect(currentX, y, width, rowHeight, "F");
    }

    doc.setDrawColor(...PDF_BORDER);
    doc.rect(currentX, y, width, rowHeight);
    doc.setTextColor(...PDF_TEXT);
    doc.text(lines, currentX + padding, y + padding + fontSize);
    currentX += width;
  });

  return rowHeight;
};

const downloadPdf = async (fileName, title, headers, rows) => {
  const { default: jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "letter", orientation: "landscape" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const availableWidth = pageWidth - PDF_MARGIN * 2;
  const columnWidths = getColumnWidths(headers, availableWidth);
  let y = PDF_MARGIN;

  const drawHeader = () => {
    doc.setFont(PDF_FONT, "bold");
    doc.setFontSize(15);
    doc.setTextColor(...PDF_TEXT);
    doc.text(sanitizePdfText(title), PDF_MARGIN, y);
    y += 24;

    const headerHeight = drawTableRow(
      doc,
      headers.map((header) => header.label),
      columnWidths,
      y,
      { isHeader: true, fontSize: 8, minHeight: 26 },
    );
    y += headerHeight;
  };

  drawHeader();

  if (!rows.length) {
    doc.setFont(PDF_FONT, "normal");
    doc.setFontSize(10);
    doc.text("No data available", PDF_MARGIN, y + 24);
    doc.save(fileName);
    return;
  }

  rows.forEach((row) => {
    const cells = headers.map((header) => row[header.key] ?? "");
    const rowHeight = getRowHeight(doc, cells, columnWidths, 7.5, 24);

    if (y + rowHeight > pageHeight - PDF_MARGIN) {
      doc.addPage();
      y = PDF_MARGIN;
      drawHeader();
    }

    drawTableRow(doc, cells, columnWidths, y, {
      fontSize: 7.5,
      minHeight: 24,
    });
    y += rowHeight;
  });

  doc.save(fileName);
};

export const exportImportOrdersToExcel = async (orders) => {
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

  await downloadExcel(`import-orders-${Date.now()}.xlsx`, rows, headers);
};

export const exportImportOrdersToPdf = async (orders) => {
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

  await downloadPdf(
    `import-orders-${Date.now()}.pdf`,
    "Import Orders Report",
    headers,
    rows,
  );
};

export const exportExportOrdersToExcel = async (orders) => {
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

  await downloadExcel(`export-orders-${Date.now()}.xlsx`, rows, headers);
};

export const exportExportOrdersToPdf = async (orders) => {
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

  await downloadPdf(
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

export const exportImportOrderDetailsToExcel = async (order, items) => {
  const headers = [
    { label: "Equipment Code", key: "code" },
    { label: "Equipment Name", key: "name" },
    { label: "Quantity", key: "quantity" },
    { label: "Unit Price", key: "unit_price" },
    { label: "Total", key: "total" },
  ];

  const rows = buildDetailRows(order, items, true);
  await downloadExcel(
    `import-order-${order.code || order.id}-details.xlsx`,
    rows,
    headers,
  );
};

export const exportImportOrderDetailsToPdf = async (order, items) => {
  const headers = [
    { label: "Equipment Code", key: "code" },
    { label: "Equipment Name", key: "name" },
    { label: "Quantity", key: "quantity" },
    { label: "Unit Price", key: "unit_price" },
    { label: "Total", key: "total" },
  ];

  const rows = buildDetailRows(order, items, true);
  await downloadPdf(
    `import-order-${order.code || order.id}-details.pdf`,
    `Import Order ${order.code || order.id} Details`,
    headers,
    rows,
  );
};

export const exportExportOrderDetailsToExcel = async (order, items) => {
  const headers = [
    { label: "Equipment Code", key: "code" },
    { label: "Equipment Name", key: "name" },
    { label: "Quantity", key: "quantity" },
  ];

  const rows = buildDetailRows(order, items, false);
  await downloadExcel(
    `export-order-${order.code || order.id}-details.xlsx`,
    rows,
    headers,
  );
};

export const exportExportOrderDetailsToPdf = async (order, items) => {
  const headers = [
    { label: "Equipment Code", key: "code" },
    { label: "Equipment Name", key: "name" },
    { label: "Quantity", key: "quantity" },
  ];

  const rows = buildDetailRows(order, items, false);
  await downloadPdf(
    `export-order-${order.code || order.id}-details.pdf`,
    `Export Order ${order.code || order.id} Details`,
    headers,
    rows,
  );
};

export const exportInventoryLogsToExcel = async (logs) => {
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

  await downloadExcel(`inventory-logs-${Date.now()}.xlsx`, rows, headers);
};

export const exportInventoryLogsToPdf = async (logs) => {
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

  await downloadPdf(
    `inventory-logs-${Date.now()}.pdf`,
    "Inventory History Report",
    headers,
    rows,
  );
};
