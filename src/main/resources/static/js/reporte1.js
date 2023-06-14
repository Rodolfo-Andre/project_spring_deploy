const $d = document;

var tabla;
$($d).ready(() => {

  initializeTable();
  addEventListReport();
});

const initializeTable = () => {
  $.get(`/reportes/reporte-plato`, (data) => {   
  console.log(data)
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
          
           customize: function(doc) {
                  doc.styles.tableHeader = {
                    fillColor: '#E0B31A',
                    color: '#000000',
                    fontSize: 10,
                    bold: true,
                    alignment: 'center'
                  };
                  // Cambiar el estilo del contenido de la tabla
                  doc.styles.tableBody = {
                    fillColor: '#ffffff',
                    color: '#efd9b4',
                    fontSize: 10,
                    alignment: 'center'
                  };
                  // Cambiar los márgenes
                  doc.pageMargins = [40, 60, 40, 60]; // [left, top, right, bottom]
              
                  // Agregar un encabezado personalizado
                  doc['header'] = (currentPage, pageCount) => {
                    return {
                      text: 'PLATOS MAS VENDIDOS',
                      alignment: 'center',
                      fontSize: 14,
                      margin: [40, 20, 40, 0] // [left, top, right, bottom]
                    };
                  };
                  // Agregar un pie de página personalizado
                  doc['footer'] = (currentPage, pageCount) => {
                    return {
                      text: 'Página ' + currentPage.toString() + ' de ' + pageCount.toString(),
                      alignment: 'center',
                      fontSize: 10,
                      margin: [40, 0, 40, 20] // [left, top, right, bottom]
                    };
                  };
                }
        }
      ],
      data: data,
         columns: [
            { title: 'Codigo de plato', data: 'codplato' },
            { title: 'Nombre de plato', data: 'nomPlato' },
            { title: 'Nombre categoria', data: 'nomCat' },
            { title: 'Total precio', data: 'totalsale' },
            { title: 'Cantidad de pedidos', data: 'cantPedido' }
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
      $.get(`/reportes/reporte-plato`, (data) => {
        console.log(data)
        tabla=$('#tablaReportes').DataTable({
          columnDefs: [
            { orderable: false, target: [0, 1, 2, 3, 4]}
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
              
               
            // Agregar un pie de página personalizado
             customize: function(doc) {
                  doc.styles.tableHeader = {
                    fillColor: '#E0B31A',
                    color: '#000000',
                    fontSize: 10,
                    bold: true,
                    alignment: 'center'
                  };
                  // Cambiar el estilo del contenido de la tabla
                  doc.styles.tableBody = {
                    fillColor: '#ffffff',
                    color: '#efd9b4',
                    fontSize: 10,
                    alignment: 'center'
                  };
                  // Cambiar los márgenes
                  doc.pageMargins = [40, 60, 40, 60]; // [left, top, right, bottom]
              
                  // Agregar un encabezado personalizado
                  doc['header'] = (currentPage, pageCount) => {
                    return {
                      text: 'PLATOS MAS VENDIDOS',
                      alignment: 'center',
                      fontSize: 14,
                      margin: [40, 20, 40, 0] // [left, top, right, bottom]
                    };
                  };
                  // Agregar un pie de página personalizado
                  doc['footer'] = (currentPage, pageCount) => {
                    return {
                      text: 'Página ' + currentPage.toString() + ' de ' + pageCount.toString(),
                      alignment: 'center',
                      fontSize: 10,
                      margin: [40, 0, 40, 20] // [left, top, right, bottom]
                    };
                  };
                }
            }
          ],
          data: data,
          columns: [
            { title: 'Codigo de plato', data: 'codplato' },
            { title: 'Nombre de plato', data: 'nomPlato' },
            { title: 'Nombre categoria', data: 'nomCat' },
            { title: 'Total precio', data: 'totalsale' },
            { title: 'Cantidad de pedidos', data: 'cantPedido' }
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
                
                 
            // Agregar un pie de página personalizado
           customize: function(doc) {
                  doc.styles.tableHeader = {
                    fillColor: '#E0B31A',
                    color: '#000000',
                    fontSize: 10,
                    bold: true,
                    alignment: 'center'
                  };
                  // Cambiar el estilo del contenido de la tabla
                  doc.styles.tableBody = {
                    fillColor: '#ffffff',
                    color: '#efd9b4',
                    fontSize: 10,
                    alignment: 'center'
                  };
                  // Cambiar los márgenes
                  doc.pageMargins = [40, 60, 40, 60]; // [left, top, right, bottom]
              
                  // Agregar un encabezado personalizado
                  doc['header'] = (currentPage, pageCount) => {
                    return {
                      text: 'DIAS CON MAS VENTAS',
                      alignment: 'center',
                      fontSize: 14,
                      margin: [40, 20, 40, 0] // [left, top, right, bottom]
                    };
                  };
                  // Agregar un pie de página personalizado
                  doc['footer'] = (currentPage, pageCount) => {
                    return {
                      text: 'Página ' + currentPage.toString() + ' de ' + pageCount.toString(),
                      alignment: 'center',
                      fontSize: 10,
                      margin: [40, 0, 40, 20] // [left, top, right, bottom]
                    };
                  };
                }
              }
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


