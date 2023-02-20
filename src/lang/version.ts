export const Version = {
	type: "beta",
	major: 0,
	minor: 10,
	patch: 11,
	day: 20,
	month: 2,
	year: 2023,
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
			" - (C) Tobias Glasmachers 2018-" +
			this.year;
		return s;
	},
};
