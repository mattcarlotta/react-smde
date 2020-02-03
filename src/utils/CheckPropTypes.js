export function checkPropTypes({
  autoGrow,
  children,
  classes,
  debounceSuggestions,
  disableGrip,
  disableHotKeys,
  disablePreview,
  disableToolbar,
  commands,
  maxEditorHeight,
  maxEditorWidth,
  minEditorHeight,
  minPreviewHeight,
  onChange,
  readOnly,
  selectedTab,
  suggestionTriggerCharacter,
  textAreaProps,
  tooltipPlacement,
  value
}) {
  if (!children)
    throw Error("The MDEditor must include a Markdown previewer as a child!");
  if (typeof value !== "string")
    throw Error("The MDEditor must include a string value property!");
  if (typeof onChange !== "function")
    throw Error("The MDEditor must include an onChange function property!");
  if (
    typeof selectedTab !== "string" ||
    (selectedTab !== "write" && selectedTab !== "preview")
  )
    throw Error(
      "The MDEditor was initialized with an invalid 'selectedTab' property. It must be a string that is either 'write' or 'preview'!"
    );
  if (typeof autoGrow !== "boolean")
    throw Error(
      "The MDEditor was initialized with an invalid 'autoGrow' property. It must be a boolean!"
    );
  if (typeof classes !== "object")
    throw Error(
      "The MDEditor was initialized with an invalid 'classes' property. It must be an object of strings!"
    );
  if (!Array.isArray(commands))
    throw Error(
      "The MDEditor was initialized with an invalid 'commands' property. It must be a single array of one or many arrays of grouped object commands!"
    );
  if (typeof debounceSuggestions !== "number")
    throw Error(
      "The MDEditor was initialized with an invalid 'debounceSuggestions' property. It must be a number!"
    );
  if (typeof disableGrip !== "boolean")
    throw Error(
      "The MDEditor was initialized with an invalid 'disableGrip' property. It must be a boolean!"
    );
  if (typeof disableHotKeys !== "boolean")
    throw Error(
      "The MDEditor was initialized with an invalid 'disableHotKeys' property. It must be a boolean!"
    );
  if (typeof disablePreview !== "boolean")
    throw Error(
      "The MDEditor was initialized with an invalid 'disablePreview' property. It must be a boolean!"
    );
  if (typeof disableToolbar !== "boolean")
    throw Error(
      "The MDEditor was initialized with an invalid 'disablePreview' property. It must be a boolean!"
    );
  if (typeof maxEditorHeight !== "number")
    throw Error(
      "The MDEditor was initialized with an invalid 'maxEditorHeight' property. It must be a number!"
    );
  if (typeof maxEditorWidth !== "number" && typeof maxEditorWidth !== "string")
    throw Error(
      "The MDEditor was initialized with an invalid 'maxEditorWidth' property. It must be a number or string!"
    );
  if (typeof minEditorHeight !== "number")
    throw Error(
      "The MDEditor was initialized with an invalid 'minEditorHeight' property. It must be a number!"
    );
  if (typeof minPreviewHeight !== "number")
    throw Error(
      "The MDEditor was initialized with an invalid 'minPreviewHeight' property. It must be a number!"
    );
  if (typeof readOnly !== "boolean")
    throw Error(
      "The MDEditor was initialized with an invalid 'readOnly' property. It must be a boolean!"
    );
  if (typeof suggestionTriggerCharacter !== "string")
    throw Error(
      "The MDEditor was initialized with an invalid 'suggestionTriggerCharacter' property. It must be a key string!"
    );
  if (typeof textAreaProps !== "object")
    throw Error(
      "The MDEditor was initialized with an invalid 'textAreaProps' property. It must be an object containing booleans, strings, numbers and/or functions!"
    );
  if (typeof tooltipPlacement !== "string")
    throw Error(
      "The MDEditor was initialized with an invalid 'tooltipPlacement' property. It must be a string containing one of the following: 'top','topLeft','topRight','bottom','bottomLeft','bottomRight','left','leftTop','leftBottom','right','rightTop' or'rightBottom'!"
    );
}
