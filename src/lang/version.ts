export const Version = {
	type: "beta",
	major: 0,
	minor: 6,
	patch: 2,
	day: 1,
	month: 2,
	year: 2021,
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
