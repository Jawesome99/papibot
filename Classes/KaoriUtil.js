exports.negateTags = function(array) {
	for (let i in array) {
		if (!array[i].startsWith("-")) array[i] = "-" + array[i];
	}
	return array;
}

exports.unNegateTags = function(array) {
	for (let i in array) {
		if (array.startsWith("-")) array[i] = array[i].slice(1);
	}
	return array;
}

exports.parse = function(param, arg) {
	switch(param) {
		case "a":
			if (!arg || arg === "") return "Unknown";
			return arg;
		case "s":
			if (!arg) return "No source given.";
			return "[Link!](" + arg + ")";
		case "sc":
			if (!arg) return 0;
			return arg;
		case "r":
			switch(arg) {
				case "s":
					return "Safe";
				case "q": 
					return "Questionable";
				case "e":
					return "Explicit";
				default:
					return "Unknown (" + arg + ")";
			}
		default:
			return "";
	}
}