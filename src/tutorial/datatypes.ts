export const tutorial_datatypes = {
	id: "datatypes",
	title: "Simple Datatypes",
	sections: [
		{
			content: `
			<p>
			As you have already learnt in the <i>Syntax</i>-section it 
            is not necessary to specify the datatype of the variables we
            declare. This does not mean that the variables do not have any
            type, though, moreso that the datatype is assigned automatically. 
            </p>
            <p>
            Different datatypes do have different purposes. For general 
            mathematical calculations the <i>Real</i>-type is used, as it 
            reflects the mathematically known real numbers, represented as 
            decimals. Computers aren't able to work with actual real numbers,
            though, since these have infinite decimal places. Therefore, real 
            numbers are rounded to 15 or 16 decimal places. 
            </p>
            <p>
            While programming it is often sensible to use whole 
            numbers, for example for counting or indexing, though. To do 
            so, a data type called <i>Integer</i>-type is used. It reflects
            the whole numbers in a range from -2<sup>31</sup> to 
            2<sup>31</sup>-1. 
			</p>
            <p>
            To store text we use the <i>String</i>-type. A string is a sequence
            of characters with any size, written in quotation marks, which signal
            this specific datatype. It is possible to store any kind of ASCII
            character inside of a string with few exceptions, for example the
            quotation mark itself. To be able to store a string with any "forbidden"
            characters, you first have to escape the string using the "\ "-operator.
            Here are some examples of assignments of the simple datatypes we have
            discussed above:
            <tscript>
                var r = -2.563;             # this is a real
                var i = 57;                 # this is an integer
                var s = "Hello!";           # this is a string
                var t = "\\"Hello!\\"";     # this is a string with two quoation marks 
            </tscript>
            </p>
			`,
		},
	],
};
