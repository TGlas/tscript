export const tutorial_functiontype = {
	id: "functiontype",
	title: "Function and Type",
	sections: [
		{
			content: `
			<p>
			We have seen many different types of values, and in an earlier unit on
			data types we got a first overview. Since then we added ranges, and much
			more importantly, arrays, dictionaries and classes. However, two types
			of values are still missing: functions and types.
			</p>

			<h2>Functions</h2>
			<p>
			We have used functions like <code>print</code> as values before, for
			example as an item in an array:
			<tscript>
				var a = [42, "Hello", true, print, null];
			</tscript>
			However, we did not investigate systematically what it means to use a
			function name as a value. First of all, we need to get the difference
			between a function itself and a function call clear:
			<tscript>
				var a = print;    # no output, print is not executed
				print("Hello");   # prints the message "Hello"
				a("World");       # prints the message "World"
			</tscript>
			A function name is just that: a name. It is a reference to the function.
			Recall that this is exactly analogous to math notation. Consider the
			function <i>f(x) = x<sup>2</sup></i>. Then <i>f</i> is the function
			itself, not a specific value. It has a function rule and a graph (a
			parabola). In contrast, <i>f(4)</i> is a number, namely the value 16.
			A function and a number are quite different things.
			</p>
			<p>
			The concept transfers to programming:
			<tscript>
				function f(x) { return x^2; }
				var g = f;
				var h = f(4);
				print(g);       # prints <Function f>
				print(h);       # prints 16
			</tscript>
			The variable <code>g</code> refers to the function itself. It holds a
			reference to the function <i>f</i> as a value. In other words, each
			function is a valid value. Each value has a data type, and functions are
			no exception. In TScript, this type is simply called
			<code>Function</code>.
			</p>

			<h3>Using Functions</h3>
			<p>
			The only meaningful operation supported by a function is to call it. To
			this end, it does not matter whether the function is called by its name
			or by any other reference, stored in a variable. There is rarely a need
			to store a function reference in a variable. However, it can be
			tremendously useful to pass a function as a parameter into another
			function, or to return it from a function. A good example is array
			sorting. We have seen that the built-in <code>sort</code> function sorts
			an array in ascending order:
			<tscript>
				var a = [3, 2, 1, 2];
				a.sort();
				print(a);       # prints [1,2,2,3]
			</tscript>
			Now, what if we want the numbers in descending order instead? It turns
			out that the sort function does not really care. It can sort with
			respect to all kinds of sorting criteria, which can be specified in the
			form of a function. That comparison function takes two array items as
			parameters and returns a number. If the number is zero then the two
			values are considered equal. If it is negative then the first item is
			to be sorted <i>before</i> the second, and a positive return value
			indicates that the first value belongs <i>after</i> the first one. If we
			pass such a comparison function to <code>sort</code> as a parameter,
			then <code>sort</code> will call our function repeatedly with various
			pairs of items until it has figured out the correct order. Let's sort
			the array in descending order:
			<tscript>
				function myOrder(x, y)
				{
					if x == y then return 0;
					else if x < y then return 1;
					else return -1;
				}
				var a = [3, 2, 1, 2];
				a.sort(myOrder);
				print(a);       # prints [3,2,2,1]
			</tscript>
			Since only the sign of the return value matters, the comparison function
			can be simplified as follows:
			<tscript>
				function myOrder(x, y)
				{ return y - x; }
			</tscript>
			Just go through a few examples (plug in some values for <code>x</code>
			and <code>y</code>) to convince yourself that the two versions represent
			the same order.
			</p>
			<div class="tutorial-exercise">
			<p>
			Write a comparison function <code>function compare(x, y)</code> that
			sorts an array of integers such that uneven numbers are sorted to the
			front and even numbers to the back. Within these two blocks, numbers
			shall be sorted in ascending order.
			</p>
			<p>
			Hint: test the function by sorting an array. For example, the following
			test program
			<tscript>
				var a = [1,2,3,4,5,6];
				a.sort(compare);
				print(a);
			</tscript>
			should print the array <code>[1,3,5,2,4,6]</code>.
			</p>
			</div>
			`,
			correct: `
			function compare(x, y)
			{
				var x_even = (x % 2) == 0;
				var y_even = (y % 2) == 0;
				if x_even != y_even then
				{
					if x_even then return +1; else return -1;
				}
				else
				{
					return x - y;
				}
			}
			`,
			tests: [
				{
					type: "call",
					code: "[1,2,3,4,5,6,7,8].sort(compare);",
				},
				{
					type: "call",
					code: "[8,7,6,5,4,3,2,1,6,5,4,1].sort(compare);",
				},
			],
		},
		{
			content: `

			<h2>Types</h2>
			<p>
			The last datatype we are missing is <code>Type</code>. It is a type
			representing a type... what? Let's better get this clear before we get
			lost in an self-referential cycle.
			</p>
			<p>
			We already know the following types:
			<code>Null</code>,
			<code>Boolean</code>,
			<code>Integer</code>,
			<code>Real</code>,
			<code>String</code>,
			<code>Range</code>,
			<code>Array</code>,
			<code>Dictionary</code>,
			<code>Function</code>,
			as well as classes. All of the above are types. Still they can be
			assigned to variables:
			<tscript>
				var t = Integer;
				print(t);         # prints <Type Integer>
			</tscript>
			This means that they must also be values. That's indeed the case, and
			the datatype of these values is called <code>Type</code>. This has the
			somewhat odd consequence that <code>Type</code> is also a value, and the
			datatype of that value is again <code>Type</code>. That's
			self-referential indeed, but it does still make sense.
			</p>

			<h3>Using Types</h3>
			<p>
			That's all nice and good, but why is it useful? We are yet to see an
			application of types. The main use case is to branch based on the type
			of a value, say, a parameter. Consider the following function:
			<tscript>
				function myPrint(s)
				{
					if Type(s) == String then print("\\"" + s + "\\"");
					else print(s);
				}
			</tscript>
			Just like the built-in function <code>print</code>, it prints out a
			value as a message in the message area. The only difference is that if
			the value is a string then the message is enclosed in double quotes.
			Give it a try!
			<tscript>
				print(42);           # prints 42
				myPrint(42);         # prints 42
				print("test");       # prints test
				myPrint("test");     # prints "test"
			</tscript>
			The trick here is that the constructor <code>Type(s)</code> constructs
			the type of its parameter as a value. If <code>s</code> is a string then
			<code>Type(s)</code> is the value <code>String</code> (of type
			<code>Type</code>), and hence the comparison yields true and the
			then-part is executed. Otherwise the comparison results in false and the
			else-part executes.
			</p>
			<p>
			A common use case is to check whether a parameter passed to a function
			is of the expected type. The following function creates an array by
			repeating the elements of a given array n times:
			<tscript>
				function repeat(array, n)
				{
					var long = [];
					for 0:n do long = Array.concat(long, array);
					return long;
				}
			</tscript>
			However, what happens if we accidentally mess up the order of the
			arguments and call the function as follows?
			<tscript>
				var a = repeat(5, [1,2,3]);
			</tscript>
			If you try it out, then you will encounter an error message inside of
			the function, telling us that the operands of operator <code>:</code>
			must be integers. We knew that already, right? The colon operator
			constructs a range, and a range requires integers. So at first glance,
			the function <code>repeat</code> seems to be buggy. However, that's not
			the case, we have just used it wrong.
			</p>
			<p>
			The problem here is that the error message does not point us at the real
			issue. Type checking to the rescue:
			<tscript>
				function repeat(array, n)
				{
					if Type(array) != Array then error("The first parameter of repeat must be an array.");
					if Type(n) != Integer then error("The second parameter of repeat must be an integer.");
					if n < 0 then error("The second parameter of repeat must be non-negative.");
					var long = [];
					for 0:n do long = Array.concat(long, array);
					return long;
				}
			</tscript>
			The build-in function <code>error</code> raises an error, just like the
			ones you surely encountered when following the tutorial and trying your
			luck on programming yourself. The difference is that now the error
			message is meaningful, we immediately notice that we messed up the order
			of the arguments, and hence proceed like this:
			<tscript>
				var a = repeat([1,2,3], 5);
				print(a);     # prints [1,2,3,1,2,3,1,2,3,1,2,3,1,2,3]
			</tscript>
			</p>

			<h2>Wrap-Up</h2>
			<p>
			We have learned that two concepts we used for long, namely functions and
			data types, are both values. These values have types by themselves,
			called <code>Function</code> and <code>Type</code>. Treating functions
			as values enables us to pass them into other functions, which adds a lot
			of flexibility (as we have seen for the example of sorting). The main
			use case for treating types as values is for type checking, usually for
			function parameters.
			</p>
			`,
		},
	],
};
