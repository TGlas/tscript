import { RangeSet, StateEffect, StateField } from "@codemirror/state";
import { EditorView, GutterMarker, gutter } from "@codemirror/view";
import { Dummy } from "./dummy";

const breakpointEffect = StateEffect.define<{ pos: number; on: boolean }>({
	map: (val, mapping) => ({ pos: mapping.mapPos(val.pos), on: val.on }),
});

const breakpointState = StateField.define<RangeSet<GutterMarker>>({
	create() {
		return RangeSet.empty;
	},
	update(set, transaction) {
		set = set.map(transaction.changes);
		for (let e of transaction.effects) {
			if (e.is(breakpointEffect)) {
				if (e.value.on)
					set = set.update({
						add: [breakpointMarker.range(e.value.pos)],
					});
				else
					set = set.update({ filter: (from) => from != e.value.pos });
			}
		}
		return set;
	},
});

export function hasBreakpoint(view: EditorView, line: number) {
	const pos = Dummy.posToOffset(view, { line, ch: 0 });

	let breakpoints = view.state.field(breakpointState);
	let hasBreakpoint = false;
	breakpoints.between(pos, pos, () => {
		hasBreakpoint = true;
	});
	return hasBreakpoint;
}

export function toggleBreakpoint(view: EditorView, line: number) {
	view.dispatch({
		effects: breakpointEffect.of({
			pos: Dummy.posToOffset(view, { line, ch: 0 }),
			on: !hasBreakpoint(view, line),
		}),
	});
}

const breakpointMarker = new (class extends GutterMarker {
	toDOM() {
		const br = document.createElement("span");
		br.innerText = "●";
		br.style.color = "rgb(170, 0, 0)";
		return br;
	}
})();

export const breakpointGutter = [
	breakpointState,
	gutter({
		class: "cm-breakpoint-gutter",
		markers: (v) => v.state.field(breakpointState),
		initialSpacer: () => breakpointMarker,
		domEventHandlers: {
			mousedown(view, pos) {
				toggleBreakpoint(view, Dummy.offsetToPos(view, pos.from).line);
				return true;
			},
		},
	}),
	EditorView.baseTheme({
		".cm-breakpoint-gutter .cm-gutterElement": {
			color: "red",
			paddingLeft: "5px",
			cursor: "default",
		},
	}),
];
