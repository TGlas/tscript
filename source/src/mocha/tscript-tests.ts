import { assert, expect } from 'chai';
import 'mocha';
import { TestRunner } from '../tests/testRunner';
import { tests } from '../tests/tests';

let testcases = tests;

let cb = {
    suc: function (){},
    fail: function(ex){assert.fail(ex)}
}

//testcases.length = 1;

testcases.forEach( (test) =>{
    describe(test.name, ()=>{
        it(test.description, ()=>{
            return TestRunner.runTest(test, cb, false);
        });
    });

});