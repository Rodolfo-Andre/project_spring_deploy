const $d = document;

var tabla;
$($d).ready(() => {

  initializeTable();
  addEventListReport();
});

const initializeTable = () => {
  $.get(`/reportes/reporte-ventas`, (data) => {   
  
    tabla = $('#tablaReportes').DataTable({
      columnDefs: [
        { orderable: false }
      ],
      language: {
        url: "/language/datatables-es-mx.json",
      },
      responsive: true,
      fixedHeader: true,
      dom: 'Bfrtilp',
      buttons: [
        {
          extend: "excelHtml5",
          text: "<i class='fas fa-file-excel'></i>",
          titleAttr: "Exportar a Excel",
          className: 'btn btn-success custom-button',
        },
        {
          extend: 'pdfHtml5',
          text: "<i class='fa-regular fa-file-pdf'></i>",
          titleAttr: "Exportar a Pdf",
          className: 'btn btn-danger custom-button',
        },
      ],
      data: data,
      columns: [
        { title: 'mprobantes', data: 'qComprobante' },
        { title: 'Cantidad de Platos', data: 'qPlatos' },
        { title: 'Plato más vendido', data: 'platoMasVendido' }
      ]
    })
  
  
  });
};



const addEventListReport = () => {
  let comboBox = $d.getElementById('miComboBox');

  comboBox.addEventListener('change', () => {
    let opcionSeleccionada = comboBox.value;
  
    if (opcionSeleccionada === 'opcion1') {
      tabla.destroy();
      $('#tablaReportes').empty();
      $.get(`/reportes/reporte-ventas`, (data) => {
        console.log(data)
        tabla=$('#tablaReportes').DataTable({
          columnDefs: [
            { orderable: false }
          ],
          language: {
            url: "/language/datatables-es-mx.json",
          },
          responsive: true,
          fixedHeader: true,
          dom: 'Bfrtilp',
          buttons: [
            {
              extend: "excelHtml5",
              text: "<i class='fas fa-file-excel'></i>",
              titleAttr: "Exportar a Excel",
              className: 'btn btn-success custom-button',
            },
            {
              extend: 'pdfHtml5',
              text: "<i class='fa-regular fa-file-pdf'></i>",
              titleAttr: "Exportar a Pdf",
              className: 'btn btn-danger custom-button',
            },
          ],
          data: data,
          columns: [
            { title: '1', data: 'fechaEmision' },
            { title: '2', data: 'qRecaudada' },
            { title: '3', data: 'qComprobante' },
            { title: '4', data: 'qPlatos' },
            { title: '5', data: 'platoMasVendido' }
          ]

        })
      
     
      });
      console.log('Opción 1 seleccionada');
    } else {
      tabla.destroy();
      $('#tablaReportes').empty();
        $.get(`/reportes/reporte-ventas`, (data) => {
          tabla=$('#tablaReportes').DataTable({
            columnDefs: [
              { orderable: false, target: [0, 1, 2, 3, 4] }
            ],
            language: {
              url: "/language/datatables-es-mx.json",
            },
            responsive: true,
            fixedHeader: true,
            dom: 'Bfrtilp',
            buttons: [
              {
                extend: "excelHtml5",
                text: "<i class='fas fa-file-excel'></i>",
                titleAttr: "Exportar a Excel",
                className: 'btn btn-success custom-button',
              },
              {
                extend: 'pdfHtml5',
                text: "<i class='fa-regular fa-file-pdf'></i>",
                titleAttr: "Exportar a Pdf",
                className: 'btn btn-danger custom-button',
              },
            ],
            data: data,
            columns: [
              { title: 'Fecha Emision', data: 'fechaEmision' },
              { title: 'Cantidad Recaudada', data: 'qRecaudada' },
              { title: 'Cantida Comprobantes', data: 'qComprobante' },
              { title: 'Cantidad de Platos', data: 'qPlatos' },
              { title: 'Plato más vendido', data: 'platoMasVendido' }
            ]
          })
        
        });
      }
  }
)}


