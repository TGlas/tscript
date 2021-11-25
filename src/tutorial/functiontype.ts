export const tutorial_functiontype = {
	id: "ftype",
	title: "Data types \"Type\" and \"Function\"",
	sections: [
		{
			content: `
            As you have already seen it is possible to assign functions to a variable.
            Even if we do not specifically define it, every variable is of a certain
            type. If we assign a function to a variable, the variable becomes the
            <i>Function</i>-type. If we assign a type to a variable, the variable
            becomes the <i>Type</i>-type:
            <tscript>
            var p = print;

            print(Type(p));     # prints <Type Function>

            var t = Type(Function);
            print(t);           # prints <Type Type>
            print(Type(t));     # prints <Type Function>
            </tscript>
            This way you are able to test if handed over variables correspond to 
            the data type you expected. Imagine a function expecting to get a
            function and working with it. If the data type wouldn't match, the 
            whole function wouldn't work as intended or even create errors:
            <tscript>
            function callF(f) {
                if (Type(f) == Function) {
                    f();
                }
                else print("Please hand over a function");
            }
            </tscript>
			`
        }
	]
};