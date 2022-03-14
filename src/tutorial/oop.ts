export const tutorial_oop = {
	id: "oop",
	title: "Object-oriented Programming",
	sections: [
		{
			content: `
			<p>
			Recall how we had previously solved the phone book problem with a
			dictionary. Using names as keys, we have associated a phone number with
			each names. Now let's extend the program to an address book. Next to the
			phone number we would like to store a postal address and an email
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
			most probably have forgotten the significance of the 2. That's not good.
			We can improve by nesting dictionaries:
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
				p.twitter = "bla bla";
				# error: type 'Person' does not have a public member 'twitter'
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
			that data layout at runtime. Of course, we can change the class
			definition, say, by adding an attribute. The good thing is that then all
			persons have that new attribute, so they stay homogeneous.
			</p>

			<h2>Methods</h2>
			<p>
			It turns out that classes can do much more than defining attributes.
			The concept is so powerful that some languages (like Java) are built
			entirely on top of classes. Beyond attributes, the second most useful
			concept of classes are <i>methods</i>. At this point we should get used
			to the fact that in the field called object-oriented programming, there
			are many terms, and many of them already have a name. We have simply
			rebranded a type as a class and a variable as an attribute. Similarly,
			a method is a function.
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
				<li>The method is listed inside of the class body alongside the
					attributes. Attributes and methods are both "contained" in the
					class. Jointly, they are called <i>members</i> of the class.</li>
				<li>A method is called on a function with the dot-operator. This is
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
			We see that it allows up to refer to the attribute "phone" although a
			parameter of the same name exists, which would otherwise shadow the
			attribute.
			</p>
			<p>
			A brief note on name resolution inside of methods: a name is first
			matched with all local variables (including parameters), then with all
			members (attributes and methods), and then with global names (variables,
			functions, classes).
			</p>

			<h2>Visibility</h2>

			<h2>Inheritance</h2>






            With containers we have learnt to deal with much data. But what,
            if we have to handle many instances of inherent information, i.e.
            personal data of employees? We might use an array full of dictionaries
            containing everything but doing so, we hadn't bound inherent data. 
            The concept of object-oriented programming helps us out. Instead of
            using dictionaries we create objects which have specific properties 
            shared by every instance of the object class. Imagine "dog" being an
            object class with every specific dog being an instance of the class.
            Every dog shares specific properties like its name, height, weight, 
            etc. Those properties are variables that every object of a specific 
            class possesses but which's values are different. Besides variables
            classes have so called methods which are functions that specifically 
            operate on objects. Since functions often only work on objects from 
            a specific class, object-oriented programming binds such functions
            to their class. Take the dog-example. Since every dog is able to bark,
            we might have a bark-function, that shall just print "Woof". Such a 
            function would not make any sense to be called without a dog, we 
            therefore model the bark-function to be a method from the dog-class.
            </p>
			`,
		},
		{
			content: `
            <h2>Classes</h2>
            <p>
            To create a class we use the keyword "class", followed up by an 
            identifier. We then create a slope, in which we specify the class'
            properties:
            <tscript>
            class Dog
            {
                public:
                    var name;
                    var height, weight;

                    function bark() {
                        print(name + " woofs!");
                    }
            }
            </tscript>
            We have now created a class Dog with name, height and weight as 
            properties and a function bark() as its method. Don't worry about
            the public-keyword for now. To create an instance of this class,
            a so called object, we call the class by name, followed by two
            brackets. To access an object's values we call the object by name, 
            followed by a dot and the identifier of the value that we want to 
            access:
            <tscript>
            var d = Dog();
            d.name = "Yuma";

            d.bark();           # prints "Yuma woofs!"
            </tscript>
            Note that at this point, the height and weight variables carry the
            null value. We'd first need to assign any meaningful value to them.
            There are properties, every object of a class possesses. To always
            specifically assign values for them with each initialization of an
            object is not only tedious but also error prone. A constructor is
            a method that targets this problem. When initializing a class object
            the constructor is called. You can therefore determine what shall
            happen everytime an object is created. If no constructor is specified, 
            the empty constructor is called which just creates an object of the
            class as in the previous examples. The constructor works like a 
            function, we can hand over as many parameters as we like:
            <tscript>
            class Dog {
                public:
                    var name;
                    var height, weight;

                    constructor(name, height, weight) {
                        this.name = name;
                        this.height = height;
                        this.weight = weight;
                    }

                    function bark() {
                        print(name + " woofs!");
                    }
            }

            var d = Dog("Yuma", 5, 10);
            d.bark();                           # prints "Yuma woofs!"
            </tscript>
            With this constructor we are able to ensure that every property, 
            that might be needed will be initialized at run time. In this example 
            you also encountered the keyword <i>this</i> for the first time. It 
            returns the object, whose function has been called.
            </p>
            <p>
            Everything listed below the <i>public</i>-keyword can be accessed from any-
            where in and outside of the class:
            <tscript>
            class P {
                public:
                    var x = 1;

                    function y() {
                        print(this.x);      # accessable
                    }
            }

            var p = P();
            print(p.x);                     # accessable
            </tscript>
            The opposite to the <i>public</i>- is the <i>private</i>-keyword. <i>Private</i>
            properties and methods are only accessible inside of the class. We are able 
            to encapsulate data that is used for functionality but unintersting outside of 
            the class itself. To still be able to access private values/functions and even
            manipulate private data (if necessary), we create so called getter- and setter-
            functions:
            <tscript>
            class Dog {
                private:
                    var m_name;
                    var m_height, m_weight;

                public:
                    constructor(name, height, weight) {
                        m_name = name;
                        m_height = height;
                        m_weight = weight;
                    }

                    function getName() {
                        return m_name;
                    }

                    function setName(name) {
                        m_name = name;
                    }

                    function bark() {
                        print(m_name + " woofs!");
                    }

            }

            var d = Dog("Yuma", 10, 20);
            d.bark();                       # prints "Yuma woofs!"

            d.setName("Rudolph");
            d.bark();                       # prints "Rudolph woofs!"
            </tscript>
            Note that we cannot access the class' private properties with the <i>this</i>-keyword
            which is why we start the properties' names with an "m_". With getters and setters we 
            are able to proof the validity of the values one tries to assign to the object's properties. 
            </p>
            <div class="tutorial-exercise">
			<p>
            Create a class <i>Animal</i> with a private attribute m_name. Create a public constructor which takes
            a variable name and assigns it to m_name and a function <i>makeNoise()</i> which simply prints
            "<m_name> makes noise!". Don't forget to implement a getter- and setter-method for your private
            properties. Create an object of the class and name it "Ted" and call the makeNoise()-method.
			</p>
			</div>
            `,
			correct: `
            class Animal {
                private:
                    var m_name;
                    
                public:
                    
                    constructor(name) {
                        m_name = name;
                    }
                    
                    function makeNoise() {
                       print(m_name + " makes noise!");
                    }
                     
                    function getName() {
                        return m_name;
                    }
                    
                    function setName(name) {
                        m_name = name;
                    }
            }
            
            var a = Animal("Ted");
            a.makeNoise();`,
			tests: [
				{
					type: "code",
					code: "print(a.getName());",
				},
				{
					type: "code",
					code: 'a.setName("Todd"); a.makeNoise();',
				},
				{
					type: "code",
					code: 'a.m_name = "this should not work";',
				},
				{
					type: "code",
					code: 'var b = Animal("B"); b.makeNoise();',
				},
			],
		},
		{
			content: `
            <h2>Inheritance</h2>
            <p>
            Until now we have grouped together objects with same properties and functions
            as classes. Imagine two classes sharing some similarities without being equal.
            How might we be able to use that to our advantage? The answer is <i>inheritance</i>.
            We build a class with the shared properties and functions and create child classes
            that specify differences. In the last exercise you created a class <i>Animal</i> with its
            name as a property and the <i>makeNoise()</i>-function as a method. If we now want to
            create a class <i>Dog</i>, we can inherit from the <i>Animal</i>-class as every dog
            also has a name and is able to make noises. We might add dog specific attributes as
            race:
            <tscript>
            class Dog : Animal {
                private: 
                    var m_race;
            }
            </tscript>
            The colon can be read as "inherits" as in "class Dog inherits Animal". We still miss
            a constructor in our child class. We do not only want to create a new constructor, though,
            we want to call the parent class constructor and add the assignment for the m_race 
            variable. To do so, we use the keyword <i>super</i>. Calling it gives us the possiblity to
            access propertiers and methods from the parent class:
            <tscript>
            class Dog : Animal {
                private: 
                    var m_race;

                public:
                    constructor(name, race) : super(name) {
                        m_race = race;
                    }
            }

            var d = Dog("Yuma", "Australian Shepherd");
            d.makeNoise();              # prints "Yuma makes noise!"
            </tscript>
            We now called the constructor of the parent class and extended it with functionality to
            assign a value to the m_race parameter. It is not necessary to explicitely assign a value
            to the dog's name, this is done automatically. Furthermore, using the current example 
            classes we wouldn't even be able to assign the dog's name in its constructor - due to
            the m_name variable being private and therefore only accessible from the parent class
            itself. The solution for this (without using the setter-method) is a third visibility 
            type: <i>protected</i>. Variables and methods marked with this keyword are accessible
            to every descendant of the class but still unaccessible from outside of the classes. 
            </p>
            <p>
            Finally, there might be methods that shall work differently for sub- and superclasses
            but need to share a name due to accessibility from outside of the classes. We might want
            the <i>makeNoise()</i>-method to behave differently for every child class of <i>Animal</i>.
            To do so, we simply define the method again in the child class and implement the functionality
            we want to have. This is called overloading as more than one method with the same name exist
            for the class but what happens when we call it, is dependent on the class of the object, we 
            call it on. If we want to extend the functionality instead of completetely overwriting it,
            we can call the parent class method with the <i>super</i>-keyword. 
            <tscript>
            class Dog : Animal {
                private: 
                    var m_race;

                public:
                    constructor(name, race) : super(name) {
                        m_race = race;
                    }

                    function makeNoise() {
                        print(m_name + " woofs!");      # this only works, if m_name is protected or public
                    }
            }
            </tscript>
            </p>
            <div class="tutorial-exercise">
			<p>
            Take the sample solution from the exercise before and copy the class Animal into your editor. Then create a 
            class Cat that inherits the Animal class. Extend its properties with a color variable and extend
            the constructor to initialize it. Don't forget to create getter- and setter-methods. Finally, 
            overload the makeNoise()-function to print "Miau", every time it is called. What needs to be changed
            for the function to be able to access the cat's name?
			</p>
			</div>
            `,
			correct: `
            class Animal {
                private:
                    var m_name;
                    
                public:
                    constructor(name) {
                        m_name = name;
                    }
                    
                    function makeNoise() {
                       print(m_name + " makes noise!");
                    }
                     
                    function getName() {
                        return m_name;
                    }
                    
                    function setName(name) {
                        m_name = name;
                    }
            }
            
            class Cat : Animal {
                private:
                    var m_race;
                
                public:
                    constructor(name, race) : super(name) {
                        m_race = race;
                    }

                    function makeNoise() {
                        print("Miau");
                    }

                    function getRace() {
                        return m_race;
                    }

                    function setRace(race) {
                        m_race = race;
                    }
            }`,
			tests: [
				{
					type: "code",
					code: 'var c = Cat("Karl", "Siamese"); c.makeNoise();',
				},
				{
					type: "code",
					code: 'var c = Cat("Karl", "Simaese"); print(c.getRace());',
				},
				{
					type: "code",
					code: 'var c = Cat("Karl", "Siamese"); c.setRace("Langfell"); print(c.getRace());',
				},
				{
					type: "code",
					code: 'var c = Cat("Karl", "Siamese"); print(c.m_name);',
				},
				{
					type: "code",
					code: 'var c = Cat("Karl", "Siamese"); print(c.getName());',
				},
			],
		},
		{
			content: `
            <h2>Wrap-up</h2>
            <p>
            Classes provide the possibility to create individual data types. They enable you
            to organize related data into objects with same properties and methods. You are 
            even able to create relationships between classes. In practice, classes and 
            inheritment are often used to create functionality that can be extended and
            changed, for example in game development. You might create an enemy object, 
            that summarizes all properties enemies shall have in your game. You then are
            able to extend its functionality through inheritment and create specific kinds of
            enemies. This way you ensure that every enemy has specific generally used 
            properties and methods (i.e. hit points) but are also able to create different 
            kinds of enemies. A neat way to keep track of every enemy of a specific kind
            is to use the <i>static</i> keyword. An as static classified variable can only be 
            instantiated once and is therefore tied to the class not to its objects. If you 
            simply put every object into a static array in the constructor, you can access
            it via the array from every object of the class:
            <tscript>
            class Crawler {
                private:
                    static var allCrawlers = [];
                public:
                    constructor() {
                        allCrawlers.push(this);
                    }
                    
                    static function getAllCrawlers() {
                        return allCrawlers;
                    }
            }
            </tscript>
            </p>
            `,
		},
	],
};
