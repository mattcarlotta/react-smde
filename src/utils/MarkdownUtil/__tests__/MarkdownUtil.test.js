import {
	getBreaksNeededForEmptyLineBefore,
	getBreaksNeededForEmptyLineAfter,
	selectWord,
} from "../index";

const text = "Hello";
const selection = {
	start: 0,
	end: 5,
};

describe("Markdown Utils", () => {
	it("selects the previous word", () => {
		const result = selectWord({ text, selection });

		expect(result).toEqual(
			expect.objectContaining({
				start: 0,
				end: 5,
			}),
		);
	});

	it("iterates over a word to the left", () => {
		const result = selectWord({
			text: "Hello world!",
			selection: { start: 9, end: 9 },
		});

		expect(result).toEqual(
			expect.objectContaining({
				start: 6,
				end: 12,
			}),
		);
	});

	it("iterates over a word to the right", () => {
		const result = selectWord({
			text: "Hello world!",
			selection: { start: 5, end: 5 },
		});

		expect(result).toEqual(
			expect.objectContaining({
				start: 0,
				end: 5,
			}),
		);
	});

	it("doesn't adjust the selection if the previous word if already selected", () => {
		const result = selectWord({ text, selection });

		expect(result).toEqual(
			expect.objectContaining({
				start: 0,
				end: 5,
			}),
		);
	});

	it("gets the number of before line-breaks", () => {
		expect(getBreaksNeededForEmptyLineBefore("Hello\nGoobdye", 6)).toEqual(1);
	});

	it("handles before same lines spaces", () => {
		expect(getBreaksNeededForEmptyLineBefore("Hello‎", 1)).toEqual(0);
	});

	it("gets the number of after line-breaks", () => {
		expect(getBreaksNeededForEmptyLineAfter("Hello\nGoobdye", 5)).toEqual(1);
	});

	it("handles before same lines spaces", () => {
		expect(getBreaksNeededForEmptyLineAfter("Hello‎", 5)).toEqual(0);
	});
});
