import package_json from "../../package.json";

export const Version = {
	type: null, // "beta"
	major: package_json.version.split(".")[0],
	minor: package_json.version.split(".")[1],
	patch: package_json.version.split(".")[2],
	day: 18,
	month: 2,
	year: 2025,
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
