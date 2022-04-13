export const tutorial_oop = {
	id: "oop",
	title: "Object-oriented Programming",
	sections: [
		{
			content: `
			<p>
			Recall how we had previously solved the phone book problem with a
			dictionary. Using names as keys, we associated a phone number with
			each name. Now let's extend the program to an address book. Next to
			the phone number we would like to store a postal address and an email
			address. Of course, we could add even more fields, like a homepage,
			social media channels, and what not.
			</p>
			<p>
			How should we represent such data? One option is to use one dictionary
			per field:
			<tscript>
				var phone_number = {};
				var postal_address = {};
				var email_address = {};
			</tscript>
			That's cumbersome, and it has the same problem we were aiming to solve
			with the dictionary: the various fields are disconnected. They reside in
			independent containers, and they are connected only through a common
			key.
			</p>
			<p>
			It would be much better to use a single dictionary with the ability to
			associate multiple values with a name. Well, we could use an array to
			hold multiple values, maybe like this:
			<tscript>
				var address_book = {};
				address_book["Alice"] = [
						1234567,
						"Example Street 1001",
						"alice@example.com"
					];
			</tscript>
			That works, but it has another downside. Let's write an email to Alice.
			To obtain the address, we do the following:
			<tscript>
				var e = address_book["Alice"][2];
			</tscript>
			If we read that line of code in a few days in the future then we will
			most probably have forgotten the significance of the index 2.
			That's not good. We can improve by nesting dictionaries:
			<tscript>
				var address_book = {};
				address_book["Alice"] = {
						"phone": 1234567,
						"address": "Example Street 1001",
						"email": "alice@example.com"
					};
			</tscript>
			and then later on
			<tscript>
				var e = address_book["Alice"]["email"];
			</tscript>
			That's already pretty good! The only remaining problem is that entries
			in our address book are not forced to have a fixed data layout. Some
			people may have a field called "email", others may have "private email",
			and others again some fields we defined years ago and forgot about.
			Ideally, all entries in the address book would be homogeneous, so that
			the same graphical user interface works for all of them. It is
			understood that our program can make sure that only a fixed number of
			keys is used, but that's error prone, in particular if we change our
			mind or extend the functionality.
			</p>
			<p>
			Generally speaking, variable-sized containers like arrays and
			dictionaries work best for homogeneous data, like multiple persons.
			With homogeneous we mean that two persons should always be described by
			the same attributes, like all rows in a spreadsheet cover the same
			columns. In contrast, the data describing a single person is
			heterogeneous: the name is a string, the phone number could be an
			integer, and age may be any number (usually we only care for integers),
			and so on. Even if we use strings for everything, the meanings of fields
			like "postal address" and "email" is very different. This is what we
			call heterogeneous data. For heterogeneous data, the set of valid keys
			is usually pre-defined (it does not change at runtime), and so is the
			meaning of the keys.
			</p>

			<h2>Classes and Objects</h2>
			<p>
			In programming, there is a special container for heterogeneous data: the
			<i>object</i>. In its simplest form, an object is just a collection of
			attributes, with a fixed layout:
			<tscript>
			class Person
			{
			public:
				var first_name;
				var last_name;
				var phone;
				var address;
				var email;
			}
			</tscript>
			The <code>class</code> is a specification of the data layout. We should
			think of it as a <i>blueprint</i> for objects of type
			<code>Person</code>. Indeed, this is more than mere analogy: a class
			<i>is</i> a data type, and objects are values of this type. Let's
			create an object:
			<tscript>
				var p = Person();
				p.first_name = "Alice";
				p.last_name = "Example";
				p.phone = 1234567;
				p.address = "Example Street 1001";
				p.email = "alice@example.com";
			</tscript>
			The first line creates a new object of type (of class) Person. The five
			following lines fill in its attributes. In essence, our object is a
			collection of five variables. Variables inside of an object are often
			called <i>attributes</i>. The variables are accessed with the
			dot-operator (e.g., <code>p.phone</code>).
			An attempt to add further fields to the object fails:
			<tscript>
				p.birthday = "July 20";
				# error: type 'Person' does not have a public member 'birthday'
			</tscript>
			The most important point here is that for a single class there can be an
			arbitrary number of objects. Let's create another one:
			<tscript>
				var p2 = Person();
				p2.first_name = "Bob";
				p2.last_name = "Example";
				p2.phone = 55667788;
				p2.address = "Example Street 42";
				p2.email = "bob@example.com";
			</tscript>
			This works just like with every other data type: there is only a single
			type <code>String</code>, but there are many possible strings (values).
			The same applies to classes and objects: a class is a data type, and
			there may be arbitrarily many objects of that type. In our application,
			there is only one layout definition for a person, but we may store any
			number of persons in the address book.
			</p>
			<p>
			With these properties, objects are the ideal solution to our problem. We
			can store all persons in a container (either array or dictionary), and
			that makes sense since the items are homogeneous. Each item is a
			<code>Person</code> (to be precise: an object of type
			<code>Person</code>), which itself holds heterogeneous data with a fixed
			data layout consisting of five well-defined attributes. We cannot change
			that data layout at runtime. Of course, when changing the program we can
			extend the class definition, say, by adding a <code>birthday</code>
			attribute. The good thing is that then all persons have that new
			attribute, so they stay homogeneous, and the same processing will work
			for all persons.
			</p>
			<div class="tutorial-exercise">

			<p>
			Create a class <code>Animal</code> with attribute <code>name</code>.
			</p>
			</div>
			`,
			correct: `
			class Animal
			{
			public:
				var name;
			}`,
			tests: [
				{
					type: "code",
					code: `var a = Animal(); a.name = "Donald Duck"; print(a.name);`,
				},
			],
		},
		{
			content: `
			<h2>Methods</h2>
			<p>
			It turns out that classes can do much more than defining attributes.
			The concept is so powerful that some languages (like Java) are built
			entirely on top of classes. Beyond attributes, the second most useful
			concept of classes are <i>methods</i>. At this point we should get used
			to the fact that in the field called object-oriented programming, there
			are many terms, and many of them seemingly duplicate concepts, which
			already have a name. We have simply rebranded a type as a class and a
			variable as an attribute. Similarly, a method is a function.
			</p>
			<p>
			The idea of a method is that there are operations on data types, and
			that these operations should be "bound" to the class. For example,
			arrays can be sorted with the function <code>sort</code>. This is an
			example of a method. The method operates on exactly one array at a time.
			For an array <code>a</code> it is called with the syntax
			<code>a.sort()</code>. We recognize the dot-operator, which is also used
			for accessing attributes. Alternatively, the sorting functionality could
			be implemented as a normal function, called like this:
			<code>sort(a)</code>. Would that make a big difference? Well, in the
			latter case, nothing tells us that only arrays can be sorted. We could
			try with a dictionary and probably fail. The whole point of making
			<code>sort</code> a method is to say: "Dear fellow programmer (or future
			self), the function <code>sort</code> is a method of class
			<code>Array</code> because it sorts arrays, and nothing else."
			If there is another class that needs sorting then we can add a
			(different) sort method to that class, too. The mechanism of binding
			operations to datatypes on which they operate can help a lot with
			keeping a large program organized and readable.
			</p>
			<p>
			Defining a class means to define our own data type. Defining a method
			means to define a function <i>within</i> that class. Let's define a
			simple method that returns the full name of a person:
			<tscript>
			class Person
			{
			public:
				var first_name;
				var last_name;
				var phone;
				var address;
				var email;

				function full_name()
				{
					return first_name + " " + last_name;
				}
			}
			</tscript>
			Given a variable <code>p</code> referring to a person, the method is
			used as follows:
			<tscript>
				print(p.full_name());   # may print: Alice Example
			</tscript>
			The functionality of adding the strings is pretty simple. However, it
			is worthwhile to point out a few interesting aspects:
			<ul>
				<li>The method resides inside of the class body alongside the
					attributes. Attributes and methods are both "contained" in the
					class. Jointly, they are called <i>members</i> of the class.</li>
				<li>A method is called on an object with the dot-operator. This is
					the same as accessing an attribute.</li>
				<li>Within the class (and hence within the method), attributes can
					be accessed by simply writing out their names. There is no need
					to use the dot operator, since the object itself is already
					specified when invoking the method. The same holds when calling
					a method from within another method of the same class.</li>
			</ul>
			Otherwise, methods are just normal functions. They can have default
			parameters, implement any sub-program, and return a value.
			</p>

			<h3>Constructors</h3>
			<p>
			A <i>constructor</i> is a special method. It cannot be called like a
			function. Instead, it is called whenever a new object of the class is
			created. It is declared with the keyword <code>constructor</code>
			instead of <code>function</code>, and it does not have a name:
			<tscript>
			class Person
			{
			public:
				var first_name;
				var last_name;
				var phone;
				var address;
				var email;

				constructor(first, last, phone=null, address=null, email=null)
				{
					first_name = first;
					last_name = last;
					this.phone = phone;
					this.address = address;
					this.email = email;
				}

				function full_name()
				{
					return first_name + " " + last_name;
				}
			}
			</tscript>
			As we can see, a constructor can have parameters. This has consequences
			for object construction: we need to provide the corresponding
			parameters:
			<tscript>
				var p = Person("Alice", "Example", email="alice@example.com");
			</tscript>
			This looks pretty convenient though, and indeed, it is. The role of the
			constructor is to initialize a new object so that we do not need to set
			all of its attributes one by one.
			</p>
			<p>
			There is one more particularity to notice in the above code: the use of
			<code>this</code>. The keyword refers to the object on which a method
			was called. Within the constructor, that's the newly created object.
			We see that it allows us to refer to the attribute "phone" although a
			parameter of the same name exists, which would otherwise shadow the
			attribute.
			</p>
			<p>
			A brief note on name resolution inside of methods: a name is first
			matched with all local variables (including parameters), then with all
			members (attributes and methods), and then with global names (variables,
			functions, classes).
			</p>

			<div class="tutorial-exercise">
			<p>
			Extend the above class <code>Animal</code> by a constructor taking a
			single argument to initialize the name, and a method <code>greet()</code>
			which prints the text</p>
			<p><code>"Hello, my name is <...>!"</code></p>
			</p>where the animal's name shall be printed instead of <code><...></code>.
			</p>
			</div>
			`,
			correct: `
			class Animal
			{
			public:
				var name;
				function greet()
				{
					print("Hello, my name is " + name + "!");
				}
				constructor(theName)
				{
					name = theName;
				}
			}`,
			tests: [
				{
					type: "code",
					code: `var a = Animal("Donald Duck"); a.greet(); a.name = "Daisy Duck"; print(a.name);`,
				},
			],
		},
		{
			content: `
			<div class="tutorial-exercise">
			<p>
			Extend the program further. Create an array <code>var mice</code>
			containing two animals called "Mickey" and "Minnie".
			Use a loop to make each of them say their greeting.
			</p>
			</div>
			`,
			correct: `
			class Animal
			{
			public:
				var name;
				function greet()
				{
					print("Hello, my name is " + name + "!");
				}
				constructor(theName)
				{
					name = theName;
				}
			}
			var mice = [Animal("Mickey"), Animal("Minnie")];
			for var mouse in mice do mouse.greet();
			`,
		},
		{
			content: `
			<h2>Visibility</h2>
			<p>
			Each member of a class has a <i>visibility</i> attached. We have already
			seen a visibility type, that's the line <code>public:</code> which we
			did not discuss yet. You may have wondered about its role, so here it is.
			All declarations following <code>public</code> have public visibility.
			This means that they are accessible from everywhere, and the important
			bit of it is that they are accessible from <i>outside</i> of the class.
			The alternative is private visibility. A private attribute or method is
			visible only from <i>within</i> the class. This means in particular that
			every attempt to access a private member with the dot-syntax fails. In
			other words, we need to update our understanding of the dot-syntax: with
			the syntax object.member, we can access a <i>public</i> member of an
			object.
			</p>
			<p>
			Making a member private is easy. In fact, it is not uncommon to make all
			attributes private. Let's try that:
			<tscript>
			class Person
			{
			private:
				var first_name;
				var last_name;
				var phone;
				var address;
				var email;

			public:
				constructor(first, last, phone=null, address=null, email=null)
				{
					first_name = first;
					last_name = last;
					this.phone = phone;
					this.address = address;
					this.email = email;
				}

				function full_name()
				{
					return first_name + " " + last_name;
				}
			}
			</tscript>
			</p>
			<p>
			The following program still works:
			<tscript>
			var p = Person("Alice", "Example", email="alice@example.com");
			print(p.full_name());
			</tscript>
			However, the following does not:
			<tscript>
			var p = Person("Alice", "Example", email="alice@example.com");
			print(p.email);
			</tscript>
			This is because <code>full_name</code> is a public member (the fact
			that it is a function and not a variable has nothing to do with this),
			while <code>email</code> is a private member.
			</p>

			<h3>The Public Interface</h3>
			<p>
			This is all nice and good &mdash; but why should we do that? It seems
			that making the attributes private makes our lives unnecessarily
			complicated, since now we cannot access email addresses and more. What
			do we do if we want to write an email to Alice?
			</p>
			<p>
			The answer to that question has two parts. The first part is that we
			need to extend the class further, so that the email can be accessed
			again. As a nice side effect, we get finer control over the access. The
			second part is that this allows us to separate what is called the
			<i>interface</i> of a person (of the class Person) from its
			<i>implementation</i>.
			</p>
			<p>
			The interface consists of all public members. This is how the outside
			world interacts with a person. For designing an interface, we need to
			think of all possible tasks. For this, the user of the class shall now
			which methods are available, but they should not need to know anything
			about <i>how</i> they work. One such task is writing an email. There
			are several options for interface design. One is to add a
			<code>writeEmailTo</code> method. However, one may then ask whether
			sending an email should be the job of a <code>Person</code> class or
			not, and probably decide that the functionality does not belong into an
			address book application. We will opt for a simpler and more generic
			interface. Class <code>Person</code> will provide a method
			<code>function email()</code> that returns the email address. Such a
			method is often called a <i>getter</i> for the email attribute. Other
			conventions may demand that it is called <code>get_email()</code> or
			similar.
			</p>
			<p>
			Since the name <code>email</code> would now be used twice &mdash; once
			by the attribute and once by the method &mdash; we introduce a naming
			convention for attributes: we will prefix them with <code>m_</code>,
			shorthand for "member". We also add getters for phone number and
			address. Then our class looks as follows:
			<tscript>
			class Person
			{
			private:
				var m_first_name;
				var m_last_name;
				var m_phone;
				var m_address;
				var m_email;

			public:
				constructor(first, last, phone=null, address=null, email=null)
				{
					m_first_name = first;
					m_last_name = last;
					m_phone = phone;
					m_address = address;
					m_email = email;
				}

				function full_name()
				{ return m_first_name + " " + m_last_name; }
				function phone()
				{ return m_phone; }
				function address()
				{ return m_address; }
				function email()
				{ return m_email; }
			}
			</tscript>
			With all of this in place, our class can be used as follows:
			<tscript>
			var p = Person("Alice", "Example", email="alice@example.com");
			print(p.full_name());
			print(p.phone());
			print(p.address());
			print(p.email());
			</tscript>
			In effect, we have created a restricted interface for a person: It
			allows to specify all properties at construction time, but it does not
			allow to change anything later. That's of course not reasonable for an
			address book. So let's add a function for changing the email. Such a
			function is called a <i>setter</i>. A simple implementation (to be
			inserted inside of the class) would look as follows:
			<tscript>
			function setEmail(email)
			{ m_email = email; }
			</tscript>
			Now we can read and write to the email field. However, if that's the
			case, then why don't we simply make the attribute public? One reason is
			that with an interface like this in place, we can add or change
			functionality "behind the scenes", i.e., without bothering the user of
			the class. Let's say, we wish to only accept valid email addresses.
			Without going into the details of what that means, a valid email address
			should contain the "at"-character <code>"@"</code>. We change the setter
			to reflect this rule:
			<tscript>
			function setEmail(email)
			{
				if email.find("@") == null then throw "invalid email address";
				m_email = email;
			}
			</tscript>
			Notice that the change did not affect the interface at all! All code
			using the class still works, with the only difference that we check for
			valid parameter values. Had we made the attribute public, then the
			amount of work inside of the class would be considerably reduced, but
			the amount of work done in code using the class increases. Imagine that
			we need to check the validity of an email address at five different
			places in a program, since that's the number of places where we set the
			value. Then we need to write the same check five times. And now imagine
			that we want to make our email policy more strict and demand that the
			domain contains at least one dot &mdash; that's the same change in five
			places. With that perspective in mind, the additional work inside of the
			class body is well worth it.
			</p>

			<h3>Implementation</h3>
			<p>
			The real reason why making things private to a class is that the users
			of the class are forced to restrict themselves to the public interface.
			That's a serious advantage, even if the programmer of the class is its
			only user. Sounds like a disadvantage at first, so why is that?
			</p>
			<p>
			The reason is that everything that is private can be changed, even later
			on when millions of lines of code use the class already, without
			affecting that code. In the example above, we changed the
			<i>implementation</i> of the method <code>setEmail</code> without
			changing the interface. We could go further and change more of the
			private code, which is often called "implementation details". For
			example, we can rename the variable <code>m_email</code> into
			<code>m_private_email_address</code>. We have this freedom only because
			no user of the class relies on the variable's name being
			<code>m_email</code>, and that's because they cannot access it anyway.
			Had we made the name public then renaming the variable may entail a
			large number of changes down the road. We could even decide to store the
			different parts of the email like the name and the domain (the part
			before and after the "@") in separate variables, or in a class
			describing an email address.
			</p>
			<p>
			Now think about a software library that is used in thousands of other
			project, like a cryptographic library. Such a software library will
			likely live for a long time, like a decade or more. During that time,
			cryptography, internet standards and many other circumstances may change
			considerably. Then the ability to change implementation details without
			breaking thousands of apps is invaluable. Therefore, the separation of
			interfaces and implementation details is a vital concept in software
			engineering.
			</p>

			<div class="tutorial-exercise">
			<p>
			In the class Animal, rename the attribute into <code>m_name</code> and
			make it private. Add a public getter <code>function name()</code> which
			allows to read the name. My defining a getter without a setter we
			implement a read-only attribute, which makes sense, since the name of an
			animal (usually) does not change.
			</p>
			</div>
			`,
			correct: `
			class Animal
			{
			public:
				function greet()
				{
					print("Hello, my name is " + m_name + "!");
				}
				constructor(theName)
				{
					m_name = theName;
				}
				function name()
				{
					return m_name;
				}
			private:
				var m_name;
			}
			`,
			tests: [
				{
					type: "code",
					code: `var a = Animal("Donald"); print(a.name()); a.greet();`,
				},
			],
		},
		{
			content: `
			<h3>Simple Classes</h3>
			<p>
			Now that you know about interfaces, implementation details and their
			advantages, it should be noted that not every class needs them. Consider
			the following simple class, which could represent a position on the
			canvas:
			<tscript>
			class Point
			{
			public:
				var x, y;
			}
			</tscript>
			It is really just a minimal wrapper for the two coordinates, and there
			is absolutely no reason to over-engineer it by encapsulating
			functionality (it does not even have any methods) inside of the class,
			hidden behind a stable interface. All we want here is two numbers bound
			together as one position. The question whether a class needs an
			interface or not must be decided on a case-by-case basis. As
			programmers, we often start out with a simple class with public
			attributes, and as we add more functionality, we see more and more need
			for hiding implementation details.
			</p>

			<h2>Static Members</h2>
			<p>
			Methods are syntactic sugar for conceptually linking functions operating
			on certain types of objects to these objects, or more specifically, to
			their class. Similarly, it can sometimes make sense to link a global
			variable to a class. We do this by making it a variable of the class.
			This is different from making it a variable of each object! A class
			variable exists only once, while a normal attribute exists in each and
			every object of that class. Such a class variable is declared as
			<code>static</code>. We can also make methods static, which means that
			they are not tied to an object, but that we still want them to be tied
			to the class.
			</p>
			<p>
			As an example, consider an array containing all objects of a class. For
			our address book, that would be all the data we need in our application.
			Of course, the array should exist only once, but it is still tightly
			linked to the class Person, since it contains only Person objects. We
			therefore do not make it an attribute of every object, but rather a
			static attribute of the class:
			<tscript>
			class Person
			{
			private:
				var m_first_name;
				var m_last_name;
				var m_phone;
				var m_address;
				var m_email;
				static var m_persons = [];

			public:
				constructor(first, last, phone=null, address=null, email=null)
				{
					m_first_name = first;
					m_last_name = last;
					m_phone = phone;
					m_address = address;
					m_email = email;
					m_persons.push(this);
				}

				function full_name()
				{ return m_first_name + " " + m_last_name; }
				function phone()
				{ return m_phone; }
				function address()
				{ return m_address; }
				function email()
				{ return m_email; }

				function remove()
				{
					for var i in 0:m_persons.size() do
					{
						if m_persons[i] == this then
						{
							m_persons.remove(i);
							break;
						}
					}
				}

				static function all()
				{ return Array(m_persons); }
			}
			</tscript>
			We have made four changes compared to the previous version:
			<ul>
				<li>There is a new variable <code>m_persons</code>, which is
					initialized to an empty array. It works just like a global
					variable, but it is formally inside of the class. It is also
					hidden from view (private).</li>
				<li>Every newly constructed person is added to the array by the
					last line of the constructor.</li>
				<li>The <code>remove</code> method effectively removes a person
					by removing it from the list of all persons.</li>
				<li>The static function <code>all()</code> returns the array
					containing all persons. It actually returns a copy of the
					array, since arrays are mutable, so returning the original array
					would mean that code outside of the class could add things to
					the array which do not belong there (like numbers, objects of
					unrelated type, or other rubbish).</li>
			</ul>
			It is important that the <code>function all()</code> is static.
			Otherwise we would only be able to call it on an object, but it does not
			make sense that we first need to know a person in order to obtain a list
			of all persons. And what do we do if no person is created yet at all?
			The solution is that a static method can be called only with the class,
			and in particular without an object, as follows:
			<tscript>
			var contacts = Person.all();
			</tscript>
			In other words, we still use the dot-syntax, but we put the class name
			left of the dot. Calling the method on an object of class
			<code>Person</code> also works.
			</p>

			<h2>Wrap-up</h2>
			<p>
			The main use of classes is to represent <i>structured data</i>. An
			object is an item with a fixed structure (public attributes), or more
			generally, with a fixed interface (public methods). This interface and
			also its implementation are defined by the corresponding class. Classes
			are data types, so with classes, we have the ability to implement our
			own types.
			</p>
			<p>
			Object-oriented programming is a wide field, and understanding that
			topic properly takes some time. Simply use classes and objects in your
			own programs whenever you see fit, and that is whenever you encounter a
			set of entities which should be described by a fixed set of attributes.
			</p>
			`,
		},
	],
};
