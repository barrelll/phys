import chai from 'chai';
import { Vector3 } from '../resources/threejs/r146/build/three.cjs';
import Utils from '../js/UtilsFunctions.mjs';
import { MachineBuilder } from '../js/Components.mjs';

describe('Utils.angleOf', function () {
  it('should return the correct angle in radians based on two 2D points positions in space (x and z)', function () {
    const _v1 = new Vector3(0, 12, 0);
    const _v2 = new Vector3(0, 13, 31);
    const val = Utils.angleOf(_v1, _v2);
    chai.expect(val).to.equal(0);
  });

  it('should return the correct angle in radians based on two 2D points positions in space (y and x)', function () {
    const _v1 = new Vector3(7, 0, 0);
    const _v2 = new Vector3(11, 3, 31);
    const val = Utils.angleOf(_v1, _v2, ['y', 'x']);
    chai.expect(val).to.be.closeTo(0.64350111, 0.00000002);
  });

  it('should return the wrong angle value in radians based on two 2d points with the wrong orientation (x and y)', function () {
    const _v1 = new Vector3(7, 0, 0);
    const _v2 = new Vector3(11, 3, 31);
    const val = Utils.angleOf(_v1, _v2, ['x', 'y']);
    chai.expect(val).to.not.be.closeTo(0.64350111, 0.00000002);
  });
});

describe('Components.MachineBuilder', function () {
  it('should create a Map object such that multiple whens are mapped to one do', function () {
    const builder = new MachineBuilder();
    const machine = builder
      .state('State')
      .when(() => {
        return true;
      })
      .when(() => {
        return true;
      })
      .do(() => {
        return true;
      })
      .build();
    const whens_val = machine.get('State')[0].whens.length;
    chai.expect(whens_val).to.be.equal(2);
    const dos_val = machine.get('State')[0].dos.length;
    chai.expect(dos_val).to.be.equal(1);
    chai.expect(machine.state).to.be.equal('State');
  });
  it('should create a Map object such that multiple dos are mapped to one whens', function () {
    const builder = new MachineBuilder();
    const machine = builder
      .state('State')
      .when(() => {
        return true;
      })
      .do(() => {
        return true;
      })
      .do(() => {
        return true;
      })
      .build();
    const whens_val = machine.get('State')[0].whens.length;
    chai.expect(whens_val).to.be.equal(1);
    const dos_val = machine.get('State')[0].dos.length;
    chai.expect(dos_val).to.be.equal(2);
    chai.expect(machine.state).to.be.equal('State');
  });
  it('should create a Map object such that multiple dos are mapped to multiple whens', function () {
    const builder = new MachineBuilder();
    const machine = builder
      .state('State')
      .when(() => {
        return true;
      })
      .when(() => {
        return true;
      })
      .do(() => {
        return true;
      })
      .do(() => {
        return true;
      })
      .build();
    const whens_val = machine.get('State')[0].whens.length;
    chai.expect(whens_val).to.be.equal(2);
    const dos_val = machine.get('State')[0].dos.length;
    chai.expect(dos_val).to.be.equal(2);
    chai.expect(machine.state).to.be.equal('State');
  });
});
