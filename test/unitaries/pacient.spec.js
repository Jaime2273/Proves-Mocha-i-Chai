import { expect } from 'chai';
import { Pacient } from '../../src/pacient.js';
import sinon from 'sinon';

describe('Pacient - proves unitàries', function () {
  let pacient;

  beforeEach(function () {
    pacient = new Pacient('Laia', 'Ferrer Soler', '16/03/1988');
  });

  it('saludar() retorna "Hola, soc Laia Ferrer Soler"', function () {
    expect(pacient.saludar()).to.equal('Hola, soc Laia Ferrer Soler');
  });

  it('obtenirNom() i modificarNom()', function () {
    expect(pacient.obtenirNom()).to.equal('Laia');
    pacient.modificarNom('Marta');
    expect(pacient.obtenirNom()).to.equal('Marta');
  });

  it('obtenirCognoms() i modificarCognoms()', function () {
    pacient.modificarCognoms('Ribes Mas');
    expect(pacient.obtenirCognoms()).to.equal('Ribes Mas');
  });

  it('accepta la data com a text dd/mm/aaaa', function () {
    const d = pacient.obtenirDataNaixement();
    expect(d).to.be.instanceof(Date);
    expect([d.getDate(), d.getMonth() + 1, d.getFullYear()])
      .to.deep.equal([16, 3, 1988]);
  });

  describe('obtenirEdat() amb data de referència fixa', function () {
    it('el dia abans de l\'aniversari encara té 37 anys', function () {
      expect(pacient.obtenirEdat(new Date(2026, 2, 15))).to.equal(37);
    });
    describe('obtenirEdat() amb Sinon (fake timers)', function () {
    it('calcula l\'edat fixant el rellotge a 1 de gener de 2030', function () {
      // 1. Fixem el rellotge fals
      const rellotge = sinon.useFakeTimers(new Date(2030, 0, 1));
      
      // El pacient del beforeEach va nàixer el 16/03/1988.
      // A l'1 de gener de 2030 encara no ha complit anys, per tant té 41 anys.
      expect(pacient.obtenirEdat()).to.equal(41);
      
      // 2. Restaurem el rellotge original perquè no afecte a altres proves
      rellotge.restore();
    });
  });
    it('el dia de l\'aniversari ja en té 38', function () {
      expect(pacient.obtenirEdat(new Date(2026, 2, 16))).to.equal(38);
    });

    it('després de modificar la data de naixement', function () {
      pacient.modificarDataNaixement('29/02/2000');
      expect(pacient.obtenirEdat(new Date(2026, 9, 5))).to.equal(26);
    });
  });

  it('té una bàscula associada per defecte', function () {
    expect(pacient.obtenirBascula()).to.exist;
    expect(pacient.calcularIMC()).to.equal(0);
  });
  it('accepta la data com a objecte Date en constructor i modificador', function () {
    const data = new Date(1995, 5, 20);
    const nouPacient = new Pacient('Joan', 'García', data);
    expect(nouPacient.obtenirDataNaixement()).to.equal(data);

    const novaData = new Date(2000, 1, 1);
    nouPacient.modificarDataNaixement(novaData);
    expect(nouPacient.obtenirDataNaixement()).to.equal(novaData);
  });
  describe('Validació en el constructor', function () {
    it('llança un error si el nom està buit', function () {
      expect(() => new Pacient('', 'Cognoms', '01/01/2000')).to.throw();
    });

    it('llança un error si la data de naixement és posterior a hui', function () {
      const dema = new Date();
      dema.setDate(dema.getDate() + 1); // Forzamos una fecha de mañana
      expect(() => new Pacient('Joan', 'Cognoms', dema)).to.throw();
    });
  });
});