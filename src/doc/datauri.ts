import { Documentation } from ".";

export const doc_data_uri: Documentation = {
	id: "dataURI",
	name: "Resource to Data URI Converter",
	title: "Resource to Data URI Converter",
	content: `
	<p>
	This tool converts resource files (image and sound data) into
	<a target="_blank" href="https://en.wikipedia.org/wiki/Data_URI_scheme">data URIs</a>
	as they are used with <code>canvas.Image</code> and <code>audio.Sound</code> objects.
	</p>

	<h2>Input File</h2>
	<div style="font-family: monospace; background: #eee; border: 1px solid #aaa; padding: 5px;">
	<div><label for="png" >PNG&nbsp; image file </label><input style="margin: 3px 20px; background: #fff;" type="file" id="png" accept="image/png"  onchange="let mime = event.target.accept; let file = event.target.files[0]; let reader = new FileReader(); reader.onloadend = () => { if (reader.result.substring(0, 5) === 'data:') document.getElementById('output').value = reader.result; else document.getElementById('output').value = 'data:' + mime + ';base64,' + reader.result; }; reader.readAsDataURL(file);"/></div>
	<div><label for="jpeg">JPEG image file </label><input style="margin: 3px 20px; background: #fff;" type="file" id="jpeg" accept="image/jpeg"     onchange="let mime = event.target.accept; let file = event.target.files[0]; let reader = new FileReader(); reader.onloadend = () => { if (reader.result.substring(0, 5) === 'data:') document.getElementById('output').value = reader.result; else document.getElementById('output').value = 'data:' + mime + ';base64,' + reader.result; }; reader.readAsDataURL(file);"/></div>
	<div><label for="webp">WEBP image file </label><input style="margin: 3px 20px; background: #fff;" type="file" id="webp" accept="image/webp"     onchange="let mime = event.target.accept; let file = event.target.files[0]; let reader = new FileReader(); reader.onloadend = () => { if (reader.result.substring(0, 5) === 'data:') document.getElementById('output').value = reader.result; else document.getElementById('output').value = 'data:' + mime + ';base64,' + reader.result; }; reader.readAsDataURL(file);"/></div>
	<div><label for="mp3" >MP3&nbsp; audio file </label><input style="margin: 3px 20px; background: #fff;" type="file" id="mp3" accept="audio/mpeg" onchange="let mime = event.target.accept; let file = event.target.files[0]; let reader = new FileReader(); reader.onloadend = () => { if (reader.result.substring(0, 5) === 'data:') document.getElementById('output').value = reader.result; else document.getElementById('output').value = 'data:' + mime + ';base64,' + reader.result; }; reader.readAsDataURL(file);"/></div>
	<div><label for="aac" >AAC&nbsp; audio file </label><input style="margin: 3px 20px; background: #fff;" type="file" id="aac" accept="audio/aac"  onchange="let mime = event.target.accept; let file = event.target.files[0]; let reader = new FileReader(); reader.onloadend = () => { if (reader.result.substring(0, 5) === 'data:') document.getElementById('output').value = reader.result; else document.getElementById('output').value = 'data:' + mime + ';base64,' + reader.result; }; reader.readAsDataURL(file);"/></div>
	<div><label for="webm">WEBM audio file </label><input style="margin: 3px 20px; background: #fff;" type="file" id="webm" accept="audio/webm"     onchange="let mime = event.target.accept; let file = event.target.files[0]; let reader = new FileReader(); reader.onloadend = () => { if (reader.result.substring(0, 5) === 'data:') document.getElementById('output').value = reader.result; else document.getElementById('output').value = 'data:' + mime + ';base64,' + reader.result; }; reader.readAsDataURL(file);"/></div>
	</div>
	<h2>Output String</h2>
	<textarea id="output" style="font-family: monospace; margin: 10px 0; width: calc(100% - 40px); height: 10vh; background: #eee; border: 1px solid #aaa; padding: 5px; overflow: auto; resize: vertical;"></textarea>
	<div>
	<button id="copy" style="padding: 5px 10px;" onclick="let textarea = document.getElementById('output'); if (navigator.clipboard) { navigator.clipboard.writeText(textarea.value); } else { textarea.focus(); textarea.select(); document.execCommand("copy"); }">copy to clipboard</button>
	<button id="clear" style="padding: 5px 10px;" onclick="document.getElementById("output").value = '';">clear</button>
	</div>
`,
	children: [],
};
