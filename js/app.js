// Seleccionar elementos del DOM
const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario')
const resultado = document.querySelector('#resultado');

// Objeto para la búsqueda de criptomonedas
const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}

// Evento de carga de la ventana
window.addEventListener('load', () => {
    // Consultar las criptomonedas al cargar la página
    consultarCriptomonedas();

    // Eventos para leer los valores de los select
    criptomonedasSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);

    // Evento de envío del formulario
    formulario.addEventListener('submit', submitFormulario);
})

// Función para consultar las criptomonedas
async function consultarCriptomonedas() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    // fetch(url)
    //     .then(respuesta => respuesta.json())
    //     .then(resultado => selectCriptomonedas(resultado.Data))

    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        selectCriptomonedas(resultado.Data);
    } catch (error) {
        console.log(error);
    }
}

// Función para llenar el select de criptomonedas
function selectCriptomonedas(criptomonedas) {
    criptomonedas.forEach( cripto => {
        const { Name, FullName } = cripto.CoinInfo;

        const option = document.createElement('OPTION');
        option.value = Name;
        option.textContent = FullName;

        criptomonedasSelect.append(option);
    })
}

// Función para leer el valor de los select
function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value;
}

// Función para manejar el envío del formulario
function submitFormulario(e) {
    e.preventDefault();

    const { moneda, criptomoneda } = objBusqueda

    // Validar que ambos campos estén llenos
    if(moneda === '' || criptomoneda === '') {
        mostrarAlerta('Ambos campos son obligatorios');
        return;
    }

    // Consultar la API con los datos del formulario
    consultarAPI();
}

// Función para consultar la API
async function consultarAPI() {
    const { moneda, criptomoneda } = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    // Mostrar el spinner antes de hacer la petición
    mostrarSpinner();

    // fetch(url)
    //     .then(respuesta => respuesta.json())
    //     .then(resultado => {
    //         // Mostrar el resultado después de un retraso de 2 segundos
    //         setTimeout(() => {
    //             mostrarCotizacionHTML(resultado.DISPLAY[criptomoneda][moneda])
    //         }, 2000)
    //     })

    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        setTimeout(() => {
            mostrarCotizacionHTML(resultado.DISPLAY[criptomoneda][moneda])
        }, 2000)
    } catch (error) {
        console.log(error);
    }
}

// Función para mostrar la cotización en el HTML
function mostrarCotizacionHTML(cotizacion) {
    // Limpiar el HTML existente
    limpiarHTML();

    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;

    // Crear y configurar los elementos para mostrar la cotización
    const precio = document.createElement('P');
    precio.classList.add('precio');
    precio.innerHTML = `El precio es: <span>${PRICE}</span>`;

    const precioAlto = document.createElement('P'); 
    precioAlto.innerHTML = `Precio más alto del día: <span>${HIGHDAY}</span>`;

    const precioBajo = document.createElement('P');
    precioBajo.innerHTML = `Precio más bajo del día: <span>${LOWDAY}</span>`;

    const ultimasHoras = document.createElement('P');
    ultimasHoras.innerHTML = `Variación últimas 24 horas: <span>${CHANGEPCT24HOUR}%</span>`;

    const ultimaActualizacion = document.createElement('P');
    ultimaActualizacion.innerHTML = `Última actualización: <span>${LASTUPDATE}</span>`;

    // Añadir los elementos al DOM
    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(ultimaActualizacion);
}

// Añadir los elementos al DOM
function mostrarAlerta(mensaje) {
    const existeError = document.querySelector('.error');

    // Si no existe un error, crear y mostrar el mensaje de error
    if(!existeError) {
        const divMensaje = document.createElement('DIV');
        divMensaje.classList.add('error');
    
        const alerta = document.createElement('P');
        alerta.style.margin = '0';
        alerta.textContent = mensaje;
    
        divMensaje.append(alerta);
    
        formulario.append(divMensaje);

        setTimeout(() => {
            divMensaje.remove();
        }, 2000)
    }
}

// Función para limpiar el HTML
function limpiarHTML() {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

// Función para mostrar el spinner de carga
function mostrarSpinner() {
    limpiarHTML();

    const spinner = document.createElement('DIV');
    spinner.classList.add('spinner');
    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;

    resultado.append(spinner);
}