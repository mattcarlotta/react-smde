export function insertBeforeEachLine(selectedText, insertBefore) {
	const lines = selectedText.split(/\n/);

	let insertionLength = 0;
	const modifiedText = lines
		.map((item, index) => {
			if (typeof insertBefore === "string") {
				insertionLength += insertBefore.length;
				return insertBefore + item;
			} else if (typeof insertBefore === "function") {
				const insertionResult = insertBefore(item, index);
				insertionLength += insertionResult.length;
				return insertBefore(item, index) + item;
			}
			throw Error(
				"An invalid 'insertBefore' argument was passed to insertBeforeEachLine. The 'insertBefore' argument should either be a string or a function!",
			);
		})
		.join("\n");

	return { modifiedText, insertionLength };
}
