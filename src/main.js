
const figuras1=['fa-hippo','fa-moon','fa-rocket','fa-fish','fa-anchor','fa-car-side','fa-book','fa-snowman','fa-umbrella','fa-hippo','fa-moon','fa-rocket','fa-fish','fa-anchor','fa-car-side','fa-book','fa-snowman','fa-umbrella'];
const $tablero=document.querySelector('#tablero');
const $cartas=$tablero.querySelectorAll('tarjeta');
let cantAciertos=0;
let turnos=0;
let figuras2=[];
let eleccion=[];
let puntaje=0;
const $btnComenzar=document.querySelector('#empezar');

$btnComenzar.onclick=comenzarJuego;

function comenzarJuego(){
    $btnComenzar.textContent='Reiniciar';
    bloquearInputUsuario();
    borrarAciertosyErrores();
    asignarFiguras();
    manejarRonda();
    
}

function finDelJuego(){
    const $mensajeFinal=document.querySelector('#fin-juego');
    mostrarMensajeFinal($mensajeFinal);
}

function mostrarMensajeFinal($mensajeFinal){
    $mensajeFinal.style.display='block';
    $mensajeFinal.querySelector('p strong').textContent=`Fin del juego! Tu puntaje final es ${puntaje}. Tardaste ${turnos} turnos en resolverlo!`;

}

function borrarAciertosyErrores(){
    const $cartas=document.querySelectorAll('.tarjeta');
    const $puntaje=document.querySelector('#puntaje');

    $puntaje.textContent='Puntaje: 0';

    $cartas.forEach(function($carta){
        $carta.classList.remove('acierto');
        
    });
}

function manejarRonda(){
    mostrarCartas();
    
}


function mostrarCartas(){
    const $cartas=document.querySelectorAll('.tarjeta');

    $cartas.forEach(function($carta){
        $carta.style.transform='rotateY(180deg)';
        setTimeout(function(){
            $carta.style.transform='rotateY(0deg)';
            desbloquearInputUsuario($tablero);
        },3000);
        
    });
}


function asignarFiguras(){
    vaciarFiguras();
    
    figuras2=desordenarArray(figuras1);

    let i=0;
    

    const $cartas=document.querySelectorAll('.trasera .fa-solid');

    $cartas.forEach(function($carta){
        $carta.classList.add(figuras2[i]);
        i++;
    });
}

function vaciarFiguras(){
    const $cartas=document.querySelectorAll('i');

    $cartas.forEach(function($carta){
        for(let i=0;i<figuras1.length;i++){
            if($carta.classList[1]==figuras1[i]){
                $carta.classList.remove(figuras1[i]);
            }
        }
    });
}

function desbloquearInputUsuario(){
    reiniciarSeleccion();

    if(cantAciertos==9){
        finDelJuego();
    }

    const $cartas=document.querySelectorAll('.tarjeta');


    $cartas.forEach(function($carta){
        if(!$carta.classList.contains('acierto') && !$carta.classList.contains('repetida')){
            $carta.classList.add('activo');
            $carta.onclick=manejarInputUsuario;
        }
    });

}

function manejarInputUsuario(e){
    
    const $carta=e.currentTarget;
    
    mostrarCarta($carta);

    if(eleccion.length==2){
        
        if(eleccion[0]===eleccion[1]){
            eleccion=eleccion.slice(0,1);
    
            return;
        }

        turnos++;
        compararCartas();
    }

}

function mostrarCarta($carta){

    $carta.style.transform='rotateY(180deg)';
    eleccion.push($carta);
}

function ocultarCarta($carta){
    setTimeout(function(){
        $carta.style.transform='rotateY(0deg)';
        $carta.classList.remove('error');
    },1500);
}

function reiniciarSeleccion(){
    eleccion=[];
}

function sonIguales($carta1,$carta2){
    return $carta1.querySelector('i').classList[1]==$carta2.querySelector('i').classList[1];
}

function compararCartas(){
    bloquearInputUsuario();

    sonIguales(eleccion[0],eleccion[1]) ? marcarAcierto() : marcarError();

    desbloquearInputUsuario();
    
}

function desactivarCartas(){
    eleccion[0].classList.remove('activo');
    eleccion[1].classList.remove('activo');
}

function marcarAcierto(){
    actualizarPuntaje(true);
    cantAciertos++;
    pintarAcierto();
    desactivarCartas();
}

function marcarError(){
    actualizarPuntaje(false);
    pintarError();

    ocultarCarta(eleccion[0]);
    ocultarCarta(eleccion[1]);
}

function actualizarPuntaje(acierto){
    const $puntaje=document.querySelector('#puntaje');

    if(acierto){
        puntaje+=100;
    }else{
        puntaje-=10;
    }

    $puntaje.textContent=`Puntaje: ${puntaje}`;

}

function pintarAcierto(){
    eleccion[1].classList.add('acierto');

    eleccion[0].classList.add('acierto');

    
}

function pintarError(){
    eleccion[0].classList.add('error');
    eleccion[1].classList.add('error');

}

function bloquearInputUsuario(){
    const $cartas=document.querySelectorAll('.tarjeta');

    $cartas.forEach(function($carta){

        $carta.classList.remove('activo');
        $carta.onclick=function(){

        };
    });
}

function desordenarArray(array) {
  return array.sort(() => Math.random() - 0.5);

}
