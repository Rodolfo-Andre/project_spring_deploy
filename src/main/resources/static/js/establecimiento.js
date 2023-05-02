const $d = document;

$d.addEventListener("DOMContentLoaded", () => {
	console.log("Una vez cargado el contenido del DOM se ejecuta este console");
	
	handleOnClick();
});

const handleOnClick = () => { 
	const $btnUpdate = $d.getElementById("btn-update");
	
	$d.addEventListener("click", (e) => {
		if ($btnUpdate == e.target) {					
			let $inputName = $d.getElementById("name"),
				$inputTelephone = $d.getElementById("telephone"),
				$inputAddress = $d.getElementById("address"),
				$inputRuc = $d.getElementById("ruc");
			
			let isInvalid = false;
			
			if (!$inputName.value.match('^(?=.{3,100}$)[A-ZÑÁÉÍÓÚ][A-ZÑÁÉÍÓÚa-zñáéíóú]+(?: [A-ZÑÁÉÍÓÚA-Za-zñáéíóú]+)*$')) {
				if (!$inputName.classList.contains("is-invalid")) $inputName.classList.add("is-invalid");
				isInvalid = true;
			}else {
				if($inputName.classList.contains("is-invalid")) $inputName.classList.remove("is-invalid");
			}
			
			if (!$inputTelephone.value.match('^9[0-9]{8}$')) {	
				if (!$inputTelephone.classList.contains("is-invalid")) $inputTelephone.classList.add("is-invalid");
				isInvalid = true;
			}else {
				if($inputTelephone.classList.contains("is-invalid")) $inputTelephone.classList.remove("is-invalid");
			}
			
			if (!$inputAddress.value.match('^(?=.{3,100}$)[A-ZÑÁÉÍÓÚ][A-Za-zñáéíóú0-9.\\-]+(?: [A-Za-zñáéíóú0-9.\\-]+)*$')) {
				if (!$inputAddress.classList.contains("is-invalid")) $inputAddress.classList.add("is-invalid");
				isInvalid = true;
			}else {
				if($inputAddress.classList.contains("is-invalid")) $inputAddress.classList.remove("is-invalid");
			}
				
			if (!$inputRuc.value.match('^[1-9][0-9]{10,19}$')) {				
				if (!$inputRuc.classList.contains("is-invalid")) $inputRuc.classList.add("is-invalid");
				isInvalid = true;
			}else {
				if($inputRuc.classList.contains("is-invalid")) $inputRuc.classList.remove("is-invalid");
			}
						
			if (isInvalid) {
				e.preventDefault();
			}
		}
	});
}