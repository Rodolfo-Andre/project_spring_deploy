import { showModal } from "./modal.js";

const $d = document;

$d.addEventListener("DOMContentLoaded", () => {
  initializeTable();
  addEventToTable();
  addEventToButtonAdd();
  addEventToButtonConfirmAddAndConfirmUpdate();
});

const initializeTable = () => {
  const table = $("#tablaPlato").DataTable({
    language: {
      url: "/language/datatables-es-mx.json",
    },
    responsive: true,
    fixedHeader: true,
    rowId: "0",
    columns: [
      null,
      null,
      { orderable: false, searchable: false },
      null,
      null,
      { orderable: false, searchable: false, width: 50 },
      { orderable: false, searchable: false, width: 50 },
      { orderable: false, searchable: false, width: 50 },
    ],
    initComplete: function () {
      $("#tablaPlato thead tr th").each(function (i) {
        const title = $(this).text();

        if (
          !["Imagen", "Información", "Modificar", "Eliminar"].includes(title)
        ) {
          $(this).html(
            `
            <div class="d-flex gap-3 flex-column align-items-start">
              <label>${title}</label>
              <input type="seacrh" placeholder="Buscar..." class="form-control form-control-sm w-auto"/>
            </div>
           `
          );

          $("input", this)
            .on("click", function (e) {
              e.stopPropagation();
            })
            .on("keyup change", function (e) {
              if (table.column(i).search() !== this.value) {
                table.column(i).search(this.value).draw();
              }
            });
        }
      });
    },
  });
};

const addEventToTable = () => {
  $("#tablaPlato tbody").on(
    "click",
    "td .icon-info, td .icon-update, td .icon-delete",
    function (e) {
      let id;

      const $listBtnInfo = $(".icon-info"),
        $listBtnUpdate = $(".icon-update"),
        $listBtnDelete = $(".icon-delete");

      if ($(this).parents("tr").hasClass("child")) {
        id = $(this).parents("tr").prev().find("td:eq(0)").text();
      } else {
        id = $(this).closest("tr").find("td:eq(0)").text();
      }

      if ($listBtnInfo.filter(e.currentTarget).length) {
        $.get(`/configuracion/plato/obtener/${id}`, (data) => {
          if (data) {
            const contentModal = {
              header: `<i class="icon text-center text-link bi bi-info-circle-fill"></i>
										 <h4 class="modal-title text-center" id="modal-prototype-label">Plato - ${data.id}</h4>`,
              body: `<div class="text-center">
											<div class="img-dish mb-3">
												<img src="${data.imagen}"/>
											</div>
											<div><strong>Nombre del Plato: </strong>${data.nombre}</div>
											<div><strong>Precio del Plato: </strong>${data.precioPlato}</div>
											<div><strong>Categoría del Plato: </strong>${data.categoriaPlato.nombre}</div>
										</div>`,
              footer: `<button data-bs-dismiss="modal" aria-label="Close" class="w-100 btn btn-primary">CERRAR</button>`,
            };

            showModal(contentModal);
          }
        });
      }

      if ($listBtnUpdate.filter(e.currentTarget).length) {
        $.get(`/configuracion/categoria-plato/obtener`, (data) => {
          const listOptions = data.map(
              (categoryDish) =>
                `<option value="${categoryDish.id}">${categoryDish.nombre}</option>`
            ),
            $options = listOptions.join(" ");

          $.get(`/configuracion/plato/obtener/${id}`, (data) => {
            if (data) {
              const contentModal = {
                header: `<i class="icon text-center text-warning bi bi-pencil-square"></i>
											<h4 class="modal-title text-center" id="modal-prototype-label">Plato - ${data.id}</h4>`,
                body: `<form class="d-flex flex-column gap-4" id="form-update" action="/configuracion/plato/actualizar" method="POST" enctype="multipart/form-data">
												<input type="hidden" name="id" value="${data.id}"/>
						
												<div class="container-img-dish">
													<div class="img-dish">
														<img src="${data.imagen}" id="update-img-dish">		
													</div>
												</div>
																			
												<div class="row align-items-sm-center">
													<label class="col-sm-5 fw-bold" for="name">Nombre del Plato:</label>
													<div class="col-sm-7">
														<input class="form-control" type="text" id="name" name="name" value="${data.nombre}"/>
														<div id="name-invalid" class="text-start invalid-feedback">Introduce el nombre del plato correctamente. Mínimo 3 caracteres, máximo 50.</div>
													</div>
												</div>
													
												<div class="row align-items-sm-center">
													<label class="col-sm-5 fw-bold" for="price">Precio del Plato:</label>
													<div class="col-sm-7">
														<input class="form-control" type="text" id="price" name="price" value="${data.precioPlato}"/>
														<div id="name-invalid" class="text-start invalid-feedback">Introduce el precio correctamente. Se acepta como máximo 3 enteros y 2 decimales que son establecidos por un ".".</div>
													</div>
												</div>
													
												<div class="row align-items-sm-center">
													<label class="col-sm-5 fw-bold" for="image">Imagen del Plato:</label>
													<div class="col-sm-7">
														<input class="form-control" type="file" id="image" name="image" accept="image/*"/>
														<div id="name-invalid" class="text-start invalid-feedback">Introduce una imagen</div>
													</div>
												</div>
													
												<div class="row align-items-sm-center">
													<label class="col-sm-3 fw-bold">Categoría:</label>
														<div class="col-sm-9">
															<select class="form-select" name="cboCategoryDish" id="cboCategoryDish">
																${$options}
															</select>
														</div>
												</div>
											</form>`,
                footer: `<input id="update" form="form-update" type="submit" class="w-50 text-white btn btn-warning" value="MODIFICAR"/>
											<button id="btn-cancel" data-bs-dismiss="modal" aria-label="Close" class="w-50 btn btn-danger">CANCELAR</button>`,
              };

              showModal(contentModal);

              $d.querySelector(
                `#cboCategoryDish > option[value="${data.categoriaPlato.id}"]`
              ).setAttribute("selected", true);

              const $inputFile = $d.getElementById("image");
              let files = null;

              $inputFile.addEventListener("change", () => {
                checkFile($inputFile, "update-img-dish", files);
              });
            }
          });
        });
      }

      if ($listBtnDelete.filter(e.currentTarget).length) {
        const contentModal = {
          header: `<i class="icon text-center text-danger bi bi-trash-fill"></i>
						<h4 class="modal-title text-center" id="modal-prototype-label">¿ESTÁS SEGURO DE ELIMINAR EL PLATO - ${id}?</h4>`,
          body: `<form id="form-delete" action="/configuracion/plato/eliminar" method="POST">
							<input type="hidden" name="id" value="${id}"/>
						</form>`,
          footer: `<input form="form-delete" type="submit" class="w-50 text-white btn btn-danger" value="ELIMINAR"/>
						<button id="btn-cancel" data-bs-dismiss="modal" aria-label="Close" class="w-50 btn btn-primary">CANCELAR</button>`,
        };

        showModal(contentModal);
      }
    }
  );
};

const addEventToButtonAdd = () => {
  $("#btn-add").on("click", () => {
    $.get(`/configuracion/categoria-plato/obtener`, (data) => {
      if (!data.length) {
        const contentModal = {
          header: `<i class="icon text-center text-danger bi bi-exclamation-circle-fill"></i>
									<h4 class="modal-title text-center" id="modal-prototype-label">NO SE PUEDE AGREGAR PLATO</h4>`,
          body: `<div class="text-center">
									No se puede agregar plato debido a que no tienes categorías registradas. Registra al menos una categoría para que puedas registrar un plato.
									</div>`,
          footer: `<button id="btn-cancel" data-bs-dismiss="modal" aria-label="Close" class="w-100 btn btn-danger">CANCELAR</button>`,
        };

        showModal(contentModal);
        return;
      }

      const listOptions = data.map(
          (categoryDish) =>
            `<option value="${categoryDish.id}">${categoryDish.nombre}</option>`
        ),
        $options = listOptions.join(" ");

      console.log($options);
      const contentModal = {
        header: `<i class="icon text-center text-primary bi bi-plus-circle-fill"></i>
								<h4 class="modal-title text-center" id="modal-prototype-label">Nuevo Plato</h4>`,
        body: `<form class="d-flex flex-column gap-4" id="form-add" action="/configuracion/plato/grabar" method="POST" enctype="multipart/form-data">
									<div class="container-img-dish">
										<div class="img-dish">
											<img id="add-img-dish">		
										</div>
									</div>
																
									<div class="row align-items-sm-center">
										<label class="col-sm-5 fw-bold" for="name">Nombre del Plato:</label>
										<div class="col-sm-7">
											<input class="form-control" type="text" id="name" name="name" value=""/>
											<div id="name-invalid" class="text-start invalid-feedback">Introduce el nombre del plato correctamente. Mínimo 3 caracteres, máximo 50.</div>
										</div>
									</div>
										
									<div class="row align-items-sm-center">
										<label class="col-sm-5 fw-bold" for="price">Precio del Plato:</label>
										<div class="col-sm-7">
											<input class="form-control" type="text" id="price" name="price" value=""/>
											<div id="name-invalid" class="text-start invalid-feedback">Introduce el precio correctamente. Se acepta como máximo 3 enteros y 2 decimales que son establecidos por un "."</div>
										</div>
									</div>
										
									<div class="row align-items-sm-center">
										<label class="col-sm-5 fw-bold" for="image">Imagen del Plato:</label>
										<div class="col-sm-7">
											<input class="form-control" type="file" id="image" name="image" accept="image/*"/>
											<div id="name-invalid" class="text-start invalid-feedback">Introduce una imagen</div>
										</div>
									</div>
										
									<div class="row align-items-sm-center">
										<label class="col-sm-3 fw-bold">Categoría:</label>
											<div class="col-sm-9">
												<select class="form-select" name="cboCategoryDish">
													${$options}
												</select>
										</div>
									</div>
								</form>`,
        footer: `<input id="add" form="form-add" type="submit" class="w-50 btn btn-primary" value="AÑADIR"/>
								<button id="btn-cancel" data-bs-dismiss="modal" aria-label="Close" class="w-50 btn btn-danger">CANCELAR</button>`,
      };

      showModal(contentModal);

      const $inputFile = $d.getElementById("image");
      let files = null;

      $inputFile.addEventListener("change", () => {
        const result = checkFile($inputFile, "add-img-dish", files);

        if (result) files = result;
      });
    });
  });
};

const addEventToButtonConfirmAddAndConfirmUpdate = () => {
  $($d).on("click", "#add, #update", (e) => {
    const $btnConfirmAdd = $("#add")[0],
      $btnConfirmUpdate = $("#update")[0];

    if ($btnConfirmAdd == e.target || $btnConfirmUpdate == e.target) {
      let $inputName = $d.getElementById("name");
      let $inputPrice = $d.getElementById("price"),
        $inputFile = $d.getElementById("image");
      let isInvalid = false;

      if (
        !$inputName.value.match(
          "^(?=.{3,50}$)[A-ZÑÁÉÍÓÚ][a-zñáéíóú]+(?: [A-Za-zñáéíóú]+)*$"
        )
      ) {
        if (!$inputName.classList.contains("is-invalid"))
          $inputName.classList.add("is-invalid");
        isInvalid = true;
      } else {
        if ($inputName.classList.contains("is-invalid"))
          $inputName.classList.remove("is-invalid");
      }

      if (
        !$inputPrice.value.match("^\\d{1,3}(.\\d{1,2})?$") ||
        parseFloat($inputPrice.value) <= 0
      ) {
        if (!$inputPrice.classList.contains("is-invalid"))
          $inputPrice.classList.add("is-invalid");
        isInvalid = true;
      } else {
        if ($inputPrice.classList.contains("is-invalid"))
          $inputPrice.classList.remove("is-invalid");
      }

      if ($btnConfirmAdd && $inputFile.files.length === 0) {
        if (!$inputFile.classList.contains("is-invalid"))
          $inputFile.classList.add("is-invalid");
        isInvalid = true;
      } else {
        if ($inputFile.classList.contains("is-invalid"))
          $inputFile.classList.remove("is-invalid");
      }

      if (isInvalid) {
        e.preventDefault();
        return;
      }
    }

    const $form = $(e.target.form);
    const $loader = $(`<div class="flex-grow-1 text-center">
                        <div class="spinner-border text-primary" role="status">
                          <span class="visually-hidden">Loading...</span>
                        </div>
                        </div>`);

    $(e.target).replaceWith($loader);
    $("#btn-cancel").prop("disabled", true);

    $form.submit();
  });
};

const checkFile = ($inputFile, imgId, files) => {
  const $img = $d.getElementById(imgId);
  const isCorrect =
    $inputFile.files.length > 0 && $inputFile.files[0].size < 1048576;
  const isFileNotNull = files !== null;

  if ($inputFile.files.length === 0 && isFileNotNull) {
    $inputFile.files = files;
    return;
  }

  if (!isCorrect) {
    Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    }).fire({
      icon: "error",
      title: "Por favor seleccione una imagen con peso menor a 1MB",
    });

    if (isFileNotNull) {
      $inputFile.files = files;
      return;
    }

    $inputFile.value = null;
    return;
  }

  files = $inputFile.files;
  $img.setAttribute("src", URL.createObjectURL(files[0]));
  return files;
};

/* if (object == "dish") {
        let params = {
          type: "findDishInComanda",
          id,
        };

        let props = {
          url: "categoria-plato?" + new URLSearchParams(params),
          success: async (json) => {
            let { foundDishInComanda } = await json;

            if (foundDishInComanda) {
              contentModal = {
                header: `<i class="icon text-center text-danger bi bi-exclamation-circle-fill"></i>
										<h4 class="modal-title text-center" id="modal-prototype-label">NO SE PUEDE ELIMINAR EL PLATO - ${id}</h4>`,
                body: `<p>No se puede eliminar el plato porque se encontró comandas que utilizan este plato.</p>`,
                footer: `<button data-bs-dismiss="modal" aria-label="Close" class="w-100 btn btn-danger">CERRAR</button>`,
              };
            }

            showModal(contentModal);
          },
          options: {
            method: "POST",
          },
        };

        useFetch(props);
      } */
