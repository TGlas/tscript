export const tutorial_oop = {
	id: "oop",
	title: "Object-oriented Programming",
	sections: [
		{
			content: `
			<p>
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
			`
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
            Create a class Animal with a private attribute m_name. Create a public constructor which takes
            a variable name and assigns it to m_name and a function makeNoise() which simply prints
            "<m_name> makes noise!". Don't forget to implement a getter- and setter-method for your private
            properties. Create an object of the class and name it "Ted". Call the makeNoise()-method, 
            print the current name of the object, change the name to "Todd" and finally call the 
            makeNoise()-method again.
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
            a.makeNoise();
            print(a.getName());
            a.setName("Todd");
            a.makeNoise();`
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
            for the function to be able to print the cat's name?
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
            }`
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
            `
        }
	]
};