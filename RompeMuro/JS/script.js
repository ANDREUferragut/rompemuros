const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let colors = ["#fa75cc", "#eafa75", "#fa8975", "#75b5fa", "#adfa75", "#97fdcf", "#8a9507", "#06fde3", "#20fd06", "#f80047"];

canvas.height = 512;
canvas.width = 448;

const filas = 8;
const columnas = 10;
const ampleMur = 33;
const alturaMur = 7;
const margueTMur = 80;
const margueEMur = 30;
const separacioMur = 2;

const murs = [];
const ESTAT_MUR = {
    DESTRUIT: 0,
    TOCADO: 1,
    SHOW: 2
};

function crearMur(c, f) {
    let color = Math.floor(Math.random() * 10);
    const murX = Math.floor(Math.random() * (canvas.width - ampleMur)); 
    const murY = Math.floor(Math.random() * (canvas.height / 2 - alturaMur)); 

    murs[c][f] = {
        x: murX,
        y: murY,
        status: ESTAT_MUR.SHOW,
        color: color,
        vides: 2
    };
}

for (let c = 0; c < columnas; c++) {
    murs[c] = [];
    for (let f = 0; f < filas; f++) {
        crearMur(c, f);
    }
}

let radiPilota = 15;
let x = canvas.width / 2;
let y = canvas.height - 30;

let dx = 2;
let dy = -2;

let amplePala = 70;
let alturaPala = 10;

let sensibilitat = 8;
let dreta = false;
let esquerra = false;

let palaX = (canvas.width - amplePala) / 2;
let palaY = canvas.height - alturaPala - 10;

let vides = 3;
let marcador = 0;

const bolaImg = new Image();
bolaImg.src = 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/fd362a71-bec6-40e9-8c94-4a1ba38f5b70/dbw5hau-427d0446-844d-418d-a56e-6b4bb6ce961b.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2ZkMzYyYTcxLWJlYzYtNDBlOS04Yzk0LTRhMWJhMzhmNWI3MFwvZGJ3NWhhdS00MjdkMDQ0Ni04NDRkLTQxOGQtYTU2ZS02YjRiYjZjZTk2MWIucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.eECucX9pc30446MZuXS_00W-RRZQQts1H8PFKJSnziU';

const barra = document.getElementById("sprite");
const m = document.getElementById("murs");

let pausado = false;
let animationFrameId;

function pausarJuego() {
    pausado = true;
    cancelAnimationFrame(animationFrameId);  
    document.getElementById("musica").pause();  
}

function reanudarJuego() {
    pausado = false;
    document.getElementById("musica").play(); 
    pintarCanvas();  
}

function pintarPala() {
    ctx.drawImage(
        barra,
        0,
        0,
        370,
        120,
        palaX,
        palaY,
        amplePala,
        alturaPala
    );
}

function inicialitzadorEvents() {
    document.addEventListener('keydown', pulsar);
    document.addEventListener('keyup', soltar);

    function pulsar(event) {
        if (event.key == 'ArrowRight' || event.key == 'd') {
            dreta = true;
        }
        if (event.key == 'ArrowLeft' || event.key == 'a') {
            esquerra = true;
        }

        if (event.key == '+') {
            amplePala = 2 * amplePala;
        }

        if (event.key == '-') {
            amplePala = amplePala / 2;
        }

        if (event.key == 'w') {
            radiPilota = radiPilota * 2;
        }

        if (event.key == 's') {
            radiPilota = radiPilota / 2;
        }

        if (event.key == 'q') {
            sensibilitat = sensibilitat * 2;
        }

        if (event.key == 'e') {
            sensibilitat = sensibilitat / 2;
        }

        if (event.key == 'ArrowUp') {
            dx = dx * 2;
            dy = dy * 2;
            let dxNueva2 = dx;
            let dyNueva2 = dy;
            dx = 0;
            dy = 0;
            setTimeout(() => {
                dx = dxNueva2;
                dy = dyNueva2;
            }, 1000);
        }

        if (event.key == 'ArrowDown') {
            dx = dx / 2;
            dy = dy / 2;
            let dxNueva = dx;
            let dyNueva = dy;
            dx = 0;
            dy = 0;
            setTimeout(() => {
                dx = dxNueva;
                dy = dyNueva;
            }, 1000);
        }

        if (event.key == "g") {
            pintarPilota2();
            movimentPilota2();
        }

        if (event.key == 'ñ') {
            let dxNova = dx;
            let dyNova = dy;
            dx = 0;
            dy = 0;
            setTimeout(() => {
                dx = dxNova;
                dy = dyNova;
            }, 3000);
        }
    }

    function soltar(event) {
        if (event.key == 'ArrowRight' || event.key == 'd') {
            dreta = false;
        }
        if (event.key == 'ArrowLeft' || event.key == 'a') {
            esquerra = false;
        }
    }
}

function pintarMurs() {
    for (let c = 0; c < columnas; c++) {
        for (let f = 0; f < filas; f++) {
            const murActual = murs[c][f];
            if (murActual.status == ESTAT_MUR.DESTRUIT) {
                continue;
            }
            let clipX = murActual.color * 16;
            ctx.drawImage(
                m,
                clipX,
                0,
                15,
                6,
                murActual.x,
                murActual.y,
                ampleMur,
                alturaMur
            );
        }
    }
}

function deteccioColisio() {
    for (let c = 0; c < columnas; c++) {
        for (let f = 0; f < filas; f++) {
            const murActual = murs[c][f];
            if (murActual.status === ESTAT_MUR.DESTRUIT) {
                continue;
            }
            if (x >= murActual.x && x <= murActual.x + ampleMur &&
                y >= murActual.y && y <= murActual.y + alturaMur) {
                dy = -dy;
                murActual.vides--;
                if(murActual.vides == 0){ }
                murActual.status = ESTAT_MUR.DESTRUIT;
                marcador += 10;
            }
        }
    }
}

function movimentPala() {
    if (dreta && palaX < canvas.width - amplePala) {
        palaX += sensibilitat;
    } else if (esquerra && palaX > 0) {
        palaX -= sensibilitat;
    }
}

function movimentPilota() {
    if (x + dx >= canvas.width - radiPilota || x + dx <= 0 + radiPilota) {
        dx = -dx;
    }

    if (y + dx <= 0) {
        dy = -dy;
    }

    if (y == palaY && x >= palaX && x <= palaX + amplePala) {
        dy = -dy;
    }

    if (y + dy > canvas.height) {
        vides--;
        marcador -= 100;

        radiPilota = 9;
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        amplePala = 50;
        alturaPala = 10;
        sensibilitat = 8;
        dreta = false;
        esquerra = false;
        palaX = (canvas.width - amplePala) / 2;
        palaY = canvas.height - alturaPala - 10;

        if (vides == 0) {
            alert("GAME OVER");
            console.log("GAME OVER");
            document.location.reload();
        }
    }
    x += dx;
    y += dy;
}

function borrarPantalla() {
    canvas.height = 512;
    canvas.width = 448;
}

function pintarPilota() {
    ctx.drawImage(bolaImg, x - radiPilota, y - radiPilota, radiPilota * 2, radiPilota * 2);
}

function pintarCanvas() {
    if (pausado) {
        return;  
    }

    borrarPantalla();
    pintarPilota();
    pintarPala();
    pintarMurs();

    deteccioColisio();
    movimentPilota();
    movimentPala();

    ctx.fillStyle = "#FFF";
    ctx.font = "13px Arial";
    ctx.fillText("Vides: " + vides, 10, 10);
    ctx.fillText("Marcador: " + marcador, canvas.width - 100, 10);

    animationFrameId = window.requestAnimationFrame(pintarCanvas);
}

function agregarNuevosMurs() {
    for (let c = 0; c < 3; c++) { 
        const cAleatorio = Math.floor(Math.random() * columnas);
        const fAleatorio = Math.floor(Math.random() * filas);
        crearMur(cAleatorio, fAleatorio);
    }
}

setInterval(agregarNuevosMurs, 10000);

let snd = new Audio ('./KAROL G, Nicki Minaj - Tusa (Official Video) [tbneQDc2H3I].mp3');
snd.play();

document.getElementById("pausa").addEventListener("click", pausarJuego);  
document.getElementById("reanuda").addEventListener("click", reanudarJuego);  

pintarCanvas();
inicialitzadorEvents();


