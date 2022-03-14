export const tutorial_arrays = {
	id: "arrays",
	title: "Arrays",
	sections: [
		{
			content: `
			<p>
			Say, we want to write an application for managing data. We don't
			necessarily talk about internet-scale data here &mdash; just any
			scalable task for which the amount of data is not fixed a priori, so the
			size of our data may change over time. Let's pick a simple example: a
			shopping list. The list shall contain any number of items, which will
			simply be strings for now. We need a list of scalable size containing
			strings, so that we can add any number of items at need.
			</p>
			<p>
			We have learned that values like strings can be stored in variables.
			Hence, we could start out like this:
			<tscript>
				var item1 = "milk";
				var item2 = "bread";
				var item3 = "butter";
				var item4 = "chocolate";
				var item5 = "juice";
				# ...
			</tscript>
			The problem with this approach is that whenever we want to add a new
			item, we need to change the program. We could have equally well used a
			spreadsheet for storing the data, in contrast to writing a program.
			What we aim for is that the program is written once, and
			<i>at runtime</i> we are able to add any number of values. Basically,
			we don't want to create a specific spreadsheet, but rather a program
			that can work with any spreadsheet. With out current approach, that
			would entail defining a very large number of variables:
			<tscript>
				# ...
				var item997;
				var item998;
				var item999
				var item1000;
			</tscript>
			Most of them would be empty (e.g., <code>null</code>), since luckily,
			shopping lists tend to much shorter than 1000 entries. On the other
			hand, if we ever need a longer shopping list then we are out of luck.
			And we did not even start to think about tasks like finding an empty
			variable to store the next item, displaying the list, and so on.
			</p>
			<p>
			This problem obviously asks for a different approach. Instead of
			defining a large number of variables, one for each string, it would be
			much nicer to define a single variable for the whole list. That variable
			would need the ability to store many strings, in fact an arbitrary
			number of them. That's exactly what a <i>container</i> does. In TScript,
			there are two types of containers: arrays and dictionaries.
			</p>

			<h2>Storing Multiple Values</h2>
			<p>
			You can imagine an array as a list of data values. The list can have any
			length: it can be empty (story no value), a single value, ten or a
			million values. To create an array we use square brackets and separate
			values with commas:
			<tscript>
				var a1 = [2, 3, 5, 7, 11, 13];          # array of numbers
				var a2 = ["h", "e", "l", "l", "o"];     # array of strings
				var a3 = [1, print, "string", false];   # array containing mixed data
				var a4 = [1, [2, 3], 4];                # nested arrays
				var a5 = [];                            # empty array
			</tscript>
			The values stored in the array can be anything, including other arrays.
			<p>
			</p>
			Every entry of the list can be accessed by its position, or index, as
			storage positions in the array are enumerated. The first index of an
			array is always at 0, therefore an array of size n has the indices 0 to
			n-1. This is exactly the range <code>0:n</code>, and that's no
			coincidence. To access values from the array, we simply call the array
			by name and the index of the storage location we'd like to get or set
			the value from. We are even able to access sub-arrays of consecutive
			storage locations by specifying a range of indices. Accessing entries
			of the above arrays works as follows:
			<tscript>
				print(a1[2]);     # prints 5
				print(a2[1:3]);   # prints [e,l]
				a3[3] = true;     # changes a3 to [1, print, "string", true]
			</tscript>
			If we access an array inside of an array, we can access its items just 
			as we access values from a standalone array:
			<tscript>
				print(a4[1][0]);   # prints 2
			</tscript>
			Let's look at the last example more closely. The following happens:
			<ol>
			<li>The variable name <code>a4</code> is encountered. It is found to
				contain an array as a value. The array holds three values: the
				integer 1, another array, and the integer 4.</ul>
			<li>The item access operator <code>[1]</code> is found. It tells TScript
				that we refer to item number 1. Since we start counting from 0,
				that's the second item: the array <code>[2, 3]</code>.
			<li>The second item access operator <code>[0]</code> tells TScript that
				we refer to item number 0 of the latter array. That's the integer 2.
			<li>The integer 2 is passed to the <code>print</code> function, which
				outputs it as a message.</li>
			</ol>
			Accessing an invalid index results in an error message.
			</p>
			<p>
			With arrays in place, the data management of our shopping list simplifies
			considerably.
			</p>
			<div class="tutorial-exercise">
			Create a variable <code>shoppinglist</code> containing an array of the
			items <i>milk</i>, <i>bread</i>, <i>butter</i>, <i>chocolate</i>, and
			<i>juice</i>.
			</div>
			`,
			correct: `
				var shoppinglist = ["milk", "bread", "butter", "chocolate", "juice"];
			`,
			tests: [
				{
					type: "code",
					code: `print(shoppinglist);`,
				},
			],
		},
		{
			content: `
			In a realistic application, the list will initially be an empty array.
			Now we can think about operations like adding new items, searching for
			items, deleting items, and printing out the whole list.
			</p>

			<h3>Loops over Arrays</h3>
			<p>
			In many tasks, we need to do something with every item in the array. For
			our shopping list, we want to display the whole list. For simplicity, we
			will print out each item as a message. This is a repetitive operation,
			so we will use a loop. How often should the loop body run? To answer
			that question, we need to know the number of items in the array. It can
			be obtained with <code>shoppinglist.size()</code>. Then, looping over
			the list and printing out all items works as follows:
			<tscript>
				for var i in 0:shoppinglist.size() do
				{
					print(shoppinglist[i]);
				}
			</tscript>
			Note how we created a range dynamically at runtime from the array size.
			If should be said that there is a simpler way to output the array:
			<tscript>
				print(shoppinglist);
			</tscript>
			Give it a try!
			The <code>print</code> function has no problem with outputting an array
			as a whole. However, the output is much less readable, in particular if
			the list grows large. Furthermore, imagine drawing the items onto a
			beautifully designed canvas interface - then we need a loop in any case.
			</p>
			<p>
			Say, we just ran out of butter. However, we are unsure &mdash; is butter
			already on the list or not? Since we have only five items right now,
			that's easy enough to decide manually. However, if the list gets long
			then we should better automate the task.
			</p>
			<p>
			So consider the task of checking whether an item is already on the list
			or not. Let's write a function for the job. For the case that there is
			more than one list in our program (groceries, christmas presents, ...),
			we will provide the array and the item we are looking for as parameters:
			<code>function findItem(list, item)</code>. The function shall return
			the index at which the item was found, or <code>null</code> if it is not
			found in the array. The value <code>null</code> then means: the item is
			found at "no index".
			</p>
			<div class="tutorial-exercise">
			<p>
			Implement the above described function <code>findItem</code>. The main
			tool is a loop over all items of the list. Within the loop, the current
			item must be compared with the query item. If they are equal, then the
			current index is returned. If the loop exists normally, then the item
			was not found. In this case the function returns <code>null</code>.
			</p>
			<p>
			Test the function with the above shopping list, by printing its return
			value for various test cases. For example,
			<code>findItem(shoppinglist, "butter")</code> should return 2, while
			<code>findItem(shoppinglist, "cookies")</code> should return
			<code>null</code>, since cookies are not on the list.
			</p>
			</div>
			`,
			correct: `
			function findItem(list, item)
			{
				for var i in 0:list.size() do
				{
					if list[i] == item then return i;
				}
				return null;
			}
			`,
			tests: [
				{
					type: "call",
					code: `findItem(["coffee", "tea"], "coffee");`,
				},
				{
					type: "call",
					code: `findItem(["coffee", "tea"], "tea");`,
				},
				{
					type: "call",
					code: `findItem(["coffee", "tea"], "water");`,
				},
			],
		},
		{
			content: `
			<p>
			In many cases, we do not need the index, but only the items in the array,
			one after the other. For example, that's the case when printing the list.
			With a for-loop, that's an extremely simple task, since arrays and
			for-loops are best friends. Instead of iterating over the range of
			indices, the loop can iterate directly over the array. This means that
			the loop counter is no longer an index, but rather an array element.
			The following loop also prints the shopping list:
			<tscript>
				for var item in shoppinglist do
				{
					print(item);
				}
			</tscript>
			Here is the first version once again for comparison:
			<tscript>
				for var i in 0:shoppinglist.size() do
				{
					print(shoppinglist[i]);
				}
			</tscript>
			Let's discuss the differences in detail:
			<ul>
				<li>The names of the loop counters are different (<code>item</code>
					versus <code>i</code>). This is just a question of style. It is
					of no significance to the computer.</li>
				<li>The new version loops over the array, the old version over a
					range, which happens to be constructed from the array size,
					so that both loops perform the same number of iterations.</li>
				<li>In the new version, the loop variable holds items, while it
					holds indices in the old version. This is why an item is very
					easily accessed as <code>item</code> in the new version, and
					a bit more cumbersome as <code>shoppinglist[i]</code> in the
					old version.</li>
			</ul>
			Like a range contains numbers, an array contains items. The for-loop can
			iterate over both types of objects. In each iteration, the loop counter
			takes on a value from the range or array, and in the next iteration the
			next value, and so on, until reaching the end. Indeed, for the purpose of
			looping, a range like <code>5:10</code> and the corresponding array
			<code>[5,6,7,8,9]</code> of indices are equivalent.
			</p>

			<h3>Manipulating Arrays</h3>
			<p>
			We know how to create an array with defined content and access its
			items. However, more often than not, we need the ability to change an
			existing array at runtime. For example, we may want to add a new item to
			our shopping list and delete another one. These manipulations are
			performed by various functions.
			</p>
			<p>
			A quite common case is to add elements one by one to an array. Then the
			<code>push</code>-method is a suitable solution. It appends a given
			value to the array it is called upon. Example:
			<tscript>
				shoppinglist.push("cookies");
			</tscript>
			Reverse, the <code>pop</code>-method removes the last item and returns
			its value:
			<tscript>
				var removedItem = shoppinglist.pop();
			</tscript>
			Now the cookies have disappeared from the list (sorry, no free cookies
			in this tutorial), and the variable <code>removedItem</code> contains
			the string <code>"cookies"</code> as its value.
			</p>
			<p>
			Sometimes we need to insert or remove an element at a specific position
			other than then end. This is achieved with <code>insert</code> and
			<code>remove</code> instead of <code>push</code> and <code>pop</code>.
			In addition to the value, they allow to specify a position (index) where
			the insertion or removal is supposed to happen. In contrast to
			<code>pop</code>, <code>remove</code> does not return the element.
			Let's look at some examples:
			<tscript>
				var a = [];           # current array: []
				a.push("a");          # current array: ["a"]
				a.insert(0, true);    # current array: [true, "a"]
				a.insert(2, false);   # current array: [true, "a", false]
				a.push(7);            # current array: [true, "a", false, 7]
				print(a.pop());       # current array: [true, "a", false]; prints 7
				a.remove(1);          # current array: [true, false]
				a[0] = 10;            # current array: [10, false]
			</tscript>
			</p>
			<div class="tutorial-exercise">
			<p>
			Create an empty array and fill it in a loop using <code>push</code>
			with the numbers from 0 to 10 (including 0 and 10). Print the array
			after each insertion.
			</p>
			</div>
			`,
			correct: `
			var a = [];

			for var i in 0:11 do {
				a.push(i);
				print(a);
			}
			`,
			tests: [
				{
					type: "js",
					code: `let program = parse(code).program;
					if (! program) return "Failed to parse the program code.";
					if (hasStructure(program, "{ call(print); call(print); }")) return "You do not need to use more than one print command.";
					if (isRecursive(program)) return "Please don't use recursion.";`,
				},
				{
					type: "code",
					code: "",
				},
			],
		},
		{
			content: `
			<div class="tutorial-exercise">
			<p>
			Create an empty array and fill it with a loop with <code>push</code>
			with the number from 0 to 10 (including 0 and 10). Print the array after
			each insertion. This is the same as before.
			</p>
			<p>
			Now let's make things a bit more tricky. Use a second loop to insert the
			same numbers from top to bottom at every second position of the array.
			Print the array after each insertion. The final array shall look like
			this:
			<code>[0,10,1,9,2,8,3,7,4,6,5,5,6,4,7,3,8,2,9,1,10,0]</code>.
			</p>
			</div>
			`,
			correct: `
			var a = [];

			for var i in 0:11 do {
				a.push(i);
				print(a);
			}

			for var i in 0:a.size() do {
				a.insert(2*i+1, 10-i);
				print(a);
			}
			`,
			tests: [
				{
					type: "js",
					code: `let program = parse(code).program;
					if (! program) return "Failed to parse the program code.";
					if (hasStructure(program, "{ call(print); call(print); call(print);}")) return "You do not need to use more than two print commands.";
					if (isRecursive(program)) return "Please don't use recursion.";`,
				},
				{
					type: "code",
					code: "",
				},
			],
		},
		{
			content: `
			<p>
			Let's apply the newly gained knowledge to our shopping list. We would
			like to implement two more functions: one for adding an item while
			avoiding a duplicate, and one for removing a given item, specified by
			name. Using the above function <code>findItem</code>, that's really
			easy:
			<tscript>
			function addItem(list, item)
			{
				var index = findItem(list, item);
				if index == null then list.push(item);
			}

			function removeItem(list, item)
			{
				var index = findItem(list, item);
				if index != null then list.remove(index);
			}
			</tscript>
			This is also a good example of the proper use of functions. The shared
			functionality of locating an item by name is provided by the function
			<code>findItem</code>, which is then used multiple times in the program.
			</p>
			<p>
			Let's try it out:
			<tscript>
			function printList(list)
			{
				for var item in list do print(item);
			}

			function findItem(list, item)
			{
				for var i in 0:list.size() do
				{
					if list[i] == item then return i;
				}
				return null;
			}

			function addItem(list, item)
			{
				var index = findItem(list, item);
				if index == null then list.push(item);
			}

			function removeItem(list, item)
			{
				var index = findItem(list, item);
				if index != null then list.remove(index);
			}

			var shoppinglist = [];
			addItem(shoppinglist, "milk");
			addItem(shoppinglist, "bread");
			addItem(shoppinglist, "butter");
			addItem(shoppinglist, "chocolate");
			addItem(shoppinglist, "juice");
			printList(shoppinglist);
			addItem(shoppinglist, "butter");    # duplicate!
			printList(shoppinglist);            # same as before
			removeItem(shoppinglist, "eggs");   # not found, no effect
			printList(shoppinglist);            # still the same
			</tscript>
			This is not (yet) a full-blown shopping list with graphical user
			interface, but it is a good start. Feel free to replace the
			<code>printList</code> function with a version that draws the items onto
			the canvas. You may prepare controls for adding and removing items,
			although right now we do not yet have the tools to make them
			operational.
			</p>

			<h2>Further Array Operations</h2>
			<p>
			Arrays provide two further notable operations. The first one is the sort
			function, which sorts the items in ascending order:
			<tscript>
				var a = [5, 3, 4, 2, 3];
				a.sort();
				print(a);   # prints [2,3,3,4,5]
			</tscript>
			The second one is the function <code>Array.concat</code>, which
			concatenates two arrays (as sequences) and returns a new sequence:
			<tscript>
				var a = [1,2];
				var b = [3,4,5];
				var c = Array.concat(a, b);
				print(c);   # prints [1,2,3,4,5]
			</tscript>
			</p>

			<h2>Wrap-up</h2>
			<p>
			Arrays are containers: they are values which can reference any number of
			other values. In effect, this means that a variable which references a
			single value, if that value is an array, can implicitly reference any
			number of values. This gives us the power to write programs that work
			with any amount of data, always with the same code. We no longer need to
			worry about how much data we may need to handle. Of course, handling
			more data needs more time, but still the same code works no matter how
			much data we have.
			</p>
			<p>
			Arrays are extremely common in programming. They are involved in the
			majority of cases where data is involved. Important operations on arrays
			are insertion (in particular at the end), removal, reading and
			overwriting values, and last but not least iterating over all items with
			a for-loop.
			</p>
			`,
		},
	],
};
