export const tutorial_dowhile = {
	id: "dowhile",
	title: "Loops with Conditions",
	sections: [
		{
			content: `
			<p>
			A for-loop executes a piece of code multiple times, for a pre-defined
			number of iterations. However, what if we don't know beforehand how many
			iterations we need? Consider the problem of printing out the first 100
			prime numbers: 2, 3, 5, 7, 11, 13, 17, 19, ...
			</p>
			<p>
			How do we do that? We may loop over all numbers starting at 2. For each
			number we check whether it is prime or not. If it is prime then we print
			it and increment a counter. For the sake of simplicity, let's assume that
			we have a check for a number being prime or not readily at our disposal.
			When the counter reaches 100 then we stop. However, how many loop
			iterations do we need?
			</p>
			<p>
			We can pick a "large enough" number:
			<tscript>
			var counter = 0;
			for var n in 2:1000000 do
			{
				if isPrime(n) and counter < 100 then
				{
					print(n);
					counter += 1;
				}
			}
			</tscript>
			(The code won't run, since the imagined
			<code>isPrime</code> check does not exist.)
			</p>
			<p>
			Looping until <i>n = 1000000</i> is surely enough for the task. However,
			can we get away with 10000? Maybe 1000? 500? Even less? What if the
			number of primes to output is flexible? Can we come up with a good value
			that just works, without earning a diploma in number theory first?
			</p>
			<p>
			Looping for too long is wasteful. On the other hand, in general for a
			more demanding task it may be hard enough to come up with any number of
			iterations that's surely large enough. Quite obviously, this task needs a
			different approach: we would like to run the loop until a condition is
			met. In this case, the loop shall stop when the counter reaches 100, no
			matter how many iterations it takes.
			</p>
			<h2>While-Loops</h2>
			<p>
			TScript offers two types of loops of this kind: The do-while-loop and the
			while-do-loop. We will call them while-loops when the difference does not
			matter. Both of these loops run <i>while</i> a condition is fulfilled.
			They make solving our problem quite straightforward:
			<tscript>
			var counter = 0, n = 2;
			while counter < 100 do
			{
				if isPrime(n) then
				{
					print(n);
					counter += 1;
				}
				n += 1;
			}
			</tscript>
			While-loops do not use loop counters, since there is no range involved.
			This brings the minor downside that we need to maintain and increment
			<i>n</i> ourselves. However, aside from that, the loop is greatly
			improved, since it runs exactly as often as it needs to. The need to
			estimate a suitable number of iterations beforehand is gone.
			</p>
			<h2>Pre- and Post-Checked Loops</h2>
			<p>
			The above loop is a while-do-loop, simply because the keyword
			<code>while</code> precedes the keyword
			<code>do</code>. We can turn the loop around:
			<tscript>
			var counter = 0, n = 2;
			do
			{
				if isPrime(n) then
				{
					print(n);
					counter += 1;
				}
				n += 1;
			}
			while counter < 100;
			</tscript>
			This is a do-while-loop. In this case, both of them do the job just fine.
			The only difference between the two loops is that the while-do-loop
			checks the condition <i>before</i> it executes the loop body, while the
			do-while-loop checks the condition <i>after</i> it executes the loop
			body. This is intuitive, since in the first case the condition is denoted
			before the loop body, and in the second case it appears after the loop
			body. Therefore, the loops are known as <i>pre-checked</i> and
			<i>post-checked</i> loops.
			</p>
			<p>
			The only difference between the two loop types is that a post-checked
			loop executes the loop body at least once, while a pre-checked loop has
			he ability to skip the loop body entirely if the condition is false
			already initially. What sounds like nit-picking at first is a quite
			common requirement in practice, where pre-checked loops are much more
			common than their post-checked counterparts.
			</p>
			<div class="tutorial-exercise">
			<p>
			Write a while-do-loop yourself. The loop shall output all square numbers
			of at most three digits (starting at 1), i.e., all square numbers smaller
			than 1000. Use only a single print statement inside of the loop.
			</p>
			</div>
			`,
			correct: `
				var n = 1;
				while (n^2 < 1000) do {
					print(n^2);
					n += 1;
				}
				`,
			tests: [
				{
					type: "code",
					code: "print(i);",
				},
				{
					type: "js",
					code: `
						let program = parse(code).program;
						if (! program) return "Failed to parse the program code.";
						if (hasStructure(program, "{ call(print); call(print); }")) return "Use only a single print command!";
						if (! hasStructure(program, "loop;")) return "Use a loop to solve the problem!";
						if (! hasStructure(program, "'while-do-loop';")) return "Use a do while-loop to solve the problem!";
						if (! hasStructure(program, "loop { call(print); }")) return "Use a print statement inside of the loop body to solve the problem!";
						if (isRecursive(program)) return "Please don't use recursion.";
						`,
				},
			],
		},
		{
			content: `
			<h2>Break and continue</h2>
			<p>
			While-loops have greatly extended our flexibility of stopping a loop at
			need. However, in some cases we need even more flexibility: we may wish
			to stop the loop when we are in the middle of the loop body.
			Conceptually, such a situation may look as follows:
			<tscript>
			var n = 0;
			while n < 100 do
			{
				# several
				# commands
				# here ...
				if (n^2+1) % 17 == 5 then
				{
					break;   # stop the loop immediately
				}
				# ... several
				# commands
				# here
				n += 1;
			}
			</tscript>
			The <code>break</code> command stops the loop immediately.
			It does not even wait for the current loop iteration to finish, but
			instead directly jumps to the next instruction after the loop. This
			allows us to write something that looks suspiciously similar to a great
			danger, namely an infinite loop that never stops:
			<tscript do-not-run>
			var n = 0;
			while true do
			{
				# several
				# commands
				# here ...
				if (n^2+1) % 17 == 5 then
				{
					break;   # stop the loop immediately
				}
				# ... several
				# commands
				# here
				n += 1;
			}
			</tscript>
			The construction <code>while true do</code> taken by itself
			is an infinite loop, since the condition is fixed to being fulfilled.
			After all, it is not even a proper condition, but a hard-coded outcome
			thereof. We could equally well write
			<code>while 0 == 0 do</code>. This loop would be a clear
			bug in the program, since it never completes. Unless... yes, unless a
			<code>break</code> statement comes to the rescue.
			</p>
			<p>
			A related control-flow statement is the keyword
			<code>continue</code>. Like <code>break</code>
			it leaves the loop body immediately. However, it does not leave the loop,
			but instead it jumps straight to the condition, and in case that the
			condition holds, to the next loop iteration. In effect, it allows us to
			<i>skip</i> the remainder of the loop body. To see both keywords in
			effect, we can rewrite the prime number example as follows:
			<tscript do-not-run>
			var counter = 0, n = 2;
			while true do
			{
				if not isPrime(n) then continue;
				print(n);
				counter += 1;
				if counter == 100 then break;
			}
			</tscript>
			</p>
			<div class="tutorial-exercise">
			Write a (conceptually) infinite loop containing a break statement.
			Inside of its loop body, it shall use <code>prompt</code> to
			obtain a value from the user. If the user cancels the dialog (the value
			is <code>null</code>) then it should ask again, until a
			string is provided. This string shall be printed and the loop shall stop.
			</div>
			`,
			correct: `
				while true do
				{
					var v = prompt("Please enter something!");
					if v == null then continue;
					print(v);
					break;
				}
			`,
			tests: [
				{
					type: "code",
					code: "",
					input: ["Hello"],
				},
				{
					type: "code",
					code: "",
					input: [null, "World"],
				},
				{
					type: "code",
					code: "",
					input: [null, null, null, null, null, "Test"],
				},
				{
					type: "js",
					code: `let program = parse(code).program;
					if (! program) return "Failed to parse the program code.";
					if (! hasStructure(program, "loop;")) return "Use a loop to solve the problem!";
					if (!hasStructure(program, "loop { condition; }")) return "There needs to be a condition to break the loop at the right time!";
					if (isRecursive(program)) return "Please don't use recursion.";`,
				},
			],
		},
		{
			content: `
			<p>
			<code>break</code> and <code>continue</code>
			also work with for-loops. They behave the exact same way. In particular,
			continuing a for-loop means to start the next loop iteration, and that
			involved incrementing the loop counter. Note that executing
			<code>continue</code> in the last iteration of a for-loop is
			equivalent to executing <code>break</code>, since there is
			not next iteration. The same holds for a while-loop when the condition is
			no longer fulfilled.
			</p>

			<h2>Equivalence of loops</h2>
			<p>
			In general it is possible to write every <i>for</i>-loop as a
			<i>while</i>-loop. Vice versa only <i>while</i>-loops where the number of
			loop iterations is known a-priori can be written as a <i>for</i>-loop.
			The easiest way to make that happen is to use a variable as a loop
			counter, similar to <i>n</i> in the prime number examples. Give it a try!
			</p>
			<div class="tutorial-exercise">
			Write a while-do-loop that is equivalent to the following for-loop:
			<tscript>
				for var i in 5:10 do print(i);
			</tscript>
			In other words, write a while-do-loop with a single print statement in
			its loop body, which prints the numbers 5, 6, 7, 8, and 9.
			</div>
			`,
			correct: `
				var i = 5;
				while i < 10 do
				{
					print(i);
					i += 1;
				}
			`,
			tests: [
				{
					type: "code",
					code: "print(i);",
				},
				{
					type: "js",
					code: `let program = parse(code).program;
					if (! program) return "Failed to parse the program code.";
					if (hasStructure(program, "{ call(print); call(print); }")) return "Use only a single print command!";
					if (! hasStructure(program, "loop;")) return "Use a loop to solve the problem!";
					if (! hasStructure(program, "'while-do-loop';")) return "Use a while-do-loop to solve the problem!";
					if (!hasStructure(program, "loop { call(print); }")) return "Use a print statement inside of the loop!";
					if (isRecursive(program)) return "Please don't use recursion.";`,
				},
			],
		},
		{
			content: `
			<p>
			The above exercise shows that in principle we could drop for-loops
			entirely and solve all problems with while-loops. However, practically
			speaking that would be a bad idea. It is easy to see that for the task
			of printing the numbers in the range 5:10, the for-loop is superior in
			about every possible evaluation category. In general, when given a
			choice, you should always use the tool that's most appropriate and most
			natural for the task as hand. As a rule of thumb, in most cases, a
			for-loop is the right tool for the job. However, some loops are much
			easier to formulate in terms of a condition, and then a while-loop should
			be picked.
			</p>

			<h2>Wrap-up</h2>
			<p>
			In this section you have learned about loops which use a condition
			instead of a pre-defined range to decide when to stop. They are mostly
			used if the number of loop iterations is not known prior to execution,
			or if one likes to create an infinite loop that is terminated with the
			<code>break;</code>-statement. In many cases you are free
			to choose if you'd like to use a <i>for</i>-loop, a <i>while-do</i>-loop,
			or a <i>do-while</i>-loop, but often one kind of loop has advantages over
			the others, like having a set count of iterations. Always try to pick the
			tool that's most appropriate for the task.
			</p>
			`,
		},
	],
};
