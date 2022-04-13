export const tutorial_recursion = {
	id: "recursion",
	title: "Recursion",
	sections: [
		{
			content: `
			<p>
			We know how to call functions, and we also know that from within the
			body of a function, we can call other function. However, what happens
			when a function calls itself? Is that even possible?
			</p>
			<p>
			It turns out that yes, it is of course possible. In programming, a
			function that calls itself is called a <i>recursive</i> function. The
			implications of doing so are all but obvious. Let's start with a
			simplistic example:
			<tscript>
			function f()
			{
				print("Hello World!");
				f();
			}
			</tscript>
			This function, when called, prints the familiar greeting "Hello World!".
			Then it calls itself. During that self-call, it again prints its
			greeting, and then it calls itself again. This goes on and on until we
			interrupt the program.
			</p>
			<p>
			What we have achieved is not very useful. The function keeps printing
			the same message over and over, and it never stops. We could have
			achieved the same effect with a loop:
			<tscript>
			function f()
			{
				while true do print("Hello World!");
			}
			</tscript>
			When thinking about it more carefully, this makes sense. A function that
			calls itself keeps executing the same commands, until it reaches the
			self-call. This is akin to running the commands in a loop.
			</p>
			<p>
			In order to achieve something useful with recursion we need to add two
			ingredients: variation of the repetition (as we did by introducing a
			loop counter into our loops), and a way to stop. Both can be achieved by
			adding a parameter to the function. Consider the following example:
			<tscript>
			function f(n)
			{
				if n > 0 then
				{
					print(n);
					f(n-1);
				}
			}
			f(5);
			</tscript>
			What happens when calling <code>f(5)</code>? You may be tempted to
			simply try it out, but hold back for a second. Can you figure it out
			without running the code? Give it a try!
			</p>
			<p>
			No matter how you found it out (hard thought or running the code), you
			should have arrived at the conclusion that the function prints the
			numbers 1 to 5 in descending order. In general, <code>f(n)</code>
			prints the numbers 1 to n in descending order. We could indeed achieve
			the same with a loop. Let's look at a minimal variation: we swap the
			order of the self-call and the print statement. What happens? Again,
			first try to figure it out yourself before running the code.
			<tscript>
			function f(n)
			{
				if n > 0 then
				{
					f(n-1);
					print(n);
				}
			}
			f(5);
			</tscript>
			Surprise: the behavior is quite similar, but this time the numbers are
			in ascending order! Let's shed some light on the process by using both
			print statements:
			<tscript>
			function f(n)
			{
				if n > 0 then
				{
					print(n);
					f(n-1);
					print(n);
				}
			}
			f(5);
			</tscript>
			Unsurprisingly, this time we get descending and ascending numbers.
			Let's look at the process step by step in order to understand what is
			going on.
			<ul>
				<li>In the first call, the parameter n has the value 5. This value
					is printed. Then the function is invoked again, this time
					recursively with parameter value 4.</li>
				<li>At this point, the function is "active" twice. What we mean is
					the following: the function was called with parameter n=5, and
					that call did not return yet. Also, it did not yet arrive at the
					second print statement. In the middle of its execution, it
					invoked itself with parameter value n=4. In that sense, two
					invocations are pending at the same time.</li>
				<li>Due to the second invocation, the function body starts executing
					again, but this time with a different parameter value. The value
					4 is printed as a message. Then the function invokes itself for
					a third time, with n=3.</li>
				<li>The same process happens two more times, with n=2 and n=1. After
					printing the message 1, the function invokes itself with n=0.
					At this point, a total of six invocations are active.</li>
				<li>However, this time the condition of the if-statement evaluates
					to <code>false</code> and the function returns without executing
					further print statements or self-invocations.</li>
				<li>The last invocation returns, so the instance with n=1 can
					continue running. It arrives at the second print statement and
					prints the message 1 a second time.</li>
				<li>Then also the invocation with n=1 is complete and it returns,
					which allows the instance with n=2 to continue. It prints the
					message 2, then it returns.</li>
				<li>The process repeats for each of the invocations that were put on
					hold earlier during the recursive invocations, until the very
					first instance prints the message 5 and finally leaves the
					function, returning to the call in the main program.</li>
			</ul>
			We can visualize the process as follows:
<pre>
f(5)
{                                  # function f(5) starts
   print(5);
   5 > 0 ==> f(4)
   {                               # function f(4) starts
      print(4);
      4 > 0 ==> f(3)
      {                            # function f(3) starts
         print(3);
         3 > 0 ==> f(2)
         {                         # function f(2) starts
            print(2);
            2 > 0 ==> f(1)
            {                      # function f(1) starts
               print(1);
               1 > 0 ==> f(0)
               {                   # function f(0) starts
                  0 <= 0 ==> return;
               }                   # function f(0) returns
               print(1);
            }                      # function f(1) returns
            print(2);
         }                         # function f(2) returns
         print(3);
      }                            # function f(3) returns
      print(4);
   }                               # function f(4) returns
   print(5);
}                                  # function f(5) returns
</pre>
			</p>

			<h2>Mimicking Loops</h2>
			<p>
			We can approach the similarity with a loop more formally. Think of the
			following type of loop, where <code>a:b</code> is a range:
			<tscript>
				for var i in a:b do
				{
					doSomething(i);
				}
			</tscript>
			We can turn it into a recursion as follows:
			<tscript>
				function recursion(i, b)
				{
					if i < b then
					{
						doSomething(i);
						recursion(i+1, b);
					}
				}
				recursion(a, b);
			</tscript>
			It is not hard to see that every loop can be turned into a recursion.
			The opposite is also true, but doing so can be tricky.
			</p>

			<div class = "tutorial-exercise">
			Write a recursive <code>function sumGauss(n)</code> that returns the sum
			of the values 1, 2, ..., n. (There is a closed-form solution for the
			problem, however, the goal of the task is to actually sum of the values).
			With a loop, the solution would be as follows:
			<tscript>
				function sumGauss(n)
				{
					var sum = 0;
					for var i in 1:n+1 do sum += i;
					return n;
				}
			</tscript>
			The goal is to achieve the same computation with a recursion. Do not
			use a loop at all. You can use the version with loop to verify that
			your function delivers the correct result.
			</div>
			`,
			correct: `
			function sumGauss(n)
			{
				if (n <= 0) then return 0;
				return n + sumGauss(n - 1);
			}
			`,
			tests: [
				{
					type: "js",
					code: `
						let program = parse(code).program;
						if (! program) return "Failed to parse the program code.";
						if (! isRecursive(program)) return "Please use recursion to solve the problem.";
						if (hasStructure(program, "loop;")) return "Do not use a loop in your program.";
					`,
				},
				{
					type: "call",
					code: "sumGauss(1);",
				},
				{
					type: "call",
					code: "sumGauss(2);",
				},
				{
					type: "call",
					code: "sumGauss(7);",
				},
				{
					type: "call",
					code: "sumGauss(101);",
				},
			],
		},
		{
			content: `
			<h2>Recursive Problem Solving</h2>
			<p>
			If recursion is no better or worse than using a loop, then why should we
			care? We already know loops, and they are easy enough to use.
			</p>
			<p>
			However, it turns out that in some situations, recursion is a much
			better match for solving a problem. It can be argued that these
			situations are rate compared with situations asking for a loop, but they
			are sufficiently frequent to be relevant. Therefore we should be well
			aware of the concept of recursion.
			</p>
			<p>
			Recursive problem solving generally works as follows. We have a problem
			of "size" n. Say, we want to sort an array with n items. Sure, the array
			type already has a built-in sort function, but for the sake of
			curiosity, let's try to solve the problem ourselves. Then, would it
			bring us closer to the solution if we already knew how to sort an array
			with at most n-1 items?
			</p>
			<p>
			The answer is a clear yes! There are many strategies to exploit the
			ability to sort smaller arrays. Here we will only use an extremely
			simple (and inefficient) one. To this end, we will find the largest item
			in the array, move it to the end, and then sort the remaining n-1 items.
			It is exactly this last step where the recursion comes into play.
			Recursive problem solving always consists of two parts: a reduction to a
			simper (smaller) problem instance, and a base case that is solved with
			elementary means. The base case is where the recursion stops.
			</p>
			<p>
			Let's make this more concrete. We write a
			<code>function sort(array, n)</code>
			which shall sort the first n items of the given array. Calling it with
			the size of the array as the second parameter sorts the whole array.
			That's our goal. Let's apply the above outlined methodology of recursive
			problem solving to achieve it.
			</p>
			<p>
			The first thing we need is a base case. For example, can we sort an
			array with two entries? Sure. If the first item is larger than the
			second item then we need to swap the items, otherwise the array is
			already sorted. That does the job, however, we can get away with
			something even simpler. What if we define the base case to be an array
			with either 0 or 1 elements? Well' an empty array is already sorted, and
			so is an array with a single element. That sounds like a good choice.
			In code, we do the following:
			<tscript>
				function sort(array, n)
				{
					if n <= 1 then
					{
						# base case: nothing to do, array is already sorted
					}
					else
					{
						# general case, to be discussed below
					}
				}
			</tscript>
			What's left is the general case. This is where we aim to apply the
			reduction to problem size n-1. As discussed above, we first need to
			find the largest item and swap it to the end. Then we sort the first
			n-1 items. The solution is straightforward:
			<tscript>
				function sort(array, n)
				{
					if n <= 1 then
					{
						# base case: nothing to do, array is already sorted
					}
					else
					{
						# find the position of the maximal entry
						var argmax = 0;
						for var i in 1:n do
						{
							if array[i] > array[argmax] then argmax = i;
						}

						# swap it with the last entry
						var temp = array[argmax];
						array[argmax] = array[n-1];
						array[n-1] = temp;

						# solve the simpler problem
						sort(array, n-1);
					}
				}
			</tscript>
			Let's try it out!
			<tscript>
				var a = [4,7,3,4,0,5];
				sort(a, a.size());
				print(a);
			</tscript>
			Indeed, we see the sorted output:
			<pre>[0,3,4,4,5,7]</pre>
			</p>

			<div class = "tutorial-exercise">
			Write a recursive <code>function contains(array, n, value)</code> that
			returns <code>true</code> if the value is contained in the first
			n items of the array, and <code>false</code> otherwise. Do not use a
			loop, but instead apply the recursive problem solving principle. What is
			the simplest base case you can come up with? How to reduce the case with
			items n to n-1 items?
			</div>
			`,
			correct: `
			function contains(array, n, value)
			{
				if n == 0 then return false;
				if array[n-1] == value then return true;
				return contains(array, n-1, value);
			}
			`,
			tests: [
				{
					type: "js",
					code: `
						let program = parse(code).program;
						if (! program) return "Failed to parse the program code.";
						if (! isRecursive(program)) return "Please use recursion to solve the problem.";
						if (hasStructure(program, "loop;")) return "Do not use a loop in your program.";
					`,
				},
				{
					type: "call",
					code: "contains([1,3,5,7,9], 5, 1);",
				},
				{
					type: "call",
					code: "contains([1,3,5,7,9], 5, 7);",
				},
				{
					type: "call",
					code: "contains([1,3,5,7,9], 5, 9);",
				},
				{
					type: "call",
					code: "contains([1,3,5,7,9], 5, 6);",
				},
			],
		},
		{
			content: `
			<h2>Processing Trees</h2>
			<p>
			The real power of recursion happens when there are multiple self-calls.
			Consider the following program, which draws a beautiful ruler on the
			canvas (give it a try):
			<tscript>
				function ruler(a, b, h, n)
				{
					if n == 0 then return;
					canvas.line(a, 100, a, 100-h);
					canvas.line(b, 100, b, 100-h);
					ruler(a, a/2+b/2, 0.8*h, n-1);
					ruler(a/2+b/2, b, 0.8*h, n-1);
				}
				canvas.line(100, 100, 612, 100);
				ruler(100, 612, 32, 7);
			</tscript>
			In this program, the recursive function calls itself <i>twice</i>. The
			initial call spawns one instance, which spawns two more, which cause 4
			more calls, which cause 8 more calls &mdash; and so on until the
			recursion arrives at the base case and stops. The base case occurs a
			total of 2<sup>7</sup> = 128 times. The same principle turns out to be
			tremendously useful for processing a data structure which is very
			widespread in computing: a tree.
			</p>

			<h3>Tree Data Structures</h3>
			<p>
			An illustrative example of a tree data structure is a family tree.
			Consider the British royal family, and more specifically, the
			<a target="_blank" href="https://en.wikipedia.org/wiki/Family_tree_of_the_British_royal_family#House_of_Windsor">house of Windsor</a>.
			The line starts with Queen Victoria (1819&ndash;1901). She had five
			children. They again had children, all the way down to Prince George of
			Cambridge. The <i>is-a-child-of</i> relation naturally yields a tree
			structure. A tree is a graph structure in which a root node (here
			Victoria) is related to zero or more other nodes (her children Victoria,
			Edward, Alice, Alfred and Helena). These nodes can again be considered
			root nodes of sub-trees, namely their direct and indirect descendants.
			This way, each node appears only once in the graph &mdash; otherwise it
			is still a graph, but not a tree.
			</p>
			<p>
			We will use a class to represent the tree. In fact, the class represents
			a single member of the family, and at the same time the complete
			sub-tree of descendants of that person. Each object (person) has only
			two attributes: a name, and a list of children. For simplicity, we make
			both attributes public. We may leave the list of children incomplete if
			we do not care, otherwise the tree would grow very large. The data
			structure representing (a part of) the house of Windsor, down to
			Elisabeth II, could look like this:
			<tscript>
				class FamilyMember
				{
				public:
					constructor(name, children = [])
					{
						this.name = name;
						this.children = children;
					}
					var name;
					var children;
				}

				var victoria = FamilyMember("Victoria", [
						FamilyMember("Victoria", [
							FamilyMember("Wilhelm II", []),
						]),
						FamilyMember("Edward VII", [
							FamilyMember("Albert Victor", []),
							FamilyMember("George V", [
								FamilyMember("Edward VIII", []),
								FamilyMember("George VI", [
									FamilyMember("Elisabeth II", []),
									FamilyMember("Margaret", []),
								]),
								FamilyMember("Mary", []),
								FamilyMember("Henry", []),
								FamilyMember("George", []),
								FamilyMember("John", []),
							]),
							FamilyMember("Louise", []),
							FamilyMember("Victoria", []),
							FamilyMember("Maud", []),
							FamilyMember("Alexander John", []),
						]),
						FamilyMember("Alice", [
							FamilyMember("Ernest Louis", []),
						]),
						FamilyMember("Alfred", [
							FamilyMember("Alfred", []),
							FamilyMember("Marie", []),
							FamilyMember("Victoria Melita", []),
							FamilyMember("Alexandra", []),
							FamilyMember("Beatrice", []),
						]),
						FamilyMember("Helena", []),
					]);
			</tscript>
			The lines are indented so as to highlight the tree structure, which
			grows from left-top to right-bottom in this case. Many types of
			hierarchically organized data forms tree structures, for example a file
			system, where a directory contains files and other directories, which
			can again contain more files and directories, and so on.
			</p>
			<p>
			Now consider a rather simple task: print all names in the family tree.
			Without recursion, this is a tricky task (although solvable). With
			recursion, it becomes nearly trivial.
			</p>
			<p>
			We apply the recursive problem solving strategy to the problem. Printing
			all names in the tree is broken down into sub-problems as follows. The
			base case will be a family member without children. Then the problem
			reduces to printing the name. For a person with children, the problem is
			decomposed into printing the name and processing all children,
			recursively. Hence, in this case, the number of recursive calls depends
			on the data, i.e., the number of children.
			</p>
			<p>
			In program code, the solution is surprisingly neat. It turns out that we
			do not even need a case distinction between base case and general case:
			<tscript>
				function printFamilyTree(person)
				{
					print(person.name);
					for var child in person.children do printFamilyTree(child);
				}
				printFamilyTree(victoria);
			</tscript>
			Could it be any simpler? The solution is powerful and elegant. Solving
			the same problem with a loop does not necessarily take a much longer
			program (it will be somewhat longer though), but it does require heavier
			machinery, namely maintaining a so-called stack. Furthermore, the
			recursive variant is easier to understand and maintain.
			</p>
			<p>
			Processing trees is where recursion shines, but it is not the only type
			of problem where recursion is preferred over a loop-based solution. In
			fact, once we have a solid grasp on recursion, iterating the nodes of a
			tree is nearly as simple as iterating the items of an array. For an
			array, we use a for-loop. For a tree structure, we use a recursive
			function. Aside from printing all names, one can think of many such
			functions, for example for finding a person by name, for counting all
			persons with a specific first name, and so on.
			</p>

			<h2>Wrap-up</h2>
			<p>
			The concept of recursion is related to a loop, in the sense that the
			same code can be executed multiple times. In most cases, loops are
			preferable, but sometimes recursion offers stunningly simple and
			expressive solutions for seemingly complicated problems. When writing a
			recursive function to solve a problem, we always implement a base case
			and the general case, which contains the recursive call for solving a
			smaller problem instance.
			</p>
			<p>
			One class of problems where recursion is generally preferred over a loop
			is iterating a tree data structure. In a sense, recursion does for a
			tree what a for-loop does for an array.
			</p>
			`,
		},
	],
};
