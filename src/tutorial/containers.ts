export const tutorial_containers = {
	id: "containers",
	title: "Containers",
	sections: [
		{
			content: `
			<p>
            Until now we have learnt to use variables to store data. In 
            practice we might encounter much more data than we could handle
            manually, though. Therefore, we use new data types, namely arrays
            and dictionaries. Instead of creating a new variable for every 
            data we need to store, we now create one variable as a container.
            Containers are able to store any number of values of any kind of 
            data types and give us the possibility to access, add and delete
            stored values. With containers we can create data structures as
            branched as we want, as every container can include further
            containers. 
            </p>
			`,
		},
		{
			content: `
            <h2>Arrays</h2>
            <p>
            You can imagine arrays as lists of data values. Every entry of
            these lists can be accessed by an index, as arrays are enumerated.
            The first index of an array is always at 0, therefore an array of
            size n has the indices 0 to n - 1. To create an array we use square 
            brackets and separate values with commas. 
            <tscript>
            var a1 = [1, 2, 3, 4];                      # array filled with numbers
            var a2 = ["s", "t", "r", "i", "n", "g"];    # array filled with strings
            var a3 = [1, print, "string", false];       # array filled with different data types
            var a4 = [1, [2, 3], 4];                    # array filled with numbers and another array
            </tscript>
            As already mentioned you are able to store any kind of data types you
            want and even create arrays with other arrays nested inside of them. 
            To access values from the array, you simply call the array by name and
            the index you'd like to get the value from (remember the indexing starts 
            with 0). You are even able to access sub-arrays if you hand over a 
            range of indices. If we remember the beforehand declared arrays, 
            accessing them looks like this:
            <tscript>
            print(a1[2]);           # prints 3
            print(a2[0:6]);         # prints [s,t,r,i,n,g]
            </tscript>
            If we access an array inside of an array, we can access its values just 
            as we access values from an isolated array:
            <tscript>
            print(a4[1][1]);         # prints 3
            </tscript>
            The a4[1] acts as an array on its own.
            </p>
            <p>
            In practice you very often want to run through every value of an array and 
            perform any action on that. To do so, we can use loops that run from the very
            first to the last element of the array. Therefore we need to know the size
            of the array. While you might know that i.e. a1 has a size of 4, not every
            array has its size set when declared. You might also want to create a 
            function which performs actions on arrays of different sizes. The 
            <i>Array.size()</i>-function returns the size of the current array. If 
            we want to iterate through an array, we mostly use a <i>for</i>-loop and
            set the loop counter to begin at 0 and end at <i>size()</i> - 1:
            <tscript>
            for var i in 0:a1.size() do {
                print(a1[i]);               # prints 1, 2, 3, 4
            }
            </tscript>
            Remember that the second value of a range is excluded.
            </p>
            <div class="tutorial-exercise">
			<p>
			Create a function <i>run</i> that takes an array as its input parameter arr. 
            Use a <i>for</i>-loop to print every value of the array from last to first. 
            Remember that ranges can only ascend. 
			</p>
			</div>
            `,
			correct: `
            function run(arr) {
                for var i in 0:arr.size() do {
                    print(arr[arr.size() - 1 - i]);
                }
            }
            `,
			tests: [
				{
					type: "js",
					code: `let program = parse(code).program;
                    if (! program) return "Failed to parse the program code.";
                    if (hasStructure(program, "{ call(print); call(print); }")) return "Use only a single print command!";
                    if (! hasStructure(program, "loop;")) return "Use a loop to solve the problem!";
                    if (! hasStructure(program, "loop { call(print); }")) return "Use a print statement inside of the loop body to solve the problem!";
                    if (isRecursive(program)) return "Please don't use recursion.";`,
				},
				{
					type: "code",
					code: "run([4, 2, 5, 6, 7, 2, 4, 6]);",
				},
				{
					type: "code",
					code: "run([]);",
				},
			],
		},
		{
			content: `
            <p>
            Another way to loop through an array is by iterating through every element
            of it. In that case our loop variable holds the value of the current element
            of the array:
            <tscript>
            var a = [1, 2, 3, 4];
            for var i in a do {
                print(i);               # prints 1, 2, 3, 4
            }
            </tscript>
            The array is copied at the beginning of the loop. Therefore, you are able to 
            mainpulate the array without changing the sequence of the loop.
            </p>
            <p>
            You now have learnt to create arrays with set content and access them. Often,
            we do not want to or are not even able to fill the array while declaring it, 
            but manipulate it at run time. There are different functions to do so. If you
            want to attach something to the array, you call the <i>push(element)</i>-method 
            and hand over the element you want to attach to the array. To specify a position
            where your element should be inserted, you have to call 
            <i>insert(position, element)</i> and hand over the index at which the element shall
            be inserted. This function inserts the current element at that index which pushes 
            every element from that index on one spot farther to the end of the array. You have 
            to hand over a valid index, though, otherwise you'll get an out-of-index-error. To
            remove elements, you can either call <i>pop()</i> to detach the last element of the
            array, which also returns it, or call <i>remove(position)</i> and hand over the index
            of the element to remove. The latter function does not return the element, though.
            To override a value at an existing index, you simply call the array at that position
            and assing another value to it. Here are some examples:
            <tscript>
            var a = [];         # current array: []
            a.push(1);          # current array: [1]
            a.insert(0,0);      # current array: [0, 1]
            a.insert(2, 2);     # out-of-index error - current aray: [0, 1]
            a.push(2);          # current array: [0, 1, 2]
            print(a.pop());     # current array: [0, 1]; prints 2
            print(a.remove(1)); # current array: [0]; prints null
            a[0] = 10;          # current array: [10]
            </tscript>
            </p>
            <div class="tutorial-exercise">
			<p>
			Create an empty array and fill it via loop with the <i>push()</i>-function with 
            numbers from 0 to 10. Print the array after every <i>push()</i>-call. Now use a 
            second loop to insert the same numbers from top to bottom at every second position
            of the array. Print the array at the end of every iteration.
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
                    if (hasStructure(program, "{ call(print); call(print); call(print);}")) return "You do not need to use more than two print commands!";
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
            <h2>Dictionaries</h2>
            <p>
            Another form of containers are dictionaries. Instead of using indices to 
            find the element we now use keys. Structurally you could imagine arrays
            being dictionaries with ascending integers starting by 0 as keys, their
            syntax is different, though. Instead of using square brackets, we use 
            curly brackets to define a dictionary:
            <tscript>
            var d = {};
            </tscript>
            Keys have to be strings and are unambiguous. We first hand over the key 
            and use a colon to separate key and value. Different entries are 
            separated by commas. The key does not have to be enclosed by quotation 
            marks. In practice dictionaries are very often nested inside of each other. 
            Here are a few examples of initializations of different dictionaries:
            <tscript>
            var d1 = { name: "Müller", address: "Viktoriastr. 14" };
            var d2 = { players: [ {name: "Tom", console: "PC"}, {name: "Tim", console: "PS"} ] };
            </tscript>
            You can access values by calling the dictionary by name and using square 
            brackets. If you call another container inside of the dictionary you can
            simply add another square bracket with a key or an index to call any value
            inside. We can access our example dictionaries like this:
            <tscript>
            print(d1["name"]);					# prints Müller
            print(d1["address"]);				# prints Viktoriastr. 14
            
            print(d2["players"]);				# prints [{name:Tom,console:PC},{name:Tim,console:PS}]
            print(d2["players"][0]);			# prints {name:Tom,console:PC}
            print(d2["players"][0]["console"]); # prints PC
            print(d2["players"][1]["name"]);	# prints Tim
            </tscript>
            If you want to test, if a specific key exists inside of the dictionary,
            you can call the <i>has(key)</i>-function and hand over the key in 
            question. The function will return a boolean. Similar to arrays the 
            <i>size()</i>-function returns the size of the dictionary. We cannot 
            iterate through an array via a loop counter, though, since dictionaries
            aren't enumerated. Therefore, we have to iterate through the elements
            directly. In the case of dictionaries we are able to decide if we want
            to iterate through the keys or the values of the dictionary:
            <tscript>
            for i in d1.keys() do {
                print(d1[i]);           # prints Müller, Viktoriastr. 14
            }

            for i in d1.values() do {
                print(i);               # prints Müller, Viktoriastr. 14
            }
            </tscript>
            </p>
            <p>
            Again, we might not know how to fill the dictionary at initialization and
            want to manipulate it dynamically. Since a dictionary isn't enumerated, we
            do not have to worry about getting out of bounds. To insert a value, simply
            call the dictionary by name, hand over a key in square brackets and assign a 
            value. If the key already exists, the associated value is changed. To remove
            a key and its value, you can call the <i>remove(key)</i>-function. The 
            <i>keys()</i>- and <i>values()</i>-functions give back the keys and values
            of the dictionary.
            </p>
            `,
		},
		{
			content: `
            <h2>Wrap-up</h2>
            <p>
            In practice containers are very commonly used with arrays being necessary (or 
            simplifying) in almost every application. Dictionaries are more common in 
            database structures. Containers give us the possibility to freely work with 
            data without worrying about how much data we actually need to handle. However, 
            even if we do not need to worry about saving data, the more data we work with, 
            the longer algorithms need to terminate. Therefore, to estimate the duration 
            of code blocks one works with runtimes depending on the size of used containers. 
            </p>
            `,
		},
	],
};
