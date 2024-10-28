let participantes = [];
let grupos = [];
let resultados = [];

function mostrarModulo(modulo) {
    const modulos = document.querySelectorAll('.module');
    modulos.forEach(m => m.style.display = 'none');
    document.getElementById(modulo).style.display = 'block';
}

function addParticipante() {
    const nombre = document.getElementById("nombre-participante").value;
    const fechaNacimiento = document.getElementById("fecha-nacimiento").value;
    const genero = document.getElementById("genero").value;
    const categoria = document.getElementById("categoria").value;
    const lado = document.getElementById("lado").value;
    const manoHabil = document.getElementById("mano-habil").value;

    if (nombre) {
        participantes.push({
            nombre,
            fechaNacimiento,
            genero,
            categoria,
            lado,
            manoHabil,
            puntos: 0 // Inicializar puntos
        });
        document.getElementById("nombre-participante").value = '';
        mostrarParticipantes();
    } else {
        alert("El nombre completo es obligatorio.");
    }
}

function mostrarParticipantes() {
    const listaParticipantes = document.getElementById("lista-participantes");
    listaParticipantes.innerHTML = '';
    participantes.forEach(participante => {
        const li = document.createElement('li');
        li.textContent = participante.nombre;
        listaParticipantes.appendChild(li);
    });
}

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

function cargarResultados() {
    resultados = [];
    // Resetear puntos de los grupos antes de la carga
    grupos.forEach(grupo => {
        grupo.forEach(participante => { participante.puntos = 0; }); // Resetear puntos de los participantes
    });

    for (let i = 0; i < grupos.length; i++) {
        for (let j = i + 1; j < grupos.length; j++) {
            const resultadoInput = document.getElementById(`resultado-${i}-${j}`);
            const resultado = resultadoInput.value;

            if (resultado) {
                const [score1, score2] = resultado.split('-').map(Number);
                const puntosGrupo1 = score1 > score2 ? 3 : score1 < score2 ? 0 : 1; // Puntos para el grupo 1
                const puntosGrupo2 = score1 < score2 ? 3 : score1 > score2 ? 0 : 1; // Puntos para el grupo 2

                resultados.push({ partido: `Grupo ${i + 1} vs Grupo ${j + 1}`, resultado, puntos: [puntosGrupo1, puntosGrupo2] });

                // Asignar puntos a los grupos
                grupos[i].forEach(participante => { participante.puntos += puntosGrupo1; });
                grupos[j].forEach(participante => { participante.puntos += puntosGrupo2; });
            }
        }
    }

    mostrarResultados();
}

function mostrarResultados() {
    const listaResultados = document.getElementById("lista-resultados");
    listaResultados.innerHTML = '';
    resultados.forEach(r => {
        const li = document.createElement('li');
        li.textContent = `${r.partido} - Resultado: ${r.resultado}`;
        listaResultados.appendChild(li);
    });
}

function calcularClasificacion() {
    const clasificacion = grupos.map((grupo, index) => ({
        grupo: index + 1,
        puntaje: grupo.reduce((acc, p) => acc + p.puntos, 0) // Sumar puntos del grupo
    }));

    clasificacion.sort((a, b) => b.puntaje - a.puntaje); // Ordenar por puntaje total
    mostrarClasificacion(clasificacion);
}

function mostrarClasificacion(clasificacion) {
    const listaClasificacion = document.getElementById("lista-clasificacion");
    listaClasificacion.innerHTML = '';
    clasificacion.forEach(grupo => {
        const li = document.createElement('li');
        li.textContent = `Grupo ${grupo.grupo} - Puntaje Total: ${grupo.puntaje}`;
        listaClasificacion.appendChild(li);
    });
}
