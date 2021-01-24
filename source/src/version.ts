export const Version = {
        type: "beta",
        major: 0,
        minor: 5,
        patch: 43,
        day: 7,
        month: 1,
        year: 2021,
        full: function () {
                let s = "TScript version " + this.major
                        + "." + this.minor
                        + "." + this.patch;
                if (this.type) s += " " + this.type
                s += " - released " + this.day
                        + "." + this.month
                        + "." + this.year
                        + " - (C) Tobias Glasmachers 2018" + "-" + this.year;
                return s;
        },
}