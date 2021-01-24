import { doc_cheatsheet } from "./def-cheatsheet";
import { doc_concepts } from "./def-concepts";
import { doc_errors } from "./def-errors";
import { doc_examples } from "./def-examples";
import { doc_ide } from "./def-ide";
import { doc_language } from "./def-language";
import { doc_legal } from "./def-legal";
import { doc_stdlib } from "./def-stdlib";

export type Documentation = _Documentation | ErrorDocumentation;

interface _Documentation{
	id:string;
	content:string;
	name:string;
	title:string;
	children: Array<Documentation>;
}

interface ErrorDocumentation{
	id:string;
	content:string;
	children: Array<Documentation>;
}


let doc:Documentation = { 
	"id": "", 
	"name": "TScript Documentation", 
	"title": "TScript Documentation",
	 "children": new Array(), 
	 "content":
`
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
Being a reference documentation, this collection of documents is not
designed for being read front to end, but rather as a resource for
looking up information. For programmers experienced with other
programming languages, the section
<a href="?doc#/concepts">core concepts</a> is a good starting point, the
<a href="?doc#/cheatsheet">cheat sheet</a> provides the most
important bits in compact form, and for the impatient there are a few
<a href="?doc#/examples">examples</a>.
</p>
`
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