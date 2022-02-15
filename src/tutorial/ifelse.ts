export const tutorial_ifelse = {
	id: "ifelse",
	title: "Conditions in Programming",
	sections: [
		{
			content: `
			<p>
			A very common requirement in programming is to flexibly turn parts of
			the code on or off, or to execute either one or the other part depending
			on a condition. Let's look at an example, the infamous FizzBuzz task.
			The task is to output a range of numbers, say, <code
			class="code">1:101</code>. However, if the number in question is a
			multiple of 3 then "Fizz" should be printed instead of the number.
			Accordingly, "Buzz" shall be printed instead of numbers which are a
			multiple of 5. Numbers which are a multiple of 3 and 5 at the same time
			shall be replaced with "FizzBuzz".
			</p>
			<p>
			It seems quite obvious that this task asks for a for-loop:
			<tscript>
			for var n in 1:101 do
			{
				print(n);
			}
			</tscript>
			However, until now all numbers are printed. What we need in addition is
			a way to distinguish and detect different cases, and to react
			accordingly. We will go for four different <i>branches</i> in our loop
			body, doing the following:
			<ul>
			<li>print the number <i>n</i>,</li>
			<li>print "Fizz",</li>
			<li>print "Buzz",</li>
			<li>print "FizzBuzz".</li>
			</ul>
			</p>
			<h3>Fizz Only</h3>
			<p>
			For the start, let's simplify the task a bit: we drop "Buzz" altogether,
			and "FizzBuzz" with it. Only two cases remain: the number is either a
			multiple of 3 or not. This property can be tested with a condition
			involving the modulo operator, which computes the remainder of an
			integer division: <i>n</i> is a multiple of 3 if and only if it is
			divisible by 3, and that's the case if and only if the remainder of the
			division of <i>n</i> by 3 is 0. This condition is expressed as
			<code class="code">n % 3 == 0</code>. The following happens:
			<ul>
			<li><i>n</i> is divided by 3 and the remainder of the integer
				division is obtained.</li>
			<li>The remainder is <i>compared</i> with 0 for equality. If
				it is equal then the comparison takes the value
				<code class="code">true</code>, otherwise it results in
				the value <code class="code">false</code>.
			</ul>
			A comparison for equality always involves the operator <code
			class="code">==</code>. This is different from the operator <code
			class="code">=</code>, which triggers an assignment. The available
			comparison operators are listed in the following table:
			</p>
			<table class="nicetable">
			<tr><th>operator</th><th>meaning</th></tr>
			<tr><td>==</td><td>is equal</td></tr>
			<tr><td>!=</td><td>is not equal</td></tr>
			<tr><td>&lt;</td><td>strictly less than</td></tr>
			<tr><td>&lt;=</td><td>less than or equal</td></tr>
			<tr><td>&gt;</td><td>strictly greater than</td></tr>
			<tr><td>&gt;=</td><td>greater than or equal</td></tr>
			</table>
			<p>
			The lion's share of truth values created in a program is
			never stored in a variable or printed out. Instead, these
			values enter a conditional statement, or
			<code class="code">if</code>-<code class="code">then</code>-<code class="code">else</code>
			construct. This is exactly the branching tool we need to
			solve our problem:
			<tscript>
			for var n in 1:101 do
			{
				if n % 3 == 0
				then print("Fizz");
				else print(n);
			}
			</tscript>
			When running this code we obtain 100 messages. Every third message reads
			"Fizz", while all others contain numbers. Problem solved!
			</p>
			<p>
			At a second glance, for understanding the construction we do not
			need to know much about truth values. It is often more intuitive to
			think of the condition itself and the object of interest, and to leave
			the rest to common sense.
			</p>
			<h3>FizzBuzz</h3>
			<p>
			There are many ways to extend our program to the general FizzBuzz case.
			If you are interested in possible solutions then please consult the
			internet search engine of your choice. Here, the focus is on how to
			handle more than two cases in general. This works as follows:
			<tscript>
			for var n in 1:101 do
			{
				if n % 15 == 0 then print("FizzBuzz");
				else if n % 3 == 0 then print("Fizz");
				else if n % 5 == 0 then print("Buzz");
				else print(n);
			}
			</tscript>
			The first condition of <i>n</i> being divisible by 15 happens to be
			mathematically equivalent to it being divisible by 3 and by 5 at the same
			time. However, this may not be obvious to someone else reading our code.
			We should consider adding a comment, or even better, expressing the idea
			more directly:
			<tscript>
			for var n in 1:101 do
			{
				if n % 3 == 0 and n % 5 == 0 then print("FizzBuzz");
				else if n % 3 == 0 then print("Fizz");
				else if n % 5 == 0 then print("Buzz");
				else print(n);
			}
			</tscript>
			This may not be the most efficient and also not the most elegant
			solution, but on the pro side, the intention becomes clear immediately.
			</p>

			<h2>Boolean Operators</h2>
			<p>
			At this point, we have introduced a new construction: the keyword
			<code class="code">and</code>. It takes two conditions and turns them
			into a composite condition which is true if and only if both parts are
			true. Similarly, conditions can be combined with
			<code class="code">or</code>, and a single condition can be negated with
			<code class="code">not</code>. All of these keywords are known as
			logical or Boolean operators (named in honor of
			<a target="_blank" href="https://en.wikipedia.org/wiki/George_Boole">George Boole</a>).
			Above, we have argued that the and-operator creates a new condition from
			two simpler conditions. In programming, the formalization of this
			concept is a bit different. The conditions remain separate. Only their
			results, namely the truth values <code class="code">true</code> and
			<code class="code">false</code>, and combined with the logic operators.
			That's one reason why it is important to understand these values as
			belonging to their own data type.
			</p>
			<h2>Handling a Single Case</h2>
			<p>
			Quite often, we want to perform an operation in one case, but perform no
			operation whatsoever otherwise. In that case, the
			<code class="code">else</code> part can simply be dropped. In fact, it
			is entirely optional.
			</p>
			<h2>Control Structures and Blocks</h2>
			<p>
			A conditional statement, just like a for-loop, is a <i>control
			structure</i>. This term indicates that the constructs can flexibly
			alter the <i>control flow</i>, i.e., the decision which statement is
			executed next. All control structures have in common that they handle
			individual statements, like the print commands found in the above
			FizzBuzz program. However, what if we want to execute more than one
			command in one of the cases?
			</p>
			<p>
			Then we have to replace the command with a <i>block</i> of commands.
			We have seen such blocks before when working with for-loops.
			Strictly speaking, a for-loop executes a single statement multiple
			times. However, the statement can always be replaced with a block of
			statements, enclosed in curly braces. This is exactly what we called
			the loop body in the previous unit. The same works with conditions:
			<tscript do-not-run>
			if value < 10 then
			{
				print("The value is too small.");
				value = 10;
			}
			</tscript>
			</p>
			<div class="tutorial-exercise">
			The function <code class="code">prompt</code> can be used to obtain a
			value from the user, as follows:
			<tscript>
			var s = prompt("Please enter some text!");
			</tscript>
			Afterwards, <code class="code">s</code> contains the string entered by
			the user or <code class="code">null</code> if the user canceled the
			prompt dialog. Complete the program such that it outputs
			<code class="code">s</code> only if the user did not cancel the
			interaction.
			</div>
			`,
			correct: `
			var s = prompt("Please enter some text!");
			if s != null then print(s);
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
					input: [null],
				},
			],
		},
		{
			content: `
            <h2>Wrap-up</h2>
            <p>
			The if-else-control structure makes a decision which code to execute
			under certain conditions. Boolean statements are evaluated to be true or
			false and decide whether the then-case or the else-case is executed. It
			is possible to create conditions using comparison operators, and to
			compose the conditions using logical operators.
			</p>
            `,
		},
	],
};
