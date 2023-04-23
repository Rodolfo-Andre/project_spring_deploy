export default async function useFetch (props) {
	// CUANDO HABLAMOS DE OBJETOS, PODEMOS HACER REFERENCIA A LOS DICCIONARIOS
	// Las props va a ser un objecto que tendrá los siguientes valores
	/*
		url -> String que hace referencia a una url en concreta
		success -> Función para el manejo de datos, en caso haya éxito
		error -> Función para el manejo en caso de error
		options -> Otro objeto que en su interior especifica el header, body, method
	 */

	 // Cabecera por defecto
	const defaultHeaders = {
       'Content-Type': "application/json"
    };
    
	let {url, success, error, options} = props;
	
	options.method = options.method || "GET";
	
	options.headers = options.headers? {...defaultHeaders, ...options.headers} :defaultHeaders;
	
	// Al momento de parsear a JSON si no hay valor, retorna indefinido
	options.body = JSON.stringify(options.body) || false;
	
	// Si no hay valor lo borramos del objeto
	if(!options.body) delete options.body;
	
	try {
		let res = await fetch(url, options),
			json = res.json();
		
		if (!res.ok) throw {status: res.status, statusText: res.statusText};
		
		json ? success(json) : success();
	} catch (err) {
		console.log(err);
		if (error) error(); 
	}
}