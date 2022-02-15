export const tutorial_datatypes = {
	id: "datatypes",
	title: "Simple Data Types",
	sections: [
		{
			content: `
			<p>
			We have already encountered values of different types: numbers
			and strings. We have also had a glimpse at the values
			<code class="code">true</code> and <code class="code">false</code>.
			Furthermore, when printing an uninitialized variable, you may
			have stumbled across the value <code class="code">null</code>:
			<tscript>
			var animal;
			print(animal);   # prints "null"
			</tscript>
			This is a special value indicating that the variable contains
			"no actual value", or "nothing of interest". That's the case as
			long as nothing was assigned to it.
			</p>
			<h2>List of Data Types</h2>
			<p>
			For a programming language it is important that these values are
			of different types, called <i>data types</i>. The type of a value
			decides on which operations can be applied to it. For example,
			numbers can be multiplied and strings can be concatenated (with
			the plus-operator). That sounds trivial, but we will see that it
			implies a few minor quirks.
			</p>
			<p>
			The values we have seen so far are of the following types:
			</p>
			<table class="nicetable">
			<tr><th>data type</th><th>values</th><th>meaning</th></tr>
			<tr><td>Null</td><td><code>null</code></td><td>no (meaningful) value</td></tr>
			<tr><td>Boolean</td><td><code>true</code>, <code>false</code></td><td>truth or logic value</td></tr>
			<tr><td>Integer</td><td><code>0</code>, <code>23</code>, <code>-1000</code></td><td>integral number</td></tr>
			<tr><td>Real</td><td><code>2.0</code>, <code>3.14159</code></td><td>decimal number</td></tr>
			<tr><td>String</td><td><code>""</code>, <code>"Hello World!"</code></tscript></td><td>arbitrary text (can be empty)</td></tr>
			</table>
			</p>
			<p>
			Each data type comes with a range of values it can represent.
			The data types <code class="code">Null</code> and
			<code class="code">Boolean</code> are particularly simple; they
			have only one and two values, respectively.
			</p>
			<h2>Two Types of Numbers</h2>
			<p>
			In a computer, the range and the precision of
			numbers is limited, but for now this is a rather irrelevant
			technicality. If you are interested, open the documentation and
			search for "type integer" and "type real". As a rule of thumb,
			use integers for counting and indexing, and real numbers for
			calculations. While most of that will happen automatically, it
			is sometimes useful to be aware of the concept that every value
			has a data type, and that different types support different
			operations.
			</p>
			<p>
			One example of such a situation is integer overflow. Integers
			are limited to the range -2<sup>31</sup> to +2<sup>31</sup>-1.
			While that range is large enough for most purposes, it is not
			infinite. When exceeding the range, very unintuitive things
			happen, known as integer overflow:
			<tscript>
			print(2000^3);     # prints -589934592
			</tscript>
			Real numbers have a significantly larger range, so with reals
			the same calculation succeeds:
			<tscript>
			print(2000.0^3);   # prints 8000000000
			</tscript>
			Here we have used a seemingly superfluous decimal point. The point does
			not change the value of the number, but it forces the computer to
			interpret it as a value of type <code class="code">Real</code>.
			</p>
			<h2>Character Escaping</h2>
            <p>
            To store text we use type <code class="code">String</code>. A string
            is a sequence of characters of any size. A string is enclosed in double
            quotation marks, which signal this specific data type. It is possible
            to store any kind of character inside of a string. However, how to store
            a double quotation mark in a string? The naive attempt of doing so would
            look as follows:
            </p>
            <pre class="code">print("She shouted "Don't do that!" and left.");</pre>
            <p>
            However, the string ends after the second word. That's because TScript
            has a strict syntax, and no chance to understand that we meant two double
            quotes to delimit the string, while the other two are supposed to be
            part of the string content. In this sense, the double quotation mark is a
            "forbidden" character.
            </p><p>
            In order
            to enable double quotes as well as several special characters (like
            newline) inside of strings, a mechanism called <i>escaping</i> is
            employed. It defines that the backslash character <code class="code">\</code>
            when used inside of a string has a special meaning, which depends on the
            following character(s). The backslash plus the following characters taken
            together is called an <i>escape sequence</i>. The most important escape
            sequences are as follows:
            </p>
			<table class="nicetable">
			<tr><th>escape sequence</th><th>meaning</th></tr>
			<tr><td><code class="code">\\"</code></td><td><code class="code">"</code></td></tr>
			<tr><td><code class="code">\\\\</code></td><td><code class="code">\\</code></td></tr>
			<tr><td><code class="code">\\n</code></td><td>newline</td></tr>
			<tr><td><code class="code">\\r</code></td><td>carriage return</td></tr>
			<tr><td><code class="code">\\t</code></td><td>horizontal tabulator</td></tr>
			</table>
			</p>
			<p>
			With the help of escape characters, we can complete the example:
			<tscript>
			print("She shouted \\"Don't do that!\\" and left.");
			</tscript>
			For a complete list of escape sequences, open the documentation and
			search for "string literal escape double quotes".
			</p>
			<h2>Further Data Types</h2>
			<p>
			As we move on, we will discover five more built-in data types of
			TScript, as well as <i>classes</i>, which are user-defined data types.
			For the moment, we will focus on strings and numbers, and in the
			following units we will get to know more about truth values.
			</p>
			`,
		},
	],
};
