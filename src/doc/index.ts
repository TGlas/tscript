import { doc_cheatsheet } from "./cheatsheet";
import { doc_concepts } from "./concepts";
import { doc_errors } from "./errors";
import { doc_examples } from "./examples";
import { doc_ide } from "./ide";
import { doc_language } from "./language";
import { doc_legal } from "./legal";
import { doc_stdlib } from "./stdlib";

export type Documentation = _Documentation | ErrorDocumentation;

interface _Documentation {
	id: string;
	content: string;
	name: string;
	title: string;
	children: Array<Documentation>;
}

interface ErrorDocumentation {
	id: string;
	content: string;
	children: Array<Documentation>;
}

let doc: Documentation = {
	id: "",
	name: "TScript Documentation",
	title: "TScript Documentation",
	children: new Array(),
	content: `
<p>
Welcome to TScript!
</p>
<p>
TScript (&quot;teaching-script&quot;) is a programming language created
specifically for programming beginners. Its clean design yields a smooth
learning experience. It offers simple graphics manipulation
environments, which greatly boost motivation and stimulate a playful and
explorative learning style.
</p>
<h2>Overview</h2>
<p>
The ideal entry point for a programming beginner is the tutorial. In the
development environment, locate the blackboard icon
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABHNCSVQICAgIfAhkiAAAAXtJREFUOI3FlM1qwkAUhc9oghaniKgELAlqKYVGXEiXblz0OXyMPkMfI8/RhRvJzk0JhRLalFl0EWqrQWhUNF2I4mQ0TU2lZ5c5537c+bkBiRCl9BQHikSahJDBYLC0LItbbzQaaLVakbXSNiRsUkqpbdu4LlnIyCvbny1h2Zn4Hfd6vYAxJgReX55QLUz4tU+Kav1SyGqahk6nQ7iOGWNoVx6FcLsCACf8GhYAxGx/qy8pbJ7f3AkFcfR8f8t9pw6ixNBecBAExwETQhLB/+codjzt5OAk0EhwUh0NLAxI+KEnBmuathnJ4XCI7MxBLkvgvMuoXTS5Isd+QK00x+RriWmmjmKxuGGstfOGDMMI1v+N/tsVut0u+Y0P7Dnj6cgBALijBRRFEXxFUeCOFlw2FjiLDwAAc+dQVVXwVVUFc+dc9kewaZpBOZ8GAIx9GbquC9vUdZ2MfRkAUM6nYZqmMPsC2PM8FOjqTlO5s53dbHsFKsHzvL25P9c3ZS94XuDLwyoAAAAASUVORK5CYII="/>
in the toolbar. It opens the tutorial panel. The tutorial is not part of
this documentation; instead, it is tightly integrated into the
programming environment.
</p>
<p>
Being a reference documentation, this collection of documents is not
designed for being read front to end, but rather as a resource for
looking up information. For programmers experienced with other
programming languages, the section
<a href="?doc=/concepts">core concepts</a> is a good starting point, the
<a href="?doc=/cheatsheet">cheat sheet</a> provides the most
important bits in compact form, and for the impatient there are a few
<a href="?doc=/examples">examples</a>.
</p>
`,
};

doc.children.push(doc_concepts);
doc.children.push(doc_ide);
doc.children.push(doc_language);
doc.children.push(doc_stdlib);
doc.children.push(doc_examples);
doc.children.push(doc_errors);
doc.children.push(doc_cheatsheet);
doc.children.push(doc_legal);

export const documentationData = doc;
