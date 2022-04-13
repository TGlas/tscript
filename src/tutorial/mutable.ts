export const tutorial_mutable = {
	id: "mutable",
	title: "Mutable Values",
	sections: [
		{
			content: `
			<p>
			In TScript and most other scripting languages (like Javascript and
			Python), a value can be <i>mutable</i> or <i>immutable</i>. Whether a
			value is mutable or not depends on its type. All types we encountered
			before we saw containers are immutable. This means that values cannot
			be changed. Example:
			<tscript>
				var n = 5;
				n += 2;
			</tscript>
			In this program, the value 5 is created and stored in the variable
			<code>n</code>. Now it seems that in the second line the value is
			<i>altered</i> by adding 2, resulting in 7. However, that is not what's
			happening! The second line is just a shorthand for
			<tscript>
				n = n + 2;
			</tscript>
			The following happens: TScript computes <code>n + 2</code>, resulting in
			the new value 7. Now there are three values in the program, namely 5, 2,
			and 7. Then the assignment is executed. Its effect is that a new value
			is assigned to <code>n</code>, namely the value 7. The other values are
			still around, and importantly, never changed. In short, even operators
			like <code>+=</code> do not change existing values. They perform a
			calculation, resulting in a new value, and then assign that value to a
			variable.
			</p>
			<p>
			Why is that important? Let's look at the following program:
			<tscript>
				var n = 5;
				var k = n;
				n += 2;
				print(k);       # prints 5 (not 7)
			</tscript>
			That's expected. We would be very irritated if the output had been 7,
			since the variable n was changed, not k. Although this looks trivial,
			let's recap in detail what happened:
			<ul>
				<li>We assign the integer 5 to the variable n. This means that n
					references the integer 5.</li>
				<li>The variable k is created. It references the same value. At
					this point there are two variables, but only a single value.
					Take note of this point, it will become very important soon.</li>
				<li>The compound assignment <code>n += 2;</code> creates the new
					value 7 and assigns it to n. The variable k still references
					the old value 5.</li>
				<li>The print statement outputs the value referenced by k, which
					is 5.</li>
			</ul>
			The effect is exactly the same as if variables would contain values,
			and if assignment meant to write a new independent copy of a value into
			the variable. However, we have seen that different mechanisms are at
			play.
			</p>
			<p>
			Now consider this quite similar program:
			<tscript>
				var a = [5];
				var b = a;
				a.push(2);
				print(b);       # prints [5,2] (not [5])
			</tscript>
			What the heck happened to the variable b? We modified a, but b changed
			too! Let's have a detailed look at what just happened:
			<ul>
				<li>We assign the array <code>[5]</code> to the variable a. This
					means that a references the array. The array contains one item.
					Hence, it references the value 5. At this point, there exist two
					values, namely <code>5</code> and <code>[5]</code>.</li>
				<li>The variable b is created. It references the same array as the
					variable a. Like in the example above, the second line does not
					create an independent copy of the value referenced by a.
					Instead, both variables reference the same array.</li>
				<li>The command <code>a.push(2);</code> <i>alters</i> the value
					referenced by a! It does <i>not</i> create a new value (as the
					compound assignment in the first program did). There is still
					only a single array value in our program, and that value is
					referenced by a and b. However, the array itself changes. After
					the command, it holds two items, referencing the integers 5 and
					2. Therefore, a and b both refer to the array
					<code>[5,2]</code>. Magically, without even mentioning the
					variable b, its value has changed! That's actually accurate.
					It still refers to the same value, but since the value is
					mutable, it can change at any time.</li>
				<li>The print statement outputs the array, which is still the only
					array in the program, and hence prints <code>[5,2]</code>.</li>
			</ul>
			The same works with dictionaries, which are also mutable values:
			<tscript>
				var d1 = {};
				var d2 = d1;
				d1["foo"] = "bar";
				print(d2);       # prints {foo:bar} (not {})
			</tscript>
			Arguably, the fact that variables do not "contain" but only "reference"
			values, and the effect that changing a value through one variable
			naturally affects all other variables referencing the same value, is not
			always the expected behavior. It is therefore a common source of bugs,
			and programming beginners should pay special attention.
			</p>
			<p>
			In some situations the behavior of referencing instead of copying is not
			desired. If a copy is needed, then the so-called constructor syntax can
			be used:
			<tscript>
				var a = [5];
				var b = a;          # reference to the same array
				var c = Array(a);   # copy of the array, so now we have a second independent array
				a.push(2);          # alter the first array
				print(a);           # prints [5,2]
				print(b);           # prints [5,2]
				print(c);           # prints [5]
			</tscript>
			Again, the same works with dictionaries. For nested containers, the
			above solution copies only the top level:
			<tscript>
				var data = {
						players: [
							{name: "Tom", console: "PC"},
							{name: "Tim", console: "PS"}
						]
					};
				var copy = Dictionary(data);
				copy["players"][0]["console"] = "none";
				print(data["players"][0]["console"]);   # prints none
			</tscript>
			</p>
			Why is that? Because <code>data["players"]</code> and
			<code>copy["players"]</code> are still references, referencing the same
			array. If we want to copy a whole hierarchy of containers then we need
			to use the <code>deepcopy</code> function:
			<tscript>
				var data = {
						players: [
							{name: "Tom", console: "PC"},
							{name: "Tim", console: "PS"}
						]
					};
				var copy = deepcopy(data);
				copy["players"][0]["console"] = "none";
				print(data["players"][0]["console"]);   # prints PC
			</tscript>

			<h2>Wrap-up</h2>
			<p>
			We have seen a major twist that comes with all containers: they are
			mutable values. This is where we see clearly that a variable references
			a value, in contrast to containing (an independent copy of) the value.
			The effect can be quite unintuitive at first. It can easily result in
			subtle bugs.
			</p>
			`,
		},
	],
};
