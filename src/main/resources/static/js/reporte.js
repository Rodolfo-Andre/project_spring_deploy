const $d = document;

$($d).ready(()=>{
  
  addListReports();

});

const addListReports = () => {
  var  tabla; // Movimos la declaración de la variable tabla aquí

  let comboBox = $d.getElementById('miComboBox');
  comboBox.addEventListener('change', () => {
    let opcionSeleccionada = comboBox.value;

    if (opcionSeleccionada === 'opcion1') {
      // Opción 1 seleccionada
      $.get(`/reportes/reporte-ventas`, (data) => {
        
        if (tabla) {
          tabla.destroy(); // Destruir la tabla existente si existe
        }
        tabla = $('#tablaReportes').DataTable({
          columnDefs: [
            { orderable: false, target: [0, 1, 2, 3, 4] }
          ],
          language: {
            url: "/language/datatables-es-mx.json",
          },
          responsive: true,
          fixedHeader: true,
          dom: 'Bfrtil',
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
        });
      });
    } else {
      // Opción else seleccionada
      $.get(`/reportes/reporte-ventas`, (data) => {
        if (tabla) {
          tabla.destroy(); // Destruir la tabla existente si existe
        }

        tabla = $('#tablaReportes').DataTable({
          columnDefs: [
            { orderable: false, target: [0, 1, 2, 3, 4] }
          ],
          language: {
            url: "/language/datatables-es-mx.json",
          },
          responsive: true,
          fixedHeader: true,
          dom: 'Bfrtil',

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
        });
      });
    }
  });
};



/*
const addEventListReport = () => {
    let comboBox = $d.getElementById('miComboBox');
  
    comboBox.addEventListener('change', () => {
      let opcionSeleccionada = comboBox.value;
  
      if (opcionSeleccionada === 'opcion1') {


        tabla.clear().draw()
        $.get(`/reportes/reporte-ventas`, (data) => {
            console.log(data);
            if (data != null) {
              let tabla = $d.getElementById('tablaReportes');
              tb_reportes.innerHTML = ''; // Limpiar el cuerpo de la tabla antes de agregar los nuevos datos
              // Agregar el encabezado de la tabla
              let thead = tabla.getElementsByTagName('thead')[0];
              thead.innerHTML = `
                <tr>
                  <th>Fecha</th>
                  <th>Total Recaudado</th>
                </tr>
              `;
              let content=``;
              // Agregar los datos al cuerpo de la tabla
              data.forEach((item) => {
                content+=`
                <tr>
                  <td>${item.fechaEmision}</td>
                  <td>${item.qRecaudada}</td>
                  </tr>
                `;
               
              });
              tb_reportes.innerHTML=content
            } else {
              console.log("No hay registros");
            }
          });
        console.log('Opción 1 seleccionada');
      } else{
        $.get(`/reportes/reporte-ventas`, (data) => {
          tabla.clear().draw()
          console.log(data);
          if (data != null) {
            let tabla = $d.getElementById('tablaReportes');
            tb_reportes.innerHTML = ''; // Limpiar el cuerpo de la tabla antes de agregar los nuevos datos
            // Agregar el encabezado de la tabla
            let thead = tabla.getElementsByTagName('thead')[0];
            thead.innerHTML = `
            <tr>
            <th>Fecha Emision</th>
            <th>Cantidad Recaudada</th>
            <th>Cantida Comprobantes</th>
            <th>Cantidad de Platos</th>
            <th>Plato más vendido</th>
             </tr>
            `;
            let content=``;
            // Agregar los datos al cuerpo de la tabla
            data.forEach((item) => {
              content+=`
              <tr>
              <td>${item.fechaEmision}</td>
              <td>${item.qRecaudada}</td>
              <td>${item.qComprobante}</td>
              <td>${item.qPlatos}</td>
              <td>${item.platoMasVendido}</td>
              </tr>
              `;
            });
            tb_reportes.innerHTML=content
          } else {
            console.log("No hay registros");
          }
          
        });
      }
    });
  };
  */