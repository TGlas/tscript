# Parser

The parser consists of a number of free functions.
Functions starting with "parse\_" alter the parser state.
These functions return the program element they created.
They throw an exception on error. The only purpose of
the exception is to interrupt the control flow; the
actual error message is stored in the state object.
