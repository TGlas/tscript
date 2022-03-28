export const tutorial_inheritance = {
	id: "inheritance",
	title: "Inheritance",
	sections: [
		{
			content: `
			<p>
			In the previous unit we have learned about classes. With classes, we are
			able to define our own data types. Such a type could be quite similar to
			a built-in type. For example, we could use a class to represent rational
			numbers, also called fractions (like 4/7), as tuples of numerator and
			denominator.
			However, most classes are not like that. They represent more complex
			entities in a program, which often correspond to objects in the real
			world. We used <code>class Person</code> as an example, with objects
			representing Alice, Bob, and Charlie.
			</p>
			<p>
			In the real world, categories tend to form hierarchies. For example, an
			employee is a person, and so is a customer (assuming end customers). The
			concepts of "employee" and "customer" are both specializations of the
			general category "person". They can be specialized further, all the way
			down to an individual, which is usually represented as an object, not a
			category.
			</p>
			<p>
			The same holds true for other things we may wish to manage, like goods
			we offer for sale in our website's shop. Assume that we sell furniture.
			There are different types of furniture, like tables, chairs, wardrobes,
			shelves, beds, even whole kitchens composed of several types of quite
			specialized cabinets, and so on. Depending on the type of furniture, the
			different pieces have different properties, which shall be represented
			as attributes in our system. Every piece of furniture has a name, an
			overall size (with dimensions width, height, depth), a weight, and a
			price. That's easy:
			<tscript>
			class Furniture
			{
			public:
				constructor(name, width, height, depth, weight, price)
				{
					m_name = name;
					m_width = width; m_height = height; m_depth = depth;
					m_weight = weight;
					m_price = price;
				}

				function name() { return m_name; }
				function size() { return [m_width, m_height, m_depth]; }
				function weight() { return m_weight; }
				function price() { return m_price; }
				function description()
				{
					return m_name + ", size " + m_width + "x" + m_height + "x" + m_width
						+ ", weight " + m_weight + "kg, $" + m_price;
				}

			private:
				var m_name;
				var m_width, m_height, m_depth;
				var m_weight;
				var m_price;
			}
			</tscript>
			We can now create a piece of furniture (an object) and output its
			description:
			<tscript>
				var chair = Furniture("Solo", 48, 102, 55, 12.5, 69.95);
				print(chair.description());
			</tscript>
			This will print the following message:
			<pre>Solo, size 48x102x48, weight 12.5kg, $69.95</pre>
			</p>
			<p>
			Furniture also has a type, like "chair", "bed" or "cupboard". However,
			further properties like the number of compartments of a closet and the
			size of the mattress of a bed (say, king size or queen size in the US
			system) make sense only if the furniture is of a certain type. So, how
			to represent this data in our class? Should the class contain an
			attribute <code>m_mattress_size</code> or rather not? If the object is
			not a bed, then should that attribute simply be <code>null</code>?
			</p>

			<h2>Specialization</h2>
			<p>
			The answer is that the furniture class should <i>not</i> contain that
			attribute. It should only include attributes that make sense for all
			furniture. Instead, there should be a second class, which we may call
			<code>Bed</code>, and that class shall indeed contain the attribute.
			The category "bed" is a specialization of the category "furniture". We
			will do exactly the same with the corresponding classes representing the
			categories: we will create a class <code>Bed</code> which
			<i>specializes</i> the class <code>Furniture</code>:
			<tscript>
			class Bed : Furniture
			{
			public:
				constructor(name, width, height, depth, weight, price, mattress_size)
				: super(name, width, height, depth, weight, price)
				{
					m_mattress_size = mattress_size;
				}

				function mattress_size() { return m_mattress_size; }

			private:
				var m_mattress_size;
			}
			</tscript>
			Let's go through this construction step by step:
			<ul>
				<li>After the class name <code>Bed</code>, we have used a colon and
					the name of the general class <code>Furniture</code> which we
					specialize. In this context, Bed is called the subclass, and
					Furniture is called the superclass. This tells TScript: please
					copy everything from the super class into this class, so we do
					not need to repeat it here.</li>
				<li>Because all members from <code>class Furniture</code> were
					copied, we only need to write down in which aspects a bed
					differs from general furniture. This usually means adding a few
					things, in particular the attributes that make sense only for
					the more specialized concept. We therefore add the attribute
					<code>m_mattress_size</code> and a corresponding getter.</li>
				<li>The constructor takes a special form. Like in the superclass
					definition, we use a colon to denote that we wish to defer part
					of the job to the superclass. Since every bed is a piece of
					furniture, and since furniture already has a constructor for
					initializing its attributes, it makes sense to let that existing
					constructor do its part of the initialization work. This is done
					with the <code>super</code> syntax. It simply calls the
					constructor of the superclass. Inside of the function body of
					the constructor we initialize the additional attributes.</li>
			</ul>
			The process of copying all members from the superclass is called
			inheritance. We say that Bed is a subclass of Furniture, Furniture is
			the superclass (or base class) of Bed, and Bed inherits Furniture. The
			last statement is interesting. What we really mean is that the class Bed
			inherits all members of Furniture, so it also inherits its public
			interface. As we can see, the subclass is free to extend the interface,
			here by adding an additional getter.
			</p>
			<p>
			On the level of objects, this means that every object of type Bed has
			seven attributes. Six thereof are inherited from class Furniture, and
			one is added by class Bed. Since the object has all properties of class
			Furniture, is actually <i>is</i> a piece of furniture. In particular,
			code that operates on the public interface of <code>Furniture</code>
			works flawlessly on an object of type <code>Bed</code>. What sounds like
			a pretty trivial statement is really a general guideline: inheritance in
			software is meant to represent <i>is a</i> relations in the real world.
			If you can say than every A is a B, then in software, it most probably
			makes sense to model A and B as classes, where B is the superclass and A
			is the subclass.
			</p>
			<p>
			If we had a shop selling only beds then the above construction would be
			rather meaningless, and we could equally well have used a single class
			<code>Bed</code> containing the more general properties from the start.
			If we also sell other types of furniture, then we will need to add more
			subclasses like Table, Wardrobe, Shelf and so on, each of which adds
			their own attributes and their own public interface methods. They all
			share a common base class. Like for real-world concepts, we can design
			a whole hierarchy of classes. For example, there may be different
			sub-types of wardrobes, and even the superclass Furniture may inherit a
			more general <code>class Product</code>. This way, classes naturally
			form a tree structure.
			</p>

			<div class="tutorial-exercise">
			<p>
			Recall <code>class Animal</code> from the previous unit:
			<tscript>
			class Animal
			{
			public:
				function greet()
				{ print("Hello, my name is " + m_name + "!"); }

				constructor(name)
				{ m_name = name; }

				function name()
				{ return m_name; }

			private:
				var m_name;
			}
			</tscript>
			Copy this class into the editor. Then create a subclass
			<code>Dog</code>. The subclass should add a new private attribute
			<code>m_breed</code>, a second parameter in the constructor to set the
			breed, and a getter <code>function breed</code>. You should test your
			code by creating a dog and printing its name and its breed.
			</p>
			</div>
			`,
			correct: `
			class Animal
			{
			public:
				function greet()
				{ print("Hello, my name is " + m_name + "!"); }

				constructor(name)
				{ m_name = name; }

				function name()
				{ return m_name; }

			private:
				var m_name;
			}

			class Dog : Animal
			{
			public:
				constructor(name, breed)
				: super(name)
				{ m_breed = breed; }

				function breed()
				{ return m_breed; }

			private:
				var m_breed;
			}`,
			tests: [
				{
					type: "code",
					code: `var d = Dog("Bella", "Terrier"); alert(d.name()); alert(d.breed());`,
				},
			],
		},
		{
			content: `
			<h3>Overriding Superclass Behavior</h3>
			<p>
			Subclasses cannot only extend the interface of the base class, they can
			also alter the behavior. To see why that makes sense, let's create a
			nice bed:
			<tscript>
				var someBed = Bed("Sweet Dreams", 209, 199, 72, 115, 999, "king size");
				print(someBed.description());
			</tscript>
			We obtain the following description:
			<pre>Sweet Dreams, size 209x199x209, weight 115kg, $999</pre>
			This description neither tells us that we are looking at a bed, nor
			which mattress size we have. This calls for an improvement. For beds, we
			would like to see a more specialized description. This is achieved by
			<i>overriding</i> the <code>description</code> method of the super
			class. Inside of class Bed we add the following public method:
			<tscript>
				function description()
				{
					var dim = size();
					return "Bed '" + name()
						+ "', size " + dim[0] + "x" + dim[1] + "x" + dim[2]
						+ ", " + m_mattress_size + " mattress, weight "
						+ weight() + "kg, $" + price();
				}
			</tscript>
			Calling the same code as above, we now get the following message:
			<pre>Bed 'Sweet Dreams', size 209x199x72, king size mattress, weight 115kg, $999</pre>
			That's much better. How did that work? The class <code>Bed</code> now
			has two methods called <code>description</code>, on inherited from the
			super class and one own function. However, that does not cause a name
			collision. Instead, the method defined in the subclass overrides the
			one defined in the superclass. Calling the method's name on an object of
			type Bed always calls the more specialized method of the subclass.
			Imagine a second subclass <code>Table</code> which decides not to
			override the method, because it is not in need of a more specific
			description. Then, for an object of type Table, the method of the
			superclass is invoked.
			</p>
			<p>
			The mechanism is similar to what happens in the constructor. The
			constructor of the subclass first calls the constructor of the
			superclass and then runs its own function body. However, this case the
			description method of the superclass does not run at all. Sometimes it
			does already most of the job, so we may wish to use it. This works with
			the keyword <code>super</code>. Here is an alternative implementation:
			<tscript>
				function description()
				{
					var dim = size();
					return "Bed " + super.description()
						+ ", " + m_mattress_size + " mattress";
				}
			</tscript>
			It yields
			<pre>Bed Sweet Dreams, size 209x199x209, weight 115kg, $999, king size mattress</pre>
			</p>

			<div class="tutorial-exercise">
			<p>
			We continue the animal example from above.
			<tscript>
			class Animal
			{
			public:
				function greet()
				{ print("Hello, my name is " + m_name + "!"); }

				constructor(name)
				{ m_name = name; }

				function name()
				{ return m_name; }

			private:
				var m_name;
			}

			class Dog : Animal
			{
			public:
				constructor(name, breed)
				: super(name)
				{ m_breed = breed; }

				function breed()
				{ return m_breed; }

			private:
				var m_breed;
			}
			</tscript>
			In class Dog, override the <code>greet</code> method of the superclass
			so that a golden retriever called Luca greets with the following message:
			<pre>Woof! I am a golden retriever any my name is Luca!</pre>
			</p>
			</div>
			`,
			correct: `
			class Animal
			{
			public:
				function greet()
				{ print("Hello, my name is " + m_name + "!"); }

				constructor(name)
				{ m_name = name; }

				function name()
				{ return m_name; }

			private:
				var m_name;
			}

			class Dog : Animal
			{
			public:
				constructor(name, breed)
				: super(name)
				{ m_breed = breed; }

				function breed()
				{ return m_breed; }

				function greet()
				{ print("Woof! I am a " + breed() + " and my name is " + name() + "!"); }

			private:
				var m_breed;
			}`,
			tests: [
				{
					type: "code",
					code: `var d = Dog("Bella", "Terrier"); alert(d.name()); alert(d.breed()); d.greet();`,
				},
			],
		},
		{
			content: `
			<h2>A Second Interface</h2>
			<p>
			Notice that the implementation of the method <code>description</code> of
			the subclass <code>Bed</code> uses only the public interface of
			<code>class Furniture</code>. Indeed, it does not have access to its
			internals, like the attribute <code>m_name</code>, since access is
			restricted to code inside of the superclass. At times, that can be quite
			inconvenient. A subclass may need access to internals. We can then
			extend the public interface, but that gives everyone more access, which
			is not what we want.
			</p>
			<p>
			Since giving extra power to subclasses is a common demand, object
			oriented programming offers a solution to that problem. It comes in the
			form of a new visibility specified, called <code>protected</code>. A
			protected member is invisible to code using the class, like a private
			member. However, it is visible from within a subclass (and the
			subclasses thereof), like a public member. The following table
			summarizes the effects of the three visibilities:
			</p>
			<p>
				<table class="nicetable">
					<tr><th>visibility</th><th>public</th><th>protected</th><th>private</th></tr>
					<tr><th>within the class</th><td>yes</td><td>yes</td><td>yes</td></tr>
					<tr><th>within subclasses</th><td>yes</td><td>yes</td><td>no</td></tr>
					<tr><th>everywhere</th><td>yes</td><td>no</td><td>no</td></tr>
				</table>
			</p>
			<p>
			A class effectively defines two interfaces: a public interface for
			general use, and an extended interface for use only by subclasses,
			intended to extend the class. The interface for subclasses consists of
			all public and protected methods. For example, we may decide that all
			subclasses get direct access to all attributes. This can be done by
			making all attributes protected. That's usually not a good idea though.
			Instead, we should keep interfaces minimal and stable, since exposing
			implementation details to subclasses bears the same problems in
			principle as exposing them to the public.
			</p>

			<h3>Communication between superclass and subclass</h3>
			<p>
			By means of protected members, a subclass gets a direct channel for
			"talking" to its superclass (by invoking methods). Sometimes there is
			also a need for doing things the other way round. Say, we would like to
			add a method <code>function html()</code> to class Furniture, which
			creates an html snippet for our website. We could implement a basic
			version of that function and override it in each subclass. However, that
			would be a duplication of efforts, since we already have a description
			method for that purpose.
			</p>
			<p>
			Instead, we decide that the <code>html()</code> method should wrap the
			already existing description and present it as html code. We will not
			go into the details of how to do this properly (i.e., replace special
			html characters), but simply wrap the description in a paragraph tag
			with CSS class "description" so that it can be styled as we wish. The
			html function in the superclass could look like this:
			<tscript>
				function html()
				{
					return "<p class=\\"description\\">"
						+ description()
						+ "</p>";
				}
			</tscript>
			However, to our surprise, it outputs the following message:
			<pre>&lt;p class="description">Sweet Dreams, size 209x199x209, weight 115kg, $999&lt;/p></pre>
			Where is the mattress size? For some reason, the superclass method
			<code>description</code> was called, not the subclass method. Somehow,
			the communication from superclass down to the subclass did not work out
			as intended. The reason is that the name <code>description</code> is
			looked up <i>statically</i>, and it is found inside of the class, so the
			corresponding method is called. But what we want here is to call the
			method of the same name in the subclass. This requires a <i>dynamic</i>
			name lookup, and that's a lookup at runtime. It is only at runtime that
			function <code>html()</code> can know that the object it is called upon
			is of type Bed, and not of type Table, Wardrobe or whatever.
			</p>
			<p>
			Dynamic lookup is exactly what is performed by the dot-syntax. That's
			also why in our previous examples the correct function was called. The
			solution is therefore to invoke <code>description()</code> using the
			dot-syntax inside of the <code>html()</code> method:
			<tscript>
				function html()
				{
					return "<p class=\\"description\\">"
						+ this.description()
						+ "</p>";
				}
			</tscript>
			We obtain the correct html:
			<pre>&lt;p class="description">Bed 'Sweet Dreams', size 209x199x72, king size mattress, weight 115kg, $999&lt;/p></pre>
			</p>
			<p>
			In short: subclasses can call public methods of superclasses. In
			addition a subclass can provide them an additional interface in the form
			of <code>protected</code> members. When communicating the other way
			round, which means that the superclass aims to call a method overridden
			by a subclass, a public member called with the dot-syntax does the job.
			</p>

			<h2>Composition of Objects</h2>
			<p>
			Beyond inheritance representing <i>is a</i> relationships (hierarchy),
			objects often form other relations like <i>consists of</i> or similar
			types of links, often between objects of unrelated class. For example, a
			shopping cart object may refer to a whole list of furniture. That does
			not mean that <code>class ShoppingCart</code> and <code>class
			Furniture</code> have a formal relation in term of inheritance. The
			shopping cart will most likely simply have an attribute holding an array
			of furniture. In software engineering, such relations are often looked
			at together, forming complex diagrams. However, in terms of programming
			language support, the inheritance relation is special, in that it
			requires quite a bit of machinery, while other relations like
			composition are naturally expressed simply by managing attributes.
			</p>

			<h2>Wrap-up</h2>
			<p>
			Inheritance allows to represent hierarchical relations of categories.
			A class represents all objects of a category, and its superclass
			represents the objects of a more abstract category. Modeling objects of
			the real world like this is the core idea of object oriented
			programming.
			</p>
			<p>
			Inheritance represents an <i>is a</i> relationship. It is realized by
			simply copying all members of the superclass into the subclass. This
			avoids code duplication and it is quite flexible, since the subclass can
			extend the interface of the superclass. It can even alter its behavior
			by overriding methods, which helps to specialize categories in a
			meaningful way. Finally, we have seen how classes can communicate along
			the class hierarchy by overriding methods and calling these overrides
			dynamically at runtime.
			</p>
			`,
		},
	],
};
