let parejas = [];
let grupos = [];
let resultados = [];

function mostrarModulo(modulo) {
    const modulos = document.querySelectorAll('.module');
    modulos.forEach(m => m.style.display = 'none');
    document.getElementById(modulo).style.display = 'block';
}

function addPareja() {
    const nombre = document.getElementById("nombre-pareja").value;
    const fechaNacimiento = document.getElementById("fecha-nacimiento").value;
    const genero = document.getElementById("genero").value;
    const categoria = document.getElementById("categoria").value;
    const lado = document.getElementById("lado").value;
    const manoHabil = document.getElementById("mano-habil").value;

    if (nombre) {
        parejas.push({
            nombre,
            fechaNacimiento,
            genero,
            categoria,
            lado,
            manoHabil
        });
        document.getElementById("nombre-pareja").value = '';
        mostrarParejas();
    } else {
        alert("El nombre completo es obligatorio.");
    }
}

function mostrarParejas() {
    const listaParejas = document.getElementById("lista-parejas");
    listaParejas.innerHTML = '';
    parejas.forEach((pareja, index) => {
        const li = document.createElement('li');
        li.textContent = pareja.nombre;
        listaParejas.appendChild(li);
    });
}

function armarGrupos() {
    const numGrupos = parseInt(document.getElementById("num-grupos").value);
    if (numGrupos < 1 || parejas.length < numGrupos) {
        alert("Debe haber al menos tantas parejas como grupos.");
        return;
    }

    grupos = [];
    let shuffledParejas = parejas.slice().sort(() => Math.random() - 0.5); // Barajar

    for (let i = 0; i < numGrupos; i++) {
        grupos[i] = [];
    }

    shuffledParejas.forEach((pareja, index) => {
        grupos[index % numGrupos].push(pareja);
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
}

function cargarResultado() {
    const partido = document.getElementById("partido").value;
    const resultado = document.getElementById("resultado").value;

    if (partido && resultado) {
        resultados.push({ partido, resultado });
        document.getElementById("partido").value = '';
        document.getElementById("resultado").value = '';
        mostrarResultados();
    } else {
        alert("Ambos campos son obligatorios.");
    }
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
    const clasificacion = resultados.map(r => {
        return {
            partido: r.partido,
            puntaje: Math.floor(Math.random() * 10) // Simulación de puntajes aleatorios
        };
    });

    clasificacion.sort((a, b) => b.puntaje - a.puntaje); // Ordenar por puntaje

    mostrarClasificacion(clasificacion);
}

function mostrarClasificacion(clasificacion) {
    const listaClasificacion = document.getElementById("lista-clasificacion");
    listaClasificacion.innerHTML = '';
    clasificacion.forEach(c => {
        const li = document.createElement('li');
        li.textContent = `${c.partido} - Puntaje: ${c.puntaje}`;
        listaClasificacion.appendChild(li);
    });
}
