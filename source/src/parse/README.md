# Parser

The parser consists of a number of free functions.
Functions starting with "parse_" alter the parser state.
These functions return the program element they created.
They throw an exception on error. The only purpose of
the exception is to interrupt the control flow; the
actual error message is stored in the state object.

deep copy of a JSON-like data structure
Locate the parent of the program element to which a given name
refers. Report an error if the name cannot be resolved.
The actual program element is returnvalue.names[name].