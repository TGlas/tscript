import { lt_source } from "./lt_source";
import { TscriptTest } from "./tests";

export const test_lattice_craft: TscriptTest = {
	code: lt_source,
	description: "test if lattice craft can be parsed.",
	name: "lattice craft parse",
	expectation: [],
	parseOnly: true,
};
