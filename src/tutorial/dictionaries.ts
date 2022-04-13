export const tutorial_dictionaries = {
	id: "dictionaries",
	title: "Dictionaries",
	sections: [
		{
			content: `
			<p>
			Another form of container is the dictionary. Just like an array, it can
			hold any number of items. There is a single major difference: items are
			not indexed with numbers in a range from 0 to the array size, but rather
			with strings. This seemingly small difference has far-reaching
			consequences, and that's why arrays and dictionaries are quite
			different.
			</p>

			<h2>Creating Dictionaries</h2>
			<p>
			Let's start by looking at an example where it makes sense to "index"
			data with strings. Classic examples are a phone book, or more generally,
			an address book. Let's start with the simplest case: phone numbers only.
			We way wish to represent the following data:
			<table class="nicetable">
				<tr><th>Name</th><th>Phone Number</th></tr>
				<tr><td>Alice</td><td>1234567</td></tr>
				<tr><td>Bob</td><td>55667788</td></tr>
				<tr><td>Charlie</td><td>9876543</td></tr>
			</table>
			How to do that? We could use two arrays:
			<tscript>
				var names = ["Alice", "Bob", "Charlie"];
				var numbers = [1234567, 55667788, 9876543];
			</tscript>
			That works, but it is far from ideal, for various reasons:
			<ul>
				<li>There is no formal mechanism in the language which tells us that
					the two arrays belong together. The concept is not necessarily
					readable for a new programmer.</li>
				<li>We need to take care to keep the arrays consistent. For example,
					when deleting a name, we also need to delete the corresponding
					number &mdash; otherwise we will be in deep trouble.</li>
			</ul>
			It would be much nicer to have the corresponding information "name" and
			"phone number" bound together. In this simple case, that goal can be
			achieved by treating names as indices and phone numbers as values of a
			dictionary:
			<tscript>
				var phonebook = {"Alice": 1234567, "Bob": 55667788, "Charlie": 9876543};
			</tscript>
			This is roughly analogous to an array definition. Let's highlight
			similarities and differences:
			<ul>
				<li>A dictionary is enclosed in curly braces, while an array is
					enclosed in square brackets.</li>
				<li>In both bases, items are separated with commas.</li>
				<li>For dictionaries, items are always specified as pairs. We often
					call them key-value-pairs. The key (or index) is a string,
					followed by a colon, followed by an arbitrary value. There is
					no restriction for dictionaries to contain only integers as
					values, as in the example above. They can hold any type of data,
					including arrays and dictionaries.</li>
				<li>Just like integer indices into an array, the keys of a
					dictionary must be unambiguous. However, since keys are not
					implicitly enumerated, this is up to the programmer.</li>
				<li>In an array, when inserting an item in the front, all indices
					change. In a dictionary nothing like that can happen, since the
					keys are explicit.</li>
			</ul>
			Although keys are strings, we can write them as identifiers (without
			double quotes) as long as there is no ambiguity:
			<tscript>
				var phonebook = {Alice: 1234567, Bob: 55667788, Charlie: 9876543};
			</tscript>
			Items are accessed the same way as with arrays, but using strings as
			keys:
			<tscript>
				print(phonebook["Alice"]);     # prints 1234567
				phonebook["Bob"] = 88776655;   # store Bob's new number
			</tscript>
			</p>
			<p>
			Containers (arrays and dictionaries) can be nested. This is a powerful
			concept for defining nearly arbitrarily complex data structures. Let's
			look at an example:
			<tscript>
				var data = {
						players: [
							{name: "Tom", console: "PC"},
							{name: "Tim", console: "PS"}
						]
					};
				print(data["players"][0]["console"]);   # prints PC
			</tscript>
			</p>
			Notice how three item access operators are chained in the print
			statement to access the value <code>"PC"</code>.
			</p>

			<h2>Iterating over Dictionaries</h2>
			<p>
			When trying to output the phone book, we encounter the major consequence
			of keys being arbitrary strings, in contrast to a range of indices:
			values in a dictionary are not ordered. As a programmer, we should think
			of dictionaries as "associative" containers, not as "sequence"
			containers. In arrays, the order (or sequence) of elements often has a
			meaning. For arrays, it makes sense to sort its items by some rule, say,
			to sort numbers in ascending order. For dictionaries, such an operation
			does not make any sense. That's not because strings cannot be ordered
			(they can, using the lexicographic order by default), but rather because
			that's not how dictionaries work.
			</p>
			<p>
			As a consequence, when iterating over a dictionary, we should not assume
			that the items appear in a specific order. In TScript, items usually
			appear in the same order in which they were added to the dictionary.
			That's generally different from the lexicographic order of the keys.
			Also, we cannot iterate over a dictionary using a range. That's because
			the concept of "item number 5" does not exist in a dictionary. Luckily,
			the dictionary is able to provide all of its items as an array, and we
			already know how to iterate over an array:
			<tscript>
				for var key in phonebook.keys() do
				{
					var value = phonebook[key];
					print("name: " + key + " - phone number: " + value);
				}
			</tscript>
			Note how we use a for-loop over the array <code>phonebook.keys()</code>
			to obtain the keys (names) one by one, and how we can use the square
			bracket (item access) operator inside of the loop to access the
			corresponding values (phone numbers).
			</p>

			<h2>Manipulating Dictionaries</h2>
			<p>
			Just like arrays, dictionaries support operations for inserting and
			deleting entries, or more specifically, key-value-pairs. Insertion
			works exactly the same as overwriting a key:
			<tscript>
				phonebook["Doris"] = 24680;
			</tscript>
			If Doris is already known then her number of overwritten, otherwise a
			new entry is added. We can think of this operation as the instruction to
			the dictionary to associate the value <code>24680</code> with the key
			<code>"Doris"</code>. Deletion works analogous to arrays:
			<tscript>
				phonebook.remove("Doris");
			</tscript>
			</p>

			<h2>Further Dictionary Operations</h2>
			<p>
			Just like an array, we can ask a dictionary for its size. That's
			generally not very useful, since its keys are not defined by a range. In
			contrast, a very useful operation is to ask the dictionary whether it
			contains a given key or not:
			<tscript>
				var name = "Eric";
				if phonebook.has(name)
				then print(name + "'s phone number is " + phonebook[name]);
				else print("Sorry, I don't know " + name + "'s number.");
			</tscript>
			</p>
			<p>
			There is a <code>Dictionary.merge</code> function, which works similar
			to <code>Array.concat</code>. If a key is present in both dictionaries
			to be merged, then the second value overwrites the first one.
			</p>
			<p>
			We have seen that a dictionary can provide all of its keys as an array
			with the keys function:
			<tscript>
				print(phonebook.keys());   # prints [Alice,Bob,Charlie]
			</tscript>
			It can equally well return its values as an array:
			<tscript>
				print(phonebook.values());   # prints [1234567,55667788,9876543]
			</tscript>
			This can simpliy loop iterating over the values in cases where the keys
			are not needed.
			</p>
			<p>
			<div class="tutorial-exercise">
			<p>
			Write a <code>function histogram(array)</code>, which takes an array
			of strings as input and returns a histogram: for each string it counts
			the number of occurrences. It returns the histogram as a dictionary
			with the string as the key and the frequency as the value. For example,
			calling the function with the array <code>["foo", "bar", "foo"]</code>
			shall yield the return value <code>{"foo": 2, "bar": 1}</code>.
			</p>
			<p>
			Solution strategy: Start with an empty dictionary. Loop over the array.
			Inside of the loop, check whether the current string is already known as
			a key in the dictionary. If yes, then increment its count by one. If no,
			then add the key with a count of one. Finally, return the dictionary.
			</p>
			</div>
			`,
			correct: `
			function histogram(array)
			{
				var d = {};
				for var s in array do
				{
					if d.has(s)
					then d[s] += 1;
					else d[s] = 1;
				}
				return d;
			}
			`,
			tests: [
				{
					type: "js",
					code: `let program = parse(code).program;
					if (! program) return "Failed to parse the program code.";
					if (isRecursive(program)) return "Please don't use recursion.";`,
				},
				{
					type: "call",
					code: `histogram(["foo", "bar", "foo"]);`,
				},
				{
					type: "call",
					code: `histogram(["foo", "bar", "foo", "foo", "blabla", "test", "test"]);`,
				},
			],
		},
		{
			content: `
			<h2>Wrap-up</h2>
			<p>
			Dictionaries, like arrays, can reference as many values as necessary.
			They use strings as keys, and their items are not enumerated or ordered.
			We can think of them as an association of keys with values.
			</p>
			`,
		},
	],
};
