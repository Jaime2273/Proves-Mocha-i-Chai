import { assert, expect, should } from 'chai';
import { Bascula } from '../../src/bascula.js';

should(); // activa l'estil should sobre Object.prototype

describe('Bascula - proves unitàries', function () {
  let bascula;
  
  beforeEach(function () {
    bascula = new Bascula(); // cada prova parteix d'una bàscula nova
  });

  describe('Bàscula acabada de crear', function () {
    it('no té cap anotació', function () {
      assert.strictEqual(bascula.obtenirNombreAnotacions(), 0, 'Una bàscula nova ha de tindre 0 anotacions');
    });

    it('pes màxim, mínim i mitjà valen 0', function () {
      expect(bascula.obtenirPesMaxim()).to.equal(0);
      expect(bascula.obtenirPesMinim()).to.equal(0);
      bascula.obtenirPesMitja().should.equal(0);
    });

    it('la taula de pesos és un string HTML', function () {
      assert.isString(bascula.obtenirTaulaPesosHTML());
      expect(bascula.obtenirTaulaPesosHTML()).to.include('<table>');
    });
  });

  describe('Amb una sola pesada', function () {
    beforeEach(function () {
      bascula.anotarPes(70);
    });
it('usa una alçada d\'1 metre per defecte', function () {
      // Como el beforeEach ya ha anotado 70 kg, calculamos el IMC
      // Si la alçada es 1, el IMC debe ser 70 / (1 * 1) = 70
      expect(bascula.calcularIMC()).to.equal(70);
    });
    it('compta una anotació', function () {
      expect(bascula.obtenirNombreAnotacions()).to.equal(1);
    });

    it('màxim, mínim i mitjà coincideixen', function () {
      expect(bascula.obtenirPesMaxim()).to.equal(70);
      expect(bascula.obtenirPesMinim()).to.equal(70);
      expect(bascula.obtenirPesMitja()).to.equal(70);
    });
  });

  describe('Amb diverses pesades', function () {
    beforeEach(function () {
      [85, 95, 91].forEach((p) => bascula.anotarPes(p));
    });

    it('obtenirPesMaxim() = 95', function () {
      bascula.obtenirPesMaxim().should.equal(95);
    });

    it('obtenirPesMinim() = 85', function () {
      bascula.obtenirPesMinim().should.equal(85);
    });

    it('obtenirPesMitja() = 90.3', function () {
      expect(bascula.obtenirPesMitja()).to.be.closeTo(90.3, 0.01);
    });
  });

  describe('Càlcul de l\'IMC', function () {
    it('usa la darrera anotació: 91 kg i 1.83 m -> 27.17', function () {
      bascula.anotarPes(85, 1.83);
      bascula.anotarPes(91, 1.83);
      expect(bascula.calcularIMC()).to.equal(27.17);
    });

    it('sense anotacions retorna 0', function () {
      expect(bascula.calcularIMC()).to.equal(0);
    });
  });

  describe('descriureIMC() valors límit', function () {
    const casos = [
      [15.9, 'Infrapès (primesa severa)'],
      [16, 'Infrapès (primesa moderada)'],
      [17, 'Infrapès (primesa acceptable)'],
      [18.5, 'Pes normal'],
      [25, 'Sobrepès'],
      [30, 'Obesitat (tipus I)'],
      [35, 'Obesitat (tipus II)'],
      [40, 'Obesitat (tipus III)']
    ];

    casos.forEach(([imc, esperat]) => {
      it(`IMC ${imc} -> ${esperat}`, function () {
        expect(Bascula.descriureIMC(imc)).to.equal(esperat);
      });
    });
  });
  describe('Mètode obtenirEvolucio()', function () {
    it('retorna 0 si hi ha menys de dues pesades', function () {
      expect(bascula.obtenirEvolucio()).to.equal(0); // 0 pesadas
      bascula.anotarPes(70);
      expect(bascula.obtenirEvolucio()).to.equal(0); // 1 pesada
    });
    
    it('retorna la diferència de pes entre la darrera i la primera pesada', function () {
      bascula.anotarPes(80); // Primera pesada
      bascula.anotarPes(82);
      bascula.anotarPes(75); // Darrera pesada
      expect(bascula.obtenirEvolucio()).to.equal(-5); // 75 - 80 = -5
    });
  });
  describe('Validació de dades d\'entrada', function () {
    it('rebutja un pes negatiu', function () {
      expect(() => bascula.anotarPes(-5)).to.throw('número positiu');
    });

    it('rebutja un pes que no és un número', function () {
      expect(() => bascula.anotarPes('setanta')).to.throw(Error);
    });

    it('rebutja una alçada igual a 0', function () {
      assert.throws(() => bascula.anotarPes(70, 0), /alçada/);
    });

    it('una anotació rebutjada no es compta', function () {
      try { bascula.anotarPes(-1); } catch { /* esperat */ }
      expect(bascula.obtenirNombreAnotacions()).to.equal(0);
    });
  });
  
});