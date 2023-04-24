import useFetch from "./fetch.js";
import { showModal } from "./modal.js";

const $d = document;

$d.addEventListener("DOMContentLoaded", () => {
	console.log("Una vez cargado el contenido del DOM se ejecuta este console");
	
	handleOnClick();
});

const handleOnClick = () => { 
	const $btnAdd = $d.getElementById("btn-add"),
		  $listBtnInfo = Array.from($d.querySelectorAll(".icon-info")),
		  $listBtnUpdate = Array.from($d.querySelectorAll(".icon-update")),
		  $listBtnDelete = Array.from($d.querySelectorAll(".icon-delete"));
	
	$d.addEventListener("click", (e) => {
		let $btnConfirmAdd = $d.querySelector("input[form='form-add']"),
			$btnConfirmUpdate = $d.querySelector("input[form='form-update']");

		if ($btnAdd == e.target) {
			let contentModal = {
				header: `<i class="icon text-center text-primary bi bi-plus-circle-fill"></i>
						<h4 class="modal-title text-center" id="modal-prototype-label">Nueva Mesas</h4>`,
				body: `<form class="d-flex flex-column gap-4" id="form-add" action="mesas" method="POST">
							<input type="hidden" name="type" value="addInfoObject"/>
							
							<div class="row align-items-sm-center">
								<label class="col-sm-5 fw-bold" for="name">Cantidad de Asientos:</label>
								<div class="col-sm-7">
									<input class="form-control" type="text" id="quantityChairs" name="quantityChairs" value=""/>
									<div id="name-invalid" class="text-start invalid-feedback">Introduce la cantidad de asientos correctamente. Solo se acepta 1 dígito.</div>
								</div>
							</div>		
						</form>`,
				footer: `<input form="form-add" type="submit" class="w-50 btn btn-primary" value="AÑADIR"/>
						<button data-bs-dismiss="modal" aria-label="Close" class="w-50 btn btn-primary">CANCELAR</button>`
			}	
						
			showModal(contentModal);
		}
		
		if ($listBtnInfo.includes(e.target)) {
			let $btnInfo = e.target,
				$inputId = $btnInfo.parentNode.parentNode.querySelector(".data > input[name='id']");
				
			let id = $inputId.value;
			
			let params = { 
				type: "getInfoObject",
				id: id
			}
				
			let props = {
				url: "mesas?" + new URLSearchParams(params),
				success: async (json) => {
					let tableInfo = await json;
					
					if (tableInfo) {
						let contentModal = {
							header: `<i class="icon text-center text-link bi bi-info-circle-fill"></i>
									 <h4 class="modal-title text-center" id="modal-prototype-label">Mesa - ${tableInfo.numMesa}</h4>`,
							body: `<div class="text-center">
										<div><strong>Cantidad de Asientos: </strong>${tableInfo.cantAsientos}</div>
										<div><strong>Estado de la Mesa: </strong>${tableInfo.estadoMesa}</div>
									</div>`,
							footer: `<button data-bs-dismiss="modal" aria-label="Close" class="w-100 btn btn-primary">CERRAR</button>`
						}
						
						showModal(contentModal);
					}
				},
				options: {
					method: "POST",
				}
			}
			
			useFetch(props);
		}		
		
		if ($listBtnUpdate.includes(e.target)) {
			let $btnUpdate = e.target,
				$inputId = $btnUpdate.parentNode.parentNode.querySelector(".data > input[name='id']");
				
			let id = $inputId.value;
				
			let params = { 
				type: "getInfoObject",
				id: id
			}
				
			let props = {
				url: "mesas?" + new URLSearchParams(params),
				success: async (json) => {
					let tableInfo = await json;
						
					if (tableInfo) {
						let contentModal = {
							header: `<i class="icon text-center text-warning bi bi-pencil-square"></i>
										<h4 class="modal-title text-center" id="modal-prototype-label">Mesa - ${tableInfo.numMesa}</h4>`,
							body: `<form class="d-flex flex-column gap-4" id="form-update" action="mesas" method="POST">
										<input type="hidden" name="type" value="updateInfoObject"/>
										<input type="hidden" name="id" value="${tableInfo.numMesa}"/>
												
										<div class="row align-items-sm-center">
											<label class="col-sm-5 fw-bold" for="name">Cantidad de Asientos:</label>
											<div class="col-sm-7">
												<input class="form-control" type="text" id="quantityChairs" name="quantityChairs" value="${tableInfo.cantAsientos}"/>
												<div id="name-invalid" class="text-start invalid-feedback">Introduce la cantidad de asientos correctamente. Solo se acepta 1 dígito.</div>
											</div>
										</div>	
									</form>`,
							footer: `<input form="form-update" type="submit" class="w-50 text-white btn btn-warning" value="MODIFICAR"/>
									<button data-bs-dismiss="modal" aria-label="Close" class="w-50 btn btn-primary">CANCELAR</button>	`
						}

						showModal(contentModal);
					}				
				},
				options: {
					method: "POST",
				}
			}
			
			useFetch(props);
		}
				
		if ($listBtnDelete.includes(e.target)) {
			let $btnDelete = e.target,
				$inputId = $btnDelete.parentNode.parentNode.querySelector(".data > input[name='id']");
				
			let id = $inputId.value;
			
			let contentModal = {
				header: `<i class="icon text-center text-danger bi bi-trash-fill"></i>
						<h4 class="modal-title text-center" id="modal-prototype-label">¿ESTÁS SEGURO DE ELIMINAR LA MESA - ${id}?</h4>`,
				body: `<form id="form-delete" action="mesas" method="POST">
							<input type="hidden" name="type" value="deleteInfoObject"/>
							<input type="hidden" name="id" value="${id}"/>
						</form>`,
				footer: `<input form="form-delete" type="submit" class="w-50 text-white btn btn-danger" value="ELIMINAR"/>
						<button data-bs-dismiss="modal" aria-label="Close" class="w-50 btn btn-primary">CANCELAR</button>`							
			}
			
			let params = {
				type: "findTableInComanda",
				id
			}
				
			let props = {
				url: "mesas?" + new URLSearchParams(params),
				success: async (json) => {
					let { foundTableInComanda } = await json;
						
					if (foundTableInComanda) {
						contentModal = {
							header: `<i class="icon text-center text-danger bi bi-exclamation-circle-fill"></i>
									<h4 class="modal-title text-center" id="modal-prototype-label">NO SE PUEDE ELIMINAR LA MESA - ${id}</h4>`,
							body: `<p>No se puede eliminar la mesa porque se encontró comandas que utilizan esta mesa.</p>`,
							footer: `<button data-bs-dismiss="modal" aria-label="Close" class="w-100 btn btn-danger">CERRAR</button>`							
						}
					}
						
					showModal(contentModal);
				},
				options: {
					method: "POST"
				}
			}
							
			useFetch(props);
		}		
		
		/* -------------------------------------------------- Validaciones -------------------------------------------------- */	
	
		if ($btnConfirmAdd == e.target || $btnConfirmUpdate == e.target) {
			let $inputQuantityChairs = $d.getElementById("quantityChairs");
			
			let isInvalid = false;
			
			if (!$inputQuantityChairs.value.match('^[1-9]$')) {
				if (!$inputQuantityChairs.classList.contains("is-invalid")) $inputQuantityChairs.classList.add("is-invalid");
				isInvalid = true;
			}else {
				if($inputQuantityChairs.classList.contains("is-invalid")) $inputQuantityChairs.classList.remove("is-invalid");
			}
			
			if (isInvalid) {
				e.preventDefault();
				return;	
			}
		}
	});
}