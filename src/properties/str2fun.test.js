import { str2fun } from "./str2fun";

describe('properties>str2fun module', () => {
    it('converts string to function', () => {
        const f = str2fun('(d) => d*2');
        expect(typeof f).toEqual('function');
        expect(f(2)).toEqual(4);
    })
})