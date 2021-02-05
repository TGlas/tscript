import { assert, expect } from 'chai';
import 'mocha';
import { TestRunner } from './testRunner';
import { tests, TscriptTest } from './tests';

let testcases = tests;

let cb = {
    suc: function (){},
    fail: function(ex){assert.fail(ex)}
}


testcases.forEach( (test) =>{
    describe(test.name, ()=>{
        it(test.description, ()=>{
            return TestRunner.runTest(test, cb, false);
        });
    });

});


let failTest:TscriptTest = {
    description: "",
    name: "",
    code: "print(\"Hello\");",
    expectation: [
        {type: "print", message: "World"},
        "finished"
    ],
}

describe("tests can fail", ()=>{
    it("should fail", async ()=>{
        await TestRunner.runTest(failTest, {suc: cb.fail, fail: cb.suc}, false);
    });
});