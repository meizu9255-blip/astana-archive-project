import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export async function exportToExcel(data, fileName = "Заявки_Архив.xlsx") {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Отчет");

  worksheet.columns = [
    {
      header: "ID",
      key: "id",
      style: { alignment: { horizontal: "center", vertical: "middle" } },
    },
    {
      header: "Дата",
      key: "date",
      style: { alignment: { horizontal: "center", vertical: "middle" } },
    },
    {
      header: "ФИО",
      key: "fullName",
      style: { alignment: { horizontal: "left", vertical: "middle" } },
    },
    {
      header: "ИИН",
      key: "iin",
      style: { alignment: { horizontal: "center", vertical: "middle" } },
    },
    {
      header: "Телефон",
      key: "phone",
      style: { alignment: { horizontal: "center", vertical: "middle" } },
    },
    {
      header: "Email",
      key: "email",
      style: { alignment: { horizontal: "left", vertical: "middle" } },
    },
    {
      header: "Услуга",
      key: "service",
      style: { alignment: { horizontal: "left", vertical: "middle" } },
    },
    {
      header: "Статус",
      key: "status",
      style: { alignment: { horizontal: "center", vertical: "middle" } },
    },
  ];

  // Маппинг данных из формата базы данных к формату колонок Excel
  const formattedData = data.map((item) => ({
    id: item.id || item.req_id || "",
    date: item.date ? new Date(item.date).toLocaleDateString("ru-RU") : "",
    fullName: item.full_name || item.fullName || "",
    iin: item.iin || "",
    phone: item.phone || "",
    email: item.email || "",
    service: item.type || item.service || "",
    status: item.status || "",
  }));

  worksheet.addRows(formattedData);

  const headerRow = worksheet.getRow(1);
  headerRow.font = {
    name: "Arial",
    size: 11,
    bold: true,
    color: { argb: "FFFFFFFF" },
  };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF002060" },
  };
  headerRow.height = 25;

  worksheet.autoFilter = {
    from: "A1",
    to: "H1",
  };

  worksheet.columns.forEach((column) => {
    let maxLength = 0;
    column.eachCell({ includeEmpty: true }, (cell) => {
      const columnLength = cell.value ? cell.value.toString().length : 10;
      if (columnLength > maxLength) {
        maxLength = columnLength;
      }
    });
    column.width = maxLength < 10 ? 10 : maxLength + 2;
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, fileName);
}
