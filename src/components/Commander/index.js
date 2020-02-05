import {
	getBreaksNeededForEmptyLineAfter,
	getBreaksNeededForEmptyLineBefore,
	getStateFromTextArea,
	getPrevStateFromTextArea,
	insertBeforeEachLine,
	insertText,
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

	function replaceSelection(text) {
		insertText(currentTextArea, text);
		return getStateFromTextArea(currentTextArea);
	}

	function setHeader(prefix) {
		const nextState = replaceSelection(`${prefix}${initialState.selectedText}`);

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

	switch (command) {
		case "bold": {
			const prevSelectedState = getPrevStateFromTextArea(currentTextArea, 2);

			if (prevSelectedState.indexOf("**") > -1) {
				currentTextArea.selectionStart = currentTextArea.selectionStart - 2;
				currentTextArea.selectionEnd = currentTextArea.selectionEnd + 2;
				const nextState = replaceSelection(
					`${prevSelectedState.replace(/[*]/gi, "")}`,
				);

				return {
					start: nextState.selection.end - initialState.selectedText.length,
					end: nextState.selection.end + 2,
				};
			}

			const nextState = replaceSelection(`**${initialState.selectedText}**`);
			return {
				start: nextState.selection.end - 2 - initialState.selectedText.length,
				end: nextState.selection.end - 2,
			};
		}
		case "code": {
			if (initialState.selectedText.indexOf("\n") === -1) {
				replaceSelection(`\`${initialState.selectedText}\``);

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

			insertText(currentTextArea, `\n\n---\n`);

			return {
				start: currentTextArea.selectionStart + initialState.text.length,
				end: currentTextArea.selectionEnd,
			};
		}
		case "image": {
			const imageTemplate =
				initialState.selectedText || "https://example.com/your-image.png";

			replaceSelection(`![example.png](${imageTemplate})`);

			return {
				start: initialState.selection.start + 15,
				end: initialState.selection.start + 15 + imageTemplate.length,
			};
		}
		case "italic": {
			const prevSelectedState = getPrevStateFromTextArea(currentTextArea, 1);

			if (prevSelectedState.indexOf("*") > -1) {
				currentTextArea.selectionStart = currentTextArea.selectionStart - 1;
				currentTextArea.selectionEnd = currentTextArea.selectionEnd + 1;
				const nextState = replaceSelection(
					`${prevSelectedState.replace(/[*]/gi, "")}`,
				);

				return {
					start: nextState.selection.end - initialState.selectedText.length,
					end: nextState.selection.end + 2,
				};
			}

			const nextState = replaceSelection(`*${initialState.selectedText}*`);
			return {
				start: nextState.selection.end - 1 - initialState.selectedText.length,
				end: nextState.selection.end - 1,
			};
		}
		case "link": {
			const linkTemplate = initialState.selectedText || "link";

			const nextState = replaceSelection(
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
			const prevSelectedState = getPrevStateFromTextArea(currentTextArea, 2);

			if (prevSelectedState.indexOf("~") > -1) {
				currentTextArea.selectionStart = currentTextArea.selectionStart - 2;
				currentTextArea.selectionEnd = currentTextArea.selectionEnd + 2;
				const nextState = replaceSelection(
					`${prevSelectedState.replace(/[~]/gi, "")}`,
				);

				return {
					start: nextState.selection.end - initialState.selectedText.length,
					end: nextState.selection.end + 2,
				};
			}

			const nextState = replaceSelection(`~~${initialState.selectedText}~~`);
			return {
				start: nextState.selection.end - 2 - initialState.selectedText.length,
				end: nextState.selection.end - 2,
			};
		}
		// case "underline": {
		// 	const prevSelectedState = getPrevStateFromTextArea(currentTextArea, 2);

		// 	if (prevSelectedState.indexOf("+") > -1) {
		// 		currentTextArea.selectionStart = currentTextArea.selectionStart - 2;
		// 		currentTextArea.selectionEnd = currentTextArea.selectionEnd + 2;
		// 		const nextState = replaceSelection(
		// 			`${prevSelectedState.replace(/[+]/gi, "")}`,
		// 		);

		// 		return {
		// 			start: nextState.selection.end - initialState.selectedText.length,
		// 			end: nextState.selection.end + 2,
		// 		};
		// 	}

		// 	const nextState = replaceSelection(`++${initialState.selectedText}++`);
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
