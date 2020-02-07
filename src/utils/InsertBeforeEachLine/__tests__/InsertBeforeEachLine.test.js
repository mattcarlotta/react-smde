import { insertBeforeEachLine } from "../index";

const selectedText = "Hello\nGoodbye";
const insertBefore = () => "-";

describe("Insert Before Each Line", () => {
	it("inserts text before lines using a string", () => {
		const { modifiedText, insertionLength } = insertBeforeEachLine(
			selectedText,
			"-",
		);

		expect(modifiedText).toEqual("-Hello\n-Goodbye");
		expect(insertionLength).toEqual(2);
	});

	it("inserts text before lines using a function", () => {
		const { modifiedText, insertionLength } = insertBeforeEachLine(
			selectedText,
			insertBefore,
		);

		expect(modifiedText).toEqual("-Hello\n-Goodbye");
		expect(insertionLength).toEqual(2);
	});

	it("throws an error if 'insertBefore' isn't string or function", () => {
		expect(() => insertBeforeEachLine(selectedText, undefined)).toThrow(
			"An invalid 'insertBefore' argument was passed to insertBeforeEachLine. The 'insertBefore' argument should either be a string or a function!",
		);
	});
});
