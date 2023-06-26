const $d = document;

let tabla;

$($d).ready(() => {
  initializeTable();
  addEventListReport();
});

const initializeTable = () => {
  createTableReportDish();
};

const addEventListReport = () => {
  const comboBox = $d.getElementById("miComboBox");

  comboBox.addEventListener("change", () => {
    resetTableReport();

    const opcionSeleccionada = comboBox.value;

    if (opcionSeleccionada === "opcion1") {
      createTableReportDish();
      return;
    }

    createTableReportSales();
  });
};

const resetTableReport = () => {
  tabla.destroy();
  $("#tablaReportes").empty();
};

const createTableReportDish = () => {
  $.get(`/reportes/reporte-plato`, (data) => {
    tabla = $("#tablaReportes").DataTable({
      language: {
        url: "/language/datatables-es-mx.json",
      },
      lengthChange: false,
      pageLength: 5,
      ordering: false,
      responsive: true,
      fixedHeader: true,
      dom: "B<'row mt-3'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
      buttons: [
        {
          extend: "excelHtml5",
          text: "<i class='fas fa-file-excel'></i>",
          titleAttr: "Exportar a Excel",
          className: "btn btn-success custom-button",
        },
        {
          extend: "pdfHtml5",
          text: "<i class='fa-regular fa-file-pdf'></i>",
          titleAttr: "Exportar a Pdf",
          className: "btn btn-danger custom-button",
        },
      ],
      data: data,
      columns: [
        { title: "Código de plato", data: "codplato" },
        { title: "Nombre de plato", data: "nomPlato" },
        { title: "Nombre categoría", data: "nomCat" },
        { title: "Total precio", data: "totalsale" },
        { title: "Cantidad de pedidos", data: "cantPedido" },
      ],
    });
  });
};

const createTableReportSales = () => {
  $.get(`/reportes/reporte-ventas`, (data) => {
    tabla = $("#tablaReportes").DataTable({
      language: {
        url: "/language/datatables-es-mx.json",
      },
      ordering: false,
      responsive: true,
      fixedHeader: true,
      dom: "B<'row mt-3'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>t<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
      buttons: [
        {
          extend: "excelHtml5",
          text: "<i class='fas fa-file-excel'></i>",
          titleAttr: "Exportar a Excel",
          className: "btn btn-success custom-button",
        },
        {
          extend: "pdfHtml5",
          text: "<i class='fa-regular fa-file-pdf'></i>",
          titleAttr: "Exportar a Pdf",
          className: "btn btn-danger custom-button",
        },
      ],
      data: data,
      columns: [
        { title: "Fecha Emision", data: "fechaEmision" },
        { title: "Cantidad Recaudada", data: "qRecaudada" },
        { title: "Cantida Comprobantes", data: "qComprobante" },
        { title: "Cantidad de Platos", data: "qPlatos" },
        { title: "Plato más vendido", data: "platoMasVendido" },
      ],
    });
  });
};
