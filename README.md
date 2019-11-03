# TScript
This is the reference implementation of the TScript ("teaching-script")
programming language.

## Getting Started
TScript comes as a single html file. It does not require installation.
Simply open the file in a modern browser and you are ready to go.
[Click here for a quick test.](https://tglas.github.io/tscript/distribution/index.html){:target="_blank"}
For more serious use it is recommended to store the page in your local
file system &mdash; use "save link as" (or similar) from the context
menu.

TScript comes with a complete integrated development environment (IDE).
You can start programming straight away in the source code editor on
the left. Documentation is also built-in - try the Documentation button
on the right of the toolbar.

## Example Programs
In TScript, "hello world" is a one-liner:
```
print("Hello World");
```
For proper example code have a look at the [examples](https://github.com/TGlas/tscript/tree/master/examples)
directory. Demos of the examples:
```html
<table><tr>
<td width="33%">
<ul>
<li><a target="demoframe" href="https://tglas.github.io/tscript/examples/demos/snowflake.html">turtle graphics: snowflake</a></li>
<li><a target="demoframe" href="https://tglas.github.io/tscript/examples/demos/gameoflife.html">canvas graphics: game of life</a></li>
<li><a target="demoframe" href="https://tglas.github.io/tscript/examples/demos/cube3D.html">canvas graphics: 3D cube</a></li>
</ul>
</td>
<td width="66%">
<div style="position: relative;  width: 100%; padding-top: 100%; background: #aaa;">
<iframe name="demoframe"></iframe>
</div>
</td>
</tr></table>
```

## Testing
If something does not work as expected then please run the
[unit tests](https://tglas.github.io/tscript/source/unittest.html){:target="_blank"}
in your browser. If a test should fail then please
[report a bug](https://github.com/TGlas/tscript/issues){:target="_blank"}.

## Author
TScript is developed by Tobias Glasmachers.

## License
This project is licensed under the MIT License - see the
[LICENSE](LICENSE){:target="_blank"} file for details.

## Acknowledgments
The TScript IDE uses [CodeMirror](https://codemirror.net/){:target="_blank"}
and [interact](https://interactjs.io/){:target="_blank"}.
