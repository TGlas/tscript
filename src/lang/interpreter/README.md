# Interpreter

The "interpreter" class executes a parsed program.

The interpreter is built around a call stack. This stack
contains one frame per function, which holds the state
consisting of instruction pointer (ip) and the values of
all local variables. The bottom-most frame is the global
scope, holding the global variables.
Each frame holds stacks for pe (program element), ip
(instruction pointer), temporaries, and an array of
variables. The pe and ip stacks are always in sync, the
ip index refers to a position within the corresponding
pe. The temporary stack stores all temporary values. For
calls to non-static methods, the frame contains a field
for the object in addition.
