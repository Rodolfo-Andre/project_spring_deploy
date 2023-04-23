export const showModal = (content,  idModal = "modal-prototype") => {
	let $body = document.querySelector("body"),
		$modalTemplate = document.getElementById("modal-template"),
		clone = $modalTemplate.content.cloneNode(true);
			
	$body.appendChild(clone);
			
	let $modalDOM = document.getElementById(idModal),
		$modalBS = new bootstrap.Modal($modalDOM, {
		backdrop: 'static',
		keyboard: false,
		focus: true
	});
	
	insertContentModal(content, idModal);
	
	$modalBS.show();

	$modalDOM.addEventListener('hidden.bs.modal', () => {
		$modalBS.dispose();
		$body.removeChild($modalDOM);
	});
}

export const insertContentModal = (content, idModal = "modal-prototype") => {
	let {header, body, footer }  = content;
	
	let $modalDOM = document.getElementById(idModal),
		$modalHeader = $modalDOM.querySelector(".modal-content > .modal-header"),
		$modalBody = $modalDOM.querySelector(".modal-content > .modal-body"),
		$modalFooter = $modalDOM.querySelector(".modal-content > .modal-footer");
	
	if (header){
		$modalHeader.innerHTML = header;	
	} else {
		$modalHeader.outerHTML = "";	
	}
	
	if (body){
		$modalBody.innerHTML = body;	
	} else {
		$modalBody.outerHTML = "";	
	}
	
	if (footer){
		$modalFooter.innerHTML = footer;	
	} else {
		$modalFooter.outerHTML = "";	
	}
}