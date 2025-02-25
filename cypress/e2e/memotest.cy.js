/// <reference types="Cypress" />

const URL='192.168.56.1:8080';

context('Memotest',()=>{

    beforeEach(()=>{
        cy.visit(URL);
    });

    describe('juega al memotest',()=>{
        const NUMERO_CUADROS=18;

        it('se asegura que haya un tablero con cartas', ()=>{
            cy.get('#tablero').find('.tarjeta').should('have.length',NUMERO_CUADROS);
        });
        

        it('se asegura que las tarjetas sean aleatorias', ()=>{
           cy.get('#empezar').click();
           cy.wait(3000);

            cy.get('.trasera i').then((tarjetas)=>{
                let clasesOriginales=[];
                tarjetas.each(function(i,tarjeta){
                    clasesOriginales.push(tarjeta.className);
                });

                cy.get('#empezar').click();
                cy.wait(3000);

                let clasesNuevas=[];
                cy.get('.trasera i').then(nuevosCuadros=>{
                    nuevosCuadros.each(function(i,tarjeta){
                        clasesNuevas.push(tarjeta.className);
                    });

                    cy.wrap(clasesOriginales).should('not.deep.equal',clasesNuevas);
                });
            });
        });

        describe('resuelve el juego', ()=>{
            let mapaDePares, listaDePares;

            beforeEach(() => {
                cy.get('#empezar').click();
                cy.wait(3000);
            });

            it('elige una combinación errónea', ()=>{
                cy.get('.trasera .fa-solid').then(tarjetas=>{

                    mapaDePares=obtenerParesDeCartas(tarjetas);
                    
                    console.log(Object.values(mapaDePares));

                    listaDePares=Object.values(mapaDePares);
                    
                    cy.get(listaDePares[0][0]).then(($el)=>{
                        console.log($el[0]);
                        cy.wrap($el[0]).closest('.tarjeta').click();
                    });
                    cy.get(listaDePares[1][0]).then(($el)=>{
                        console.log($el[0]);
                        cy.wrap($el[0]).closest('.tarjeta').click();
                    });

                    cy.get('.tarjeta').should('have.length',NUMERO_CUADROS);
                });
            });
            
            it('resuelve el juego',()=>{
                
                cy.get('.tarjeta').should('have.length',NUMERO_CUADROS);
                

                listaDePares.forEach((par)=>{

                    let clases=par[0].className.split(' ');
                    let clase=clases[1];

                    cy.get(`.${clase}`).eq(0).should('exist').then(($el) => {
                        cy.wrap($el[0]).closest('.tarjeta').click({ force: true });
                    });
                    
                    cy.get(`.${clase}`).eq(1).should('exist').then(($el) => {
                        cy.wrap($el[0]).closest('.tarjeta').click({ force: true });
                    });
                    
                });

                //cy.get('.tarjeta').should('have.length',0);

                //cy.get('#tablero').should('not.be.visible');
                const numeroTurnos=NUMERO_CUADROS / 2;
                const puntaje='900';

                cy.get('#fin-juego').should('be.visible').contains(
                    `Fin del juego! Tu puntaje final es ${puntaje}. Tardaste ${numeroTurnos} turnos en resolverlo!`
                );
            });
        });
    });
});

function obtenerParesDeCartas(cartas){
    const pares={};
    
    cartas.each((i,carta)=>{
        let clases=carta.className.split(' ');
        let clase=clases[1];
          
        if(pares[clase]){
            pares[clase].push(carta);
        }else{
            pares[clase]=[carta];
        }
    });

    return pares;
}