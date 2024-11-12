let participantes = []; 
let grupos = [];
let resultados = [];
let setActual = 1; // Inicializa el set actual

// Muestra el módulo correspondiente
function mostrarModulo(modulo) {
    const modulos = document.querySelectorAll('.module');
    modulos.forEach(m => m.style.display = 'none');
    document.getElementById(modulo).style.display = 'block';
}

// Agrega un nuevo participante
async function addParticipante() {
    const nombre = document.getElementById("nombre-participante").value;
    const fechaNacimiento = document.getElementById("fecha-nacimiento").value;
    const genero = document.getElementById("genero").value;
    const categoria = document.getElementById("categoria").value;
    const lado = document.getElementById("lado").value;
    const manoHabil = document.getElementById("mano-habil").value;

    if (nombre) {
        const nuevoParticipante = {
            nombre,
            fechaNacimiento,
            genero,
            categoria,
            lado,
            manoHabil,
            puntos: 0 // Inicializar puntos
        };

        try {
            // Guardar el participante en la base de datos
            const response = await fetch('http://localhost:5000/api/participantes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nuevoParticipante),
            });

            if (!response.ok) {
                throw new Error('Error al agregar participante: ' + response.statusText);
            }

            // Agregar a la lista de participantes localmente
            participantes.push(nuevoParticipante);
            document.getElementById("nombre-participante").value = '';
            mostrarParticipantes();
        } catch (error) {
            alert(error.message);
        }
    } else {
        alert("El nombre completo es obligatorio.");
    }
}

// Muestra la lista de participantes
function mostrarParticipantes() {
    const listaParticipantes = document.getElementById("lista-participantes");
    listaParticipantes.innerHTML = '';
    participantes.forEach(participante => {
        const li = document.createElement('li');
        li.textContent = participante.nombre;
        listaParticipantes.appendChild(li);
    });
}

// Arma los grupos de participantes
function armarGrupos() {
    const numGrupos = parseInt(document.getElementById("num-grupos").value);
    if (numGrupos < 1 || participantes.length < numGrupos) {
        alert("Debe haber al menos tantos participantes como grupos.");
        return;
    }

    grupos = [];
    let shuffledParticipantes = participantes.slice().sort(() => Math.random() - 0.5);

    for (let i = 0; i < numGrupos; i++) {
        grupos[i] = [];
    }

    shuffledParticipantes.forEach((participante, index) => {
        grupos[index % numGrupos].push(participante);
    });

    mostrarGrupos();
}

// Muestra los grupos creados
function mostrarGrupos() {
    const listaGrupos = document.getElementById("lista-grupos");
    listaGrupos.innerHTML = '';
    grupos.forEach((grupo, index) => {
        const li = document.createElement('li');
        li.textContent = `Grupo ${index + 1}: ${grupo.map(p => p.nombre).join(', ')}`;
        listaGrupos.appendChild(li);
    });

    // Limpiar el contenedor de resultados
    const formularioResultados = document.getElementById("formulario-resultados");
    formularioResultados.innerHTML = '';

    // Añadir formularios para cargar resultados entre grupos
    for (let i = 0; i < grupos.length; i++) {
        for (let j = i + 1; j < grupos.length; j++) {
            const inputResultado = document.createElement('input');
            inputResultado.type = 'text';
            inputResultado.placeholder = `Resultado de Grupo ${i + 1} vs Grupo ${j + 1} (ej. 6-3)`;
            inputResultado.id = `resultado-${i}-${j}`;
            formularioResultados.appendChild(inputResultado);
        }
    }
}

// Carga los resultados ingresados y los guarda en la base de datos
async function cargarResultados() {
    resultados = [];

    // No reiniciar los puntos de los grupos
    for (let i = 0; i < grupos.length; i++) {
        for (let j = i + 1; j < grupos.length; j++) {
            const resultadoInput = document.getElementById(`resultado-${i}-${j}`);
            const resultado = resultadoInput ? resultadoInput.value : '';

            if (resultado) {
                const [score1, score2] = resultado.split('-').map(Number);
                
                // Aquí se asignan puntos basados en los resultados
                const puntosGrupo1 = score1; // puntos según el score
                const puntosGrupo2 = score2; // puntos según el score

                resultados.push({
                    partido: `Grupo ${i + 1} vs Grupo ${j + 1}`,
                    resultado,
                    puntos: [puntosGrupo1, puntosGrupo2],
                    formato: "paddleball" // Establecer el formato
                });

                // Acumular puntos de los grupos
                grupos[i].forEach(participante => { participante.puntos += puntosGrupo1; });
                grupos[j].forEach(participante => { participante.puntos += puntosGrupo2; });
            }
        }
    }

    // Guardar resultados en la base de datos
    await fetch('http://localhost:5000/api/resultados', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ronda: setActual, // Usar el número del set actual
            partidos: resultados,
        }),
    });

    // Incrementar el set actual
    setActual++;

    // Mostrar resultados guardados
    await cargarResultadosDesdeBackend();

    // Reorganizar grupos para el siguiente set
    armarGrupos(); // Vuelve a armar grupos aleatoriamente

    // Mostrar los puntos acumulados
    mostrarPuntosGrupos();
}

// Función para mostrar los puntos acumulados de cada grupo
function mostrarPuntosGrupos() {
    const puntosGruposDiv = document.getElementById("puntos-grupos");
    puntosGruposDiv.innerHTML = ''; // Limpiar contenido anterior

    grupos.forEach((grupo, index) => {
        const puntosDiv = document.createElement('div');
        puntosDiv.textContent = `Grupo ${index + 1}: ${grupo.reduce((sum, participante) => sum + participante.puntos, 0)} puntos`;
        puntosGruposDiv.appendChild(puntosDiv);
    });
}

// Cargar participantes desde el backend
async function cargarParticipantesDesdeBackend() {
    const response = await fetch('http://localhost:5000/api/participantes');
    if (response.ok) {
        const datos = await response.json();
        participantes = datos; // Guardar participantes en la lista local
        mostrarParticipantes(); // Mostrar participantes en la interfaz
    } else {
        console.error('Error al cargar participantes:', response.statusText);
    }
}

// Cargar resultados desde el backend
async function cargarResultadosDesdeBackend() {
    const response = await fetch('http://localhost:5000/api/resultados');
    if (response.ok) {
        const datos = await response.json();
        const listaResultados = document.getElementById("lista-resultados-guardados");
        listaResultados.innerHTML = ''; // Limpiar lista antes de agregar

        datos.forEach(ronda => {
            const liRonda = document.createElement('li');
            liRonda.textContent = `Ronda ${ronda.ronda}:`;
            listaResultados.appendChild(liRonda);

            ronda.partidos.forEach(partido => {
                const liPartido = document.createElement('li');
                liPartido.textContent = `${partido.partido} - Resultado: ${partido.resultado} (Formato: ${partido.formato})`;
                listaResultados.appendChild(liPartido);
            });
        });
    } else {
        console.error('Error al cargar resultados:', response.statusText);
    }
}

// Llama a estas funciones al cargar la página
document.addEventListener("DOMContentLoaded", async () => {
    await cargarParticipantesDesdeBackend();
    await cargarResultadosDesdeBackend();
});
