import { expect } from 'chai';

import {testfunc1, testfunc2} from './index';

describe('basic testing apparatus', () => {
	it('test env var', () =>{
      expect(testfunc1()).to.eql(process.env.TEST);
	});
	it('test function params', () =>{
      expect(testfunc2(1, 2)).to.eql(3);
	});
})
