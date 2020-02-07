# react-smde

A lightweight **Simple Markdown Editor** for React.

<img src="https://img.shields.io/github/package-json/v/mattcarlotta/react-smde?style=for-the-badge"></img> [![Codecov](https://img.shields.io/codecov/c/github/mattcarlotta/react-smde?style=for-the-badge)](https://codecov.io/gh/mattcarlotta/react-smde) [![Open Issues](https://img.shields.io/github/issues-raw/mattcarlotta/react-smde?style=for-the-badge)](https://github.com/mattcarlotta/react-smde/issues) [![Dependencies](https://img.shields.io/david/mattcarlotta/react-smde.svg?style=for-the-badge)](https://david-dm.org/mattcarlotta/react-smde) [![License](https://img.shields.io/github/license/mattcarlotta/react-smde?style=for-the-badge)](https://github.com/mattcarlotta/react-smde/blob/master/LICENSE)

[Installation](#installation)

[Demo](#demo)

[Basic Usage](#basic-usage)

[Props](#props)

[Markdown Previewing](#markdown-previewing)

[Custom Styling](#custom-styling)

[Commands](#commands)

[Suggestions](#suggestions)

[Tooltips](#tooltips)

[Report Bugs](#report-bugs)

[License](#license)

[Third Party Resources](#third-party-resources)

## Installation

```
npm i react-smde
```

or

```
yarn install react-smde
```

## Demo

- [Live Demo]()
- [Demo on CodeSandbox]()
- Local demo (cloned repo) `npm run demo` or `yarn demo`

## Basic Usage

```jsx
import MDEditor from "react-smde";
import ReactMarkdown from "react-markdown";
import "react-smde/styles/react-smde.css";

class App extends Component {
	state = {
		value: "## Hello",
	};

	handleValueChange = value => this.setState({ value });

	render = () => (
		<div className="container">
			<MDEditor onChange={this.handleValueChange} value={this.state.value}>
				<ReactMarkdown skipHtml renderers={{"code"",inlineCode"}}>{this.state.value}</ReactMarkdown>
			</MDEditor>
		</div>
	);
}
```

## Props

The following props are accepted by `MDEditor`:

| `prop`                            | Description                                                                                                                                         |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `autoGrow`(bool)                  | A `boolean` to autogrow the textarea until the `maxEditorHeight` has been reached. (default: `false`)                                               |
| `classes`(obj)                    | An optional `object` of `string` classNames that will be appended to the specified className. (see [Custom Styling](#custom-styling) for more info) |
| `commands`(arr)                   | A single `array` with an array of grouped object commands. (see [Commands](#commands) for more info)                                                |
| `debounceSuggestions`(num)        | A `number` set in `ms` to debounce calling the `loadSuggestions` function. (default: `300`)†                                                        |
| `disableGrip`(bool)               | A `boolean` to disable the bottom textarea resizing button. (default: `false`)                                                                      |
| `disableHotKeys`(bool)            | A `boolean` to disable the textarea hot keys. (default: `false`)                                                                                    |
| `disablePreview`(bool)            | A `boolean` to disable the preview button. (default: `false`)                                                                                       |
| `disableToolbar`(bool)            | A `boolean` to disable the toolbar. (default: `false`)                                                                                              |
| `loadSuggestions`(func)           | A `function` that returns an `array` of suggestions triggered by the `suggestionTriggerCharacter`. (see [Suggestions](#suggestions) for more info)  |
| `maxEditorHeight`(num/str)        | A maximum editor height `number` that is set in `px` or `string`. (default: `500`)                                                                  |
| `maxEditorWidth` (num/str)        | A maximum editor width `number` or `string`. (default: `100%`)                                                                                      |
| `minEditorHeight`(num/str)        | A minimum editor height `number` that is set in `px` or `string`. (default: `250`)                                                                  |
| `onChange`(func)                  | A **required** callback `function` to handle value changes.                                                                                         |
| `readOnly`(bool)                  | A `boolean` to disable editing the text within the textarea. (default: `false`)                                                                     |
| `selectedTab`(str)                | A `string` (`write`/`preview`) to initialize the editor view in. (default: `write`)                                                                 |
| `suggestionTriggerCharacter`(str) | A `string` character to trigger suggestions. (default: `@`)                                                                                         |
| `textAreaProps`(obj)              | An optional `object` of properties to apply to the textarea.                                                                                        |
| `tooltipPlacement`(str)           | The tooltip position relative to the target. (default: `top` -- see [Tooltips](#tooltips) for more info)                                            |
| `value`(str)                      | A **required** `string` value.                                                                                                                      |

† Setting `debounceSuggestions` lower than 300ms, will disable the suggestions loading indicator. In testing, a number lower than 300ms caused unavoidable UI flashes when the returned data is static. As such, this allows you to utilize an array of static data and avoid seeing a loading indicator for each key input.

## Markdown Previewing

The `MDEditor` is unopinionated when it comes to previewing markdown content. Therefore, you **must** supply your own Markdown previewer as `children` to the `MDEditor`. The demo provided in the source and the example below utilizes [react-markdown](https://github.com/rexxars/react-markdown).

```jsx
import React, { Component } from "react";
import MDEditor from "react-smde";
import ReactMarkdown from "react-markdown";
import "react-smde/styles/react-smde.css";

class App extends Component {
	state = {
		value: "## Hello",
	};

	handleValueChange = value => this.setState({ value });

	render = () => (
		<div className="container">
			<MDEditor onChange={this.handleValueChange} value={this.state.value}>
				<ReactMarkdown skipHtml>{this.state.value}</ReactMarkdown>
			</MDEditor>
		</div>
	);
}
```

## Custom Styling

The `MDEditor` was designed to be as flexible as possible when it comes to customizing the appearance of the editor. As such, you have several options:

**Option 1**: Pass a `classes` object property to the `MDEditor` with a custom class name targeting the specified property.

<details>
<summary>Click to view a summary of available "mde" property overrides...</summary>
<pre><code>
mde (applied to root)
mdetoolbar (applied to toolbar)
mdetoolbargroup (applied to toolbar groups)
mdetoolbaritem (applied to toolbar items)
mdetoolbarseparator (applied to toolbar separators)
mdepreview (applied to preview wrapper)
mdepreviewcontent (applied to previewed content)
mdenosuggestions (applied to no suggestions result item)
mdesuggestions (applied to suggestions overlay)
mdetextarea (applied to textarea input)
mdetextareawrapper (applied to textarea wrapper)
mdetooltip (applied to root tooltip)
</code></pre>
</details>
<br />

For example:

```
classes={{ mde: "custom-mde", mdetoolbar: "custom-toolbar" }}
```

<br />

**Option 2**: Import the `.scss` files from `react-smde/styles/[name].scss` (see available files <a href="https://github.com/mattcarlotta/react-smde/tree/master/src/styles">here</a>) and overwrite them as needed (please note that your project must be set up to handle SASS imports).

<br />

**Option 3**: Create your own stylesheets that target the available `classNames`.

<details>
<summary>Click to view a summary of available "mde" classNames...</summary>
<pre><code>
mde (applied to root)
mde-toolbar (applied to toolbar)
mde-toolbar-group (applied to toolbar groups)
mde-toolbar-item (applied to toolbar items)
mde-toolbar-separator (applied to toolbar separators)
mde-preview (applied to preview wrapper)
mde-preview-content (applied to previewed content)
mde-no-suggestions (applied to no suggestion results item)
mde-suggestions (applied to suggestions overlay)
mde-textarea (applied to textarea input)
mde-textarea-wrapper (applied to textarea wrapper)
mde-tooltip (applied to root tooltip)
</code></pre>
</details>
<br />

## Commands

You can rearrange, remove and adjust command properties (and their icons). The `commands` property of `MDEditor` expects a single array of one or many arrays of grouped object commands.

Commands are simple objects where `name` must match a name from the predefined [list](src/commands/index.js#L23-L35), however, everything else is customizable:

```
{
  name: "bold",
  tooltip: "Add bold text (ctrl+b)",
  buttonProps: { "aria-label": "Add bold text" },
  icon: <SvgIcon icon="bold" />
}
```

The `icon` property must be a React node. You can either pass your own node or you can import the `SvgIcon` from this package and pass it an `icon` string property as shown above. For predefined icons, please see this [function](src/icons/index.js#L271-L308), which returns a predefined React SVG node based upon a string.

For example:

```jsx
import MDEditor, { commands, SvgIcon } from "react-smde";
import "react-smde/styles/react-smde.css";

const { checkedList, orderedList, unorderedList } = commands;

<MDEditor
    commands={[
        [orderedList, unorderedList, checkedList],
        [
          {
            name: "bold",
            tooltip: "Add bold text (ctrl+b)",
            buttonProps: { "aria-label": "Add bold text" },
            icon: <SvgIcon icon="bold" />
          }
        ]
      ]
    }
    ...otherProps
>
  ...etc
</MDEditor>
```

## Suggestions

In order to use suggestions, you must supply a callback function to the `MDEditor` as `loadSuggestions`. The `loadSuggestions` callback function **must** return data in the following structure:

```
[
  { value: "example1" },
  { value: "example2" },
  { value: "example3" },
  ...etc
]
```

By default, the `MDEditor` expects the data to be filtered server-side or by the `loadSuggestions` callback function.

The suggestions overlay will only be triggered by the `suggestionTriggerCharacter` and will only execute the `loadSuggestions` function as determined by the `debounceSuggestions` property.

Please note that setting a `debounceSuggestions` lower than `300`ms will disable the loading indicator -- this is useful if the returned data remains static.

For example a dynamic data set, see the [Demo](#demo) example above, otherwise here's a static data example:

```jsx
import React, { Component } from "react";
import MDEditor from "react-smde";
import "react-smde/styles/react-smde.css";

class App extends Component {
  state = {
    value: ""
    suggestions: [
      { value: "andre" },
      { value: "angela" },
      { value: "david" },
      { value: "louise" }
    ]
  };

  handleValueChange = value => this.setState({ value });

  loadSuggestions = searchText =>
    this.state.suggestions.filter(({ value }) =>
      value.toLowerCase().includes(searchText.toLowerCase())
    );

  render = () => (
    <div className="container">
      <MDEditor
        onChange={this.handleValueChange}
        value={this.state.value}
        debounceSuggestions={0}
        loadSuggestions={this.loadSuggestions}
      >
        <ReactMarkdown skipHtml>{this.state.value}</ReactMarkdown>
      </MDEditor>
    </div>
  );
}
```

## Tooltips

You can specify the position of the tooltip in relation to its target. For example, one of the following `string`s can be passed to the `tooltipPlacement` property:

```
top
topLeft
topRight
bottom
bottomLeft
bottomRight
left
leftTop
leftBottom
right
rightTop
rightBottom
```

Please note that there must be sufficient space for the tooltip to occupy the specified area; otherwise, the tooltip will default to the next closest available space.

## Report bugs

If you run into any issues, please fill out an issue report <a href="https://github.com/mattcarlotta/react-smde/issues">here</a>. **Please provide a reproducible codesandbox example of the bug(s) you're experiencing. Issues that don't provide a reproducible example may be ignored.**

## License

react-smde is [MIT licensed](LICENSE).

## Third Party Resources

In order to make react-smde, the following packages are referenced and used within this package:

- https://github.com/grassator/insert-text-at-cursor
- https://github.com/JedWatson/classnames
- https://github.com/andrerpena/react-mde
- https://github.com/ant-design/ant-design
- https://github.com/react-component/tooltip
- https://github.com/lakebeach/rollup-plugin-local-resolving
