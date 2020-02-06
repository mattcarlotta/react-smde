/*!
  Copyright (c) 2018 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/

export function classNames(...classValues) {
	const classes = [];

	for (let i = 0; i < classValues.length; i++) {
		const classValue = classValues[i];
		if (!classValue) continue;

		if (typeof classValue === "string") {
			classes.push(classValue);
		} else if (Array.isArray(classValue) && classValue.length > 0) {
			const inner = classNames.apply(null, classValue);
			if (inner) {
				classes.push(inner);
			}
		} else if (typeof classValue === "object") {
			for (let key in classValue) {
				if (classValue.hasOwnProperty(key) && classValue[key]) {
					classes.push(key);
				}
			}
		}
	}

	return classes.join(" ");
}
