import {
	getBreaksNeededForEmptyLineAfter,
	getBreaksNeededForEmptyLineBefore,
	getStateFromTextArea,
	insertBeforeEachLine,
	replaceSelection,
	selectWord,
} from "~utils";

const Commander = (currentTextArea, command) => {
	const textAreaState = getStateFromTextArea(currentTextArea);

	const initialState = init(
		selectWord({
			text: textAreaState.text,
			selection: textAreaState.selection,
		}),
	);

	function init({ start, end }) {
		currentTextArea.selectionStart = start;
		currentTextArea.selectionEnd = end;
		return getStateFromTextArea(currentTextArea);
	}

	function setHeader(prefix) {
		const nextState = replaceSelection(
			currentTextArea,
			`${prefix}${initialState.selectedText}`,
		);

		return {
			start: nextState.selection.end - initialState.selectedText.length,
			end: nextState.selection.end,
		};
	}

	function makeList(insertBefore) {
		const breaksBeforeCount = getBreaksNeededForEmptyLineBefore(
			initialState.text,
			initialState.selection.start,
		);
		const breaksBefore = Array(breaksBeforeCount + 1).join("\n");

		const breaksAfterCount = getBreaksNeededForEmptyLineAfter(
			initialState.text,
			initialState.selection.end,
		);
		const breaksAfter = Array(breaksAfterCount + 1).join("\n");

		const modifiedText = insertBeforeEachLine(
			initialState.selectedText,
			insertBefore,
		);

		replaceSelection(
			currentTextArea,
			`${breaksBefore}${modifiedText.modifiedText}${breaksAfter}`,
		);

		const oneLinerOffset =
			initialState.selectedText.indexOf("\n") === -1
				? modifiedText.insertionLength
				: 0;

		const selectionStart =
			initialState.selection.start + breaksBeforeCount + oneLinerOffset;
		const selectionEnd =
			selectionStart + modifiedText.modifiedText.length - oneLinerOffset;

		return {
			start: selectionStart,
			end: selectionEnd,
		};
	}

	/**
	 *  Removes the previous symbol if present.
	 *
	 *  There are two conditions:
	 *  - The word is selected but the surrounding symbols aren't
	 *  - The word is selected in addition to the surrounding symbols
	 *
	 *  Ex: unselected: **"hello"** needs a 0 offset.
	 *  while selected: "**hello**" needs an offset of 2 from both sides.
	 *
	 *  Doesn't handle removing symbols from multi-word/multi-lined unselected symbols.
	 */
	function removePreviousSymbol(sym) {
		const symLength = sym.length;
		const selectedTextContainsSymbol =
			initialState.selectedText.indexOf(sym) >= 0;
		const initialTextIsGreater =
			initialState.text.length > initialState.selectedText.length;
		const differentText = initialState.text !== initialState.selectedText;

		const includeCursorStart =
			selectedTextContainsSymbol && initialTextIsGreater ? 0 : symLength;
		const includeCursorEnd =
			selectedTextContainsSymbol && initialTextIsGreater ? 0 : symLength;

		if (differentText) {
			currentTextArea.selectionStart =
				initialState.selection.start - includeCursorStart;
			currentTextArea.selectionEnd =
				initialState.selection.end + includeCursorEnd;
		}

		const nextState = replaceSelection(
			currentTextArea,
			`${initialState.selectedText.replace(new RegExp(`[${sym}]`, "gi"), "")}`,
		);

		return {
			start: differentText
				? nextState.selection.start
				: nextState.selection.start - initialState.selectedText.length,
			end: differentText
				? nextState.selection.end
				: nextState.selection.end + symLength,
		};
	}

	function selectSurroundingWord(sym) {
		return currentTextArea.value.slice(
			currentTextArea.selectionStart - sym.length,
			currentTextArea.selectionEnd + sym.length,
		);
	}

	switch (command) {
		case "bold": {
			const sym = "**";
			if (selectSurroundingWord(sym).indexOf(sym) > -1)
				return removePreviousSymbol(sym, 2);

			const nextState = replaceSelection(
				currentTextArea,
				`${sym}${initialState.selectedText}${sym}`,
			);

			return {
				start:
					nextState.selection.end -
					sym.length -
					initialState.selectedText.length,
				end: nextState.selection.end - sym.length,
			};
		}
		case "code": {
			if (initialState.selectedText.indexOf("\n") === -1) {
				replaceSelection(currentTextArea, `\`${initialState.selectedText}\``);

				const selectionStart = initialState.selection.start + 1;
				const selectionEnd = selectionStart + initialState.selectedText.length;

				return {
					start: selectionStart,
					end: selectionEnd,
				};
			}

			const breaksBeforeCount = getBreaksNeededForEmptyLineBefore(
				initialState.text,
				initialState.selection.start,
			);
			const breaksBefore = Array(breaksBeforeCount + 1).join("\n");

			const breaksAfterCount = getBreaksNeededForEmptyLineAfter(
				initialState.text,
				initialState.selection.end,
			);
			const breaksAfter = Array(breaksAfterCount + 1).join("\n");

			replaceSelection(
				currentTextArea,
				`${breaksBefore}\`\`\`\n${initialState.selectedText}\n\`\`\`${breaksAfter}`,
			);

			const selectionStart =
				initialState.selection.start + breaksBeforeCount + 4;
			const selectionEnd = selectionStart + initialState.selectedText.length;

			return {
				start: selectionStart,
				end: selectionEnd,
			};
		}
		case "header-1": {
			return setHeader("# ");
		}
		case "header-2": {
			return setHeader("## ");
		}
		case "header-3": {
			return setHeader("### ");
		}
		case "header-4": {
			return setHeader("#### ");
		}
		case "header-5": {
			return setHeader("##### ");
		}
		case "header-6": {
			return setHeader("###### ");
		}
		case "horizontal-rule": {
			currentTextArea.selectionStart =
				currentTextArea.selectionStart + initialState.text.length;

			replaceSelection(currentTextArea, `\n\n---\n`);

			return {
				start: currentTextArea.selectionStart + initialState.text.length,
				end: currentTextArea.selectionEnd,
			};
		}
		case "image": {
			const imageTemplate =
				initialState.selectedText || "https://example.com/your-image.png";

			replaceSelection(currentTextArea, `![example.png](${imageTemplate})`);

			return {
				start: initialState.selection.start + 15,
				end: initialState.selection.start + 15 + imageTemplate.length,
			};
		}
		case "italic": {
			const sym = "*";
			if (selectSurroundingWord(sym).indexOf(sym) > -1)
				return removePreviousSymbol(sym);

			const nextState = replaceSelection(
				currentTextArea,
				`${sym}${initialState.selectedText}${sym}`,
			);
			return {
				start:
					nextState.selection.end -
					sym.length -
					initialState.selectedText.length,
				end: nextState.selection.end - sym.length,
			};
		}
		case "link": {
			const linkTemplate = initialState.selectedText || "link";

			const nextState = replaceSelection(
				currentTextArea,
				`[${linkTemplate}](https://www.example.com)`,
			);

			return {
				start: nextState.selection.end - 24,
				end: nextState.selection.end - 1,
			};
		}
		case "unordered-list": {
			return makeList("- ");
		}
		case "ordered-list": {
			return makeList((_, index) => `${index + 1}. `);
		}
		case "checked-list": {
			return makeList(() => `- [ ] `);
		}
		case "quote": {
			const breaksBeforeCount = getBreaksNeededForEmptyLineBefore(
				initialState.text,
				initialState.selection.start,
			);
			const breaksBefore = Array(breaksBeforeCount + 1).join("\n");

			const breaksAfterCount = getBreaksNeededForEmptyLineAfter(
				initialState.text,
				initialState.selection.end,
			);
			const breaksAfter = Array(breaksAfterCount + 1).join("\n");

			replaceSelection(
				currentTextArea,
				`${breaksBefore}> ${initialState.selectedText}${breaksAfter}`,
			);

			const selectionStart =
				initialState.selection.start + breaksBeforeCount + 2;
			const selectionEnd = selectionStart + initialState.selectedText.length;

			return {
				start: selectionStart,
				end: selectionEnd,
			};
		}
		case "strike-through": {
			const sym = "~~";
			if (selectSurroundingWord(sym).indexOf(sym) > -1)
				return removePreviousSymbol(sym);

			const nextState = replaceSelection(
				currentTextArea,
				`${sym}${initialState.selectedText}${sym}`,
			);
			return {
				start:
					nextState.selection.end -
					sym.length -
					initialState.selectedText.length,
				end: nextState.selection.end - sym.length,
			};
		}
		case "trash": {
			currentTextArea.selectionStart = 0;
			currentTextArea.selectionEnd = currentTextArea.value.length;

			replaceSelection(currentTextArea, "");

			return {
				start: 0,
				end: 0,
			};
		}
		// case "underline": {
		// if (initialState.text.indexOf("++") > -1)
		// 	return removePrevious(/[+]/gi, 2);

		// 	const nextState = replaceSelection(currentTextArea,`++${initialState.selectedText}++`);
		// 	return {
		// 		start: nextState.selection.end - 2 - initialState.selectedText.length,
		// 		end: nextState.selection.end - 2,
		// 	};
		// }
		default:
			return {
				start: 0,
				end: 0,
			};
	}
};

export default Commander;
