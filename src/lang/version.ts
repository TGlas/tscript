export const Version = {
	type: "beta",
	major: 0,
	minor: 9,
	patch: 1,
	day: 29,
	month: 5,
	year: 2022,
	full: function () {
		let s =
			"TScript version " +
			this.major +
			"." +
			this.minor +
			"." +
			this.patch;
		if (this.type) s += " " + this.type;
		s +=
			" - released " +
			this.day +
			"." +
			this.month +
			"." +
			this.year +
			" - (C) Tobias Glasmachers 2018" +
			"-" +
			this.year;
		return s;
	},
};
