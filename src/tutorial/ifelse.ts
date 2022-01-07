export const tutorial_ifelse = {
	id: "ifelse",
	title: "Conditions in Programming",
	sections: [
		{
			content: `
			<p>
            Often while programming you only want to execute something
            until or if a certain condition is met. Until now you 
            have got to know number and text datatypes. The boolean
            datatype is a datatype to represent truth values only being
            able to adopt <i>true</i> and <i>false</i>. 
            <tscript>
                var x = true;
                var y = false;
            </tscript>
            Often a boolean isn't even saved as a variable but only checked
            at runtime. For example, we might work with randomly generated
            numbers and only want to execute code B if a certain condition
            is met for the randomly generated numbers. To be able to do so,
            we use control structures, namely if-else-ramifications. The 
            keyword <i>if</i> tells the program that a certain condition 
            has to be evaluated - if it evaluates to <i>true</i>, the following
            code will be executed, otherwise it will be skipped. If an 
            <i>else</i>-keyword directly follows the <i>if</i>-statement and
            the intial condition evaluated to false, the code belonging to the 
            <i>else</i>-statement is executed. 
            <tscript>
            if (<i>condition</i>)
                then print("success!");
            else 
                print("failure!");
            </tscript>
            If we want to execute more than one statement, we use scopes:
            <tscript>
            if (<i>condition</i>)
                then {
                    print("first statement");
                    print("second statement");
                    print("third statement");
                }
            else {
                print("first alternative statement");
                print("second alternative statement");
            }
            </tscript>
            It is good practice to always use scopes, even for just one 
            statement following the <i>if</i>- or <i>else</i>-keywords.
            Then the first example will look like this:
            <tscript>
            if (<i>condition</i>)
                then {
                    print("success!");
                }
            else {
                print("failure!");
            }
            </tscript>
            </p>
			`
		},
        {
            content:`
            <h2>Comparisons</h2>
            <p>
            You have seen how if-else-ramifications look like but we haven't
            covered, how exactly you'd create conditions to evaluate. Most often
            we compare values and execute following code if two values are equal
            or one is greater or less than the other. To do so, we use so called 
            relational operators. There exist<br>
            <div class ="code">
            == - equality operator <br>
            != - inequality operator <br>
            <  - less than operator <br>
            <= - less equal than operator<br> 
            >  - greater than operator <br>
            >= - greater equal than operator <br>
            </div><br>
            If we now have a variable x and want to execute Code B, if x is greater 
            equal than 0.5, it would look like this:
            <tscript>
            if (x >= 0.5)
                then {
                    print("success!");
                }
            else {
                print("failure!");
            }
            </tscript>
            Every value can be compared on (in)equality but only strings and numbers
            can be relationally compared. Strings are compared with the lexicographical
            order underlying. 
            </p>
            <p>
            Besides relational there also exist logical comparison operators. Together
            with boolean values they can form logical statements. The following operators
            exist:<br>
            <div class ="code">
            not - true if following boolean value is false <br>
            and - true if leading <i>and</i> following boolean values are true <br>
            or  - true if leading <i>or</i> following boolean value is true <br>
            xor - <i>only</i> true if leading <i>or</i> following boolean value is true<br>
            </div><br>
            As the <i>and</i>-, <i>or</i>- and <i>xor</i>-operators suggest, it is possible 
            to connect two boolean values with logical operators (and (in)equality operators)
            which results in a new boolean value. Furthermore, it's possible to string together
            any number of boolean values as you want. With parenthesis you are able to determine
            the order at which the logical statements are evaluated. A small, non-practical example
            for this is the following code:
            <tscript>
                if (not true and false)
                    then { print("success!"); }         # this will not be printed

                if (not (true and false))
                    then { print("success!"); }         # this will be printed
            </tscript>
            In the first case the first and second boolean statement evaluate to false. With the 
            <i>and</i>-operator the whole statement evaluates to false. In the second case the inner
            statement is evaluated first. With the <i>and</i>-operator the inner statement evaluates 
            to false. Finally the <i>not</i>-operator flips the false to be true and therefore the
            second print is executed. 
            </p>                                                                                  <!-- kann man hier überhaupt sinnvoll Aufgaben stellen? -->
            <div class="tutorial-exercise">
			<p>
			Create a prompt that asks for a random letter. You don't have to worry about the user inputting
            a wrong data type. If the letter is an 'a' or a 'z', print the letter itself. Else, print
            'Hello World!'.
			</p>
			</div>
            `,
            correct: `
            var s = prompt("Please input a random letter");
            if (s == "a" or s == "z") then print(s);
            else print("Hello World!");
            `,
            tests: [
                {
                    "type": "code",
                    "code": "",
                    "input": ["a"],
                },
                {
                    "type": "code",
                    "code": "",
                    "input": ["aa"],
                },
                {
                    "type": "code",
                    "code": "",
                    "input": ["z"],
                },
                {
                    "type": "code",
                    "code": "",
                    "input": ["zz"],
                },
                {
                    "type": "code",
                    "code": "",
                    "input": [""],
                },
                {
                    "type": "code",
                    "code": "",
                    "input": ["c"],
                }
            ]
        },
        {
            content: `
            <h2>Wrap-up</h2>
            <p>
            The if-else-control structure is a way to make decisions which code shall be executed 
            under certain conditions. Boolean statements are evaluated to be true or false and 
            decide if the code behind the <i>if</i>-statement is executed. It is possible to string
            together as many boolean values as you'd like using logical and (some) relational operators.
            </p>
            `
        }
	]
};