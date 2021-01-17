export const doc_cheatsheet = {
"id": "cheatsheet",
"name": "Cheat Sheet",
"title": "Cheat Sheet",
"content": `
	<div class="flex">
	<table class="nicetable">
	<tr><th><a href="#/language/expressions/literals">literals</a></th><th>example</th></tr>
	<tr><td><a href="#/language/expressions/literals/integers">integer</a></td><td><code>42</code></td></tr>
	<tr><td><a href="#/language/expressions/literals/reals">real</a></td><td><code>6.62607015e-34</code></td></tr>
	<tr><td><a href="#/language/expressions/literals/strings">string</a></td><td><code>"This is a test.\\nNext line."</code></td></tr>
	<tr><td>range</td><td><code>20:30</code></td></tr>
	<tr><td><a href="#/language/expressions/literals/arrays">array</a></td><td><code>["foo", 42, false];</code></td></tr>
	<tr><td><a href="#/language/expressions/literals/dictionaries">dictionary</a></td><td><code>{foo: 42, "bar-bar": false}</code></td></tr>
	</table>
	<table class="nicetable">
	<tr><th><a href="#/language/statements">control structures</a></th><th>example / syntax</th></tr>
	<tr><td><a href="#/language/statements/if-then-else">condition</a></td><td><code>if i == 0 then { ... } else { ... }</code></td></tr>
	<tr><td><a href="#/language/statements/for-loops">for-loop</a></td><td><code>for var i in 0:n do { ... }</code></td></tr>
	<tr><td><a href="#/language/statements/while-do-loops">while-do-loop</a></td><td><code>while not happy do { ... }</code></td></tr>
	<tr><td><a href="#/language/statements/do-while-loops">do-while-loop</a></td><td><code>do { ... } while not happy;</code></td></tr>
	<tr><td><a href="#/language/statements/try-catch">try-catch-block</a></td><td><code>try { ... } catch var ex do { ... }</code></td></tr>
	</table>
	<table class="nicetable">
	<tr><th><a href="#/language/syntax/comments">comments</a></th><th>example</th></tr>
	<tr><td>line comment</td><td><code># comment</code></td></tr>
	<tr><td>range comment</td><td><code>#* comment *#</code></td></tr>
	</table>
	<table class="nicetable">
	<tr><th><a href="#/language/declarations/variables">variables</a></th><th>example</th></tr>
	<tr><td>declare variable(s)</td><td><code>var a, b;</code></td></tr>
	<tr><td>declare and initialize</td><td><code>var c = 7;</code></td></tr>
	</table>
	<table class="nicetable">
	<tr><th>functions</th><th>example / syntax</th></tr>
	<tr><td><a href="#/language/declarations/functions">function</a> or <a href="#/language/declarations/classes">method</a></td><td><code>function myfunc (...) { ... }</code></td></tr>
	<tr><td><a href="#/language/expressions/literals/anonymous-functions">lambda function</a></td><td><code>function (...) { ... }</code></td></tr>
	<tr><td>enclosing <a href="#/language/expressions/literals/anonymous-functions">lambda function</a></td><td><code>function [...] (...) { ... }</code></td></tr>
	</table>
	<table class="nicetable">
	<tr><th>namespaces</th><th>example / syntax</th></tr>
	<tr><td>define <a href="#/language/declarations/namespaces">namespace</a></td><td><code>namespace myspace { ... }</code></td></tr>
	<tr><td><a href="#/language/directives/use">import</a> specific name(s)</td><td><code>from myspace use foo, bar;</code></td></tr>
	<tr><td><a href="#/language/directives/use">import</a> whole namespace</td><td><code>use namespace myspace;</code></td></tr>
	</table>
	<table class="nicetable">
	<tr><th><a href="#/library">standard library</a></th><th>topic</th></tr>
	<tr><td><a href="#/library/core">code functions</a></td><td>messages, time, errors, files, events</td></tr>
	<tr><td><a href="#/library/math">math functions</a></td><td>e.g., sine and square root</td></tr>
	<tr><td><a href="#/library/turtle">turtle graphics</a></td><td>simple graphics</td></tr>
	<tr><td><a href="#/library/canvas">canvas graphics</a></td><td>powerful 2D graphics</td></tr>
	</table>
	<table class="nicetable">
	<tr><th><a href="#/language/declarations/classes">classes</a></th><th>example / syntax</th></tr>
	<tr><td>define class</td><td><code>class MyStuff { ... }</code></td></tr>
	<tr><td>define subclass</td><td><code>class MyCoolStuff : MyStuff { ... }</code></td></tr>
	<tr><td>constructor</td><td><code>constructor (...) { ... }</code></td></tr>
	<tr><td>constructor calling super class</td><td><code>constructor (...) : super(...) { ... }</code></td></tr>
	<tr><td>visibility sections</td><td><code>public:</code><br/><code>protected:</code><br/><code>private:</code></td></tr>
	<tr><td>class-related keywords</td><td><code>static</code>, <code>this</code>, <code>super</code></td></tr>
	</table>
	<table class="nicetable">
	<tr><th><a href="#/language/types">data type</a></th><th>values</th></tr>
	<tr><td><a href="#/language/types/null"><code>Null</code></a></td><td><code>null</code></td></tr>
	<tr><td><a href="#/language/types/boolean"><code>Boolean</code></a></td><td><code>true</code>, <code>false</code></td></tr>
	<tr><td><a href="#/language/types/integer"><code>Integer</code></a></td><td>signed 32-bit integers</td></tr>
	<tr><td><a href="#/language/types/real"><code>Real</code></a></td><td>floating point numbers</td></tr>
	<tr><td><a href="#/language/types/string"><code>String</code></a></td><td>text</td></tr>
	<tr><td><a href="#/language/types/array"><code>Array</code></a></td><td>ordered container with integer keys</td></tr>
	<tr><td><a href="#/language/types/dictionary"><code>Dictionary</code></a></td><td>associative container with string keys</td></tr>
	<tr><td><a href="#/language/types/function"><code>Function</code></a></td><td>function, lambda function, method</td></tr>
	<tr><td><a href="#/language/types/range"><code>Range</code></a></td><td>range of integers, <code>from:to</code></td></tr>
	<tr><td><a href="#/language/types/type"><code>Type</code></a></td><td>description of a type</td></tr>
	</table>
	<table class="nicetable">
	<tr><th><a href="#/language/expressions/precedence">operator</a></th><th>meaning</th></tr>
	<tr><td><a href="#/language/expressions/binary-operators/addition"><code>+</code></a></td><td>addition</td></tr>
	<tr><td><a href="#/language/expressions/binary-operators/subtraction"><code>-</code></a></td><td>negation, subtraction</td></tr>
	<tr><td><a href="#/language/expressions/binary-operators/multiplication"><code>*</code></a></td><td>multiplication</td></tr>
	<tr><td><a href="#/language/expressions/binary-operators/real-division"><code>/</code></a></td><td>real division</td></tr>
	<tr><td><a href="#/language/expressions/binary-operators/integer-division"><code>//</code></a></td><td>integer division</td></tr>
	<tr><td><a href="#/language/expressions/binary-operators/modulo"><code>%</code></a></td><td>modulo</td></tr>
	<tr><td><a href="#/language/expressions/binary-operators/power"><code>^</code></a></td><td>power</td></tr>
	<tr><td><a href="#/language/expressions/binary-operators/equality"><code>==</code>, <code>!=</code></a></td><td>equality</td></tr>
	<tr><td><a href="#/language/expressions/binary-operators/order"><code>&lt;</code>, <code>&lt;=</code>, <code>&gt;</code>, <code>&gt;=</code></a></td><td>order comparison</td></tr>
	<tr><td><a href="#/language/expressions/unary-operators/not"><code>not</code></a></td><td>logical or bitwise not</td></tr>
	<tr><td><a href="#/language/expressions/binary-operators/and"><code>and</code></a></td><td>logical or bitwise and</td></tr>
	<tr><td><a href="#/language/expressions/binary-operators/or"><code>or</code></a></td><td>logical or bitwise or</td></tr>
	<tr><td><a href="#/language/expressions/binary-operators/xor"><code>xor</code></a></td><td>logical or bitwise exclusive or</td></tr>
	</table>
	</div>
`,
"children": [],
};
