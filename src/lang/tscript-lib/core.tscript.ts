export const tscript_core = `
class Null
{
public:
	constructor() { }
}

class Boolean
{
public:
	constructor(value) { }
}

class Integer
{
public:
	constructor(value) { }
}

class Real
{
public:
	constructor(value) { }
	function isFinite() { }
	function isInfinite() { }
	function isNan() { }
	static function inf() { }
	static function nan() { }
}

class String
{
public:
	constructor(value) { }
	function size() { }
	function find(searchterm, start = 0, backward = false) { }
	function split(separator) { }
	function toLowerCase() { }
	function toUpperCase() { }
	function replace(pattern, replacement) { }
	static function fromUnicode(characters) { }
	static function join(array, separator = "") { }
}

class Array
{
public:
	constructor(size_or_other, value = null) { }
	function size() { }
	function push(item) { }
	function pop() { }
	function insert(position, item) { }
	function remove(range) { }
	function slice(start, end) { }
	function sort(comparator = null) { }
	function keys() { }
	function values() { }
	static function concat(first, second) { }
}

class Dictionary
{
public:
	constructor(other) { }
	function size() { }
	function has(key) { }
	function remove(key) { }
	function keys() { }
	function values() { }
	static function merge(first, second) { }
}

class Function
{
public:
	constructor(value) { }
}

class Range
{
public:
	constructor(begin, end) { }
	function size() { }
	function begin() { }
	function end() { }
}

class Type
{
public:
	constructor(value) { }
	static function superclass(type) { }
	static function isOfType(value, type) { }
	static function isDerivedFrom(subclass, superclass) { }
}

function terminate() { }
function assert(condition, message = "") { }
function error(message) { }
function same(first, second) { }
function version() { }
function print(text) { }
function alert(text) { }
function confirm(text) { }
function prompt(text) { }
function wait(milliseconds) { }
function time() { }
function localtime() { }
function setEventHandler(event, handler) { }
function enterEventMode() { }
function quitEventMode(result = null) { }
function exists(key) { }
function load(key) { }
function save(key, value) { }
function listKeys(){}
function deepcopy(value) { }
`;
