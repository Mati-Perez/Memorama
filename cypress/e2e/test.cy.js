
const URL='192.168.56.1:8080';
const NUMERO_CUADROS=18;

context('Memotest', ()=>{

  before(()=>{
    cy.visit(URL);
  });

  it('se asegura que haya un tablero con cuadros', ()=>{
    cy.get('#tablero').find('.tarjeta').should('have.length',NUMERO_CUADROS);
  });
})