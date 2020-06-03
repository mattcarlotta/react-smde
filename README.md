# react-smde

A lightweight **Simple Markdown Editor** for React.

[![NPM](https://nodei.co/npm/react-smde.png)](https://nodei.co/npm/react-smde/)

<img src="https://img.shields.io/github/package-json/v/mattcarlotta/react-smde?style=for-the-badge"></img> <img src="https://img.shields.io/bundlephobia/min/react-smde?style=for-the-badge"></img> [![Codecov](https://img.shields.io/codecov/c/github/mattcarlotta/react-smde?style=for-the-badge)](https://codecov.io/gh/mattcarlotta/react-smde) [![Open Issues](https://img.shields.io/github/issues-raw/mattcarlotta/react-smde?style=for-the-badge)](https://github.com/mattcarlotta/react-smde/issues) [![Dependencies](https://img.shields.io/david/mattcarlotta/react-smde.svg?style=for-the-badge)](https://david-dm.org/mattcarlotta/react-smde) [![License](https://img.shields.io/github/license/mattcarlotta/react-smde?style=for-the-badge)](https://github.com/mattcarlotta/react-smde/blob/master/LICENSE)

[Installation](#installation)

[Demo](#demo)

[Basic Usage](#basic-usage)

[Props](#props)

[Markdown Previewing](#markdown-previewing)

[Package Exports](#package-exports)

[Hot Keys](#hot-keys)

[Custom Commands](#custom-commands)

[Custom Styling](#custom-styling)

[Suggestions](#suggestions)

[Tooltips](#tooltips)

[Builds](#builds)

[Report Bugs](#report-bugs)

[Feature Requests](#feature-requests)

[License](#license)

[Third Party Resources](#third-party-resources)

## Installation

```
npm i react-smde
```

or

```
yarn add react-smde
```

react-smde is unopinionated about how to preview Markdown, therefore you'll **need** to supply your own Markdown previewer (see [Basic Usage](#basic-usage) for an example).

## Demo

- [Live Demo](https://mattcarlotta.github.io/react-smde/)
- [Demo on CodeSandbox](https://codesandbox.io/s/react-smde-basic-example-9uo1o)
- Local demo (cloned repo) `npm run demo` or `yarn demo`

## Basic Usage

```jsx
import MDEditor from "react-smde";
import ReactMarkdown from "react-markdown";

class App extends Component {
  constructor() {
    super();
    this.state = { value: "" };
    this.handleValueChange = this.handleValueChange.bind(this);
  }

  handleValueChange(value) {
    this.setState({ value });
  }

  render() {
    return (
      <MDEditor onChange={this.handleValueChange} value={this.state.value}>
        <ReactMarkdown>{this.state.value || "(empty)"}</ReactMarkdown>
      </MDEditor>
    );
  }
}
```

## Props

The following props are accepted by `MDEditor`:

| `prop`                            | Description                                                                                                                                         |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `autoGrow`(bool)                  | A `boolean` to autogrow the textarea until the `maxEditorHeight` has been reached. (default: `false`)                                               |
| `classes`(obj)                    | An optional `object` of `string` classNames that will be appended to the specified className. (see [Custom Styling](#custom-styling) for more info) |
| `commands`(arr)                   | A single `array` with an array of grouped object commands. (see [Custom Commands](#custom-commands) for more info)                                  |
| `debounceSuggestions`(num)        | A `number` set in `ms` to debounce calling the `loadSuggestions` function. (default: `300`)†                                                        |
| `disableGrip`(bool)               | A `boolean` to disable the bottom textarea resizing button. (default: `false`)                                                                      |
| `disableHotKeys`(bool)            | A `boolean` to disable the textarea hot keys. (default: `false`)                                                                                    |
| `disablePreview`(bool)            | A `boolean` to disable the preview button -- also disables the preview/write hot key. (default: `false`)                                            |
| `disableToolbar`(bool)            | A `boolean` to disable the toolbar. (default: `false`)                                                                                              |
| `editorRef`(func)                 | An optional callback `function` to hoist the MDEditor's `ref`.                                                                                      |
| `loadSuggestions`(func)           | A `function` that returns an `array` of suggestions triggered by the `suggestionTriggerCharacter`. (see [Suggestions](#suggestions) for more info)  |
| `maxCharacterLength`(num/str)     | A maximum MDEditor character length as a `number` or `string`. (default: `null`)                                                                    |
| `maxEditorHeight`(num/str)        | A maximum MDEditor height `number` that is set in `px` or `string`. (default: `500`)                                                                |
| `maxEditorWidth` (num/str)        | A maximum MDEditor width `number` or `string`. (default: `100%`)                                                                                    |
| `minEditorHeight`(num/str)        | A minimum MDEditor height `number` that is set in `px` or `string`. (default: `250`)                                                                |
| `onChange`(func)                  | A **required** callback `function` to handle value changes.                                                                                         |
| `readOnly`(bool)                  | A `boolean` to disable editing the text within the textarea. (default: `false`)                                                                     |
| `selectedTab`(str)                | A `string` (`write`/`preview`) to initialize the MDEditor's view in. (default: `write`)                                                             |
| `showCharacterLength`(bool)       | A `boolean` to display the MDEditor's character length. (default: `false`)                                                                          |
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

class App extends Component {
  constructor() {
    super();
    this.state = { value: "" };
    this.handleValueChange = this.handleValueChange.bind(this);
  }

  handleValueChange(value) {
    this.setState({ value });
  }

  render() {
    return (
      <MDEditor onChange={this.handleValueChange} value={this.state.value}>
        <ReactMarkdown>{this.state.value || "(empty)"}</ReactMarkdown>
      </MDEditor>
    );
  }
}
```

## Package Exports

Aside from the default exported `MDEditor`, this package also exports a few other **named** internals:

```
commands (an object of all predefined commands)
defaultCommandLayout (a chunked array of predefined commands)
replaceSelection (function to replace/insert text -- it requires two arguments: the editor ref and a string)
SvgIcon (component used for default command icons)
Tooltip (component used for overlay tips)
```

You can see use cases for these internals by visiting the [Live Demo](https://mattcarlotta.github.io/react-smde/).

## Hot Keys

The `MDEditor` comes configured with hot keys:

- Bold (ctrl+b)
- Italic (ctrl+i)
- Link (ctrl+k)
- Edit/Preview toggle (ctrl+0)

If you want to remove these keys, then they can be disabled by passing the `disableHotKeys` prop to the `MDEditor`.

## Custom Styling

The `MDEditor` was designed to be as flexible as possible when it comes to customizing the appearance of the editor.

In order to change the style, pass a `classes` object property to the `MDEditor` with a custom class name targeting the specified property.

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
mdetextareacharacterlength (applied to textarea character length)
mdegrip (applied to editor window grip)
mdetooltip (applied to root tooltip)
</code></pre>
</details>
<br />

For example:

```
classes={{ mde: "custom-mde", mdetoolbar: "custom-toolbar" }}
```


Note: This package uses `styled-components` under the hood and your CSS classnames will need to have higher specificity when overriding styles. See [issues with specificity](https://styled-components.com/docs/advanced#issues-with-specificity) for more information.

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
mde-preview (applied to preview wrapper and previewed content)
mde-no-suggestions (applied to no suggestion results item)
mde-suggestions (applied to suggestions overlay)
mde-textarea (applied to textarea input)
mde-textarea-wrapper (applied to textarea wrapper)
mde-textarea-character-length (applied to textarea character length)
mde-grip (applied to editor window grip)
mde-tooltip (applied to root tooltip)
</code></pre>
</details>
<br />

## Custom Commands

You can rearrange, remove, and adjust properties and/or add your own commands! The `commands` property of the `MDEditor` expects a single array of one or many arrays of grouped object commands.

Commands are simple objects where `name` must either match a name from this predefined [list](src/commands/index.js#L23-L38) or must be a unique string:

```
{
  name: "bold",
  tooltip: "Add bold text (ctrl+b)",
  buttonProps: { "aria-label": "Add bold text" },
  icon: <SvgIcon icon="bold" />
}
```

The `icon` property must be a React node or a string. You can either pass your own node or you can import the `SvgIcon` from this package and pass it an `icon` string property as shown above. For predefined icons, please see this [function](src/icons/index.js#L286-L325), which returns a predefined React SVG node based upon a string.

You can override button commands by passing in a callback function to the the `buttonProps`. This assumes that your button is not a menu. If it is a menu, then you can pass an `onClick` callback function as a property and it will override the `children`'s button commands. For a working example, see the [Custom Commands Demo](https://mattcarlotta.github.io/react-smde/?path=/story/mdeditor--custom-commands-example).

If you wish to append to the predefined commands, then you can import the `defaultCommandLayout` from the package and spread it out in the `commands` property (see example below).

For example:

```jsx
import MDEditor, { commands, defaultCommandLayout, SvgIcon } from "react-smde";

const { checkedList, orderedList, unorderedList } = commands;

// manual command layout
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

// appending custom commands to the default layout
<MDEditor
    commands={[
        ...defaultCommandLayout,
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

For a dynamic data set example, see the [Demo](#demo) example above, otherwise here's a static data example:

```jsx
import React, { Component } from "react";
import MDEditor from "react-smde";

class App extends Component {
  constructor() {
    super();
    this.state = {
      value: ""
      suggestions: [
        { value: "andre" },
        { value: "angela" },
        { value: "david" },
        { value: "louise" }
      ]
    };
    this.handleValueChange = this.handleValueChange.bind(this);
    this.loadSuggestions = this.loadSuggestions.bind(this);
  }

  handleValueChange(value) {
    this.setState({ value });
  }

  loadSuggestions(searchText) {
    return this.state.suggestions.filter(({ value }) =>
      value.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  render() {
    return(
      <div className="container">
        <MDEditor
          onChange={this.handleValueChange}
          value={this.state.value}
          debounceSuggestions={0}
          loadSuggestions={this.loadSuggestions}
        >
          <ReactMarkdown>{this.state.value}</ReactMarkdown>
        </MDEditor>
      </div>
    );
  }
}
```

## Tooltips

You can specify the position of the tooltip in relation to its target. For example, one of the following `string`s can be passed to the `tooltipPlacement` property:

```
top
bottom
left
right
```

Please note that there must be sufficient surrounding window space for the tooltip to occupy the specified placement area; otherwise, the tooltip location may be incorrectly calculated and cause an undesirable UX.

## Builds

By default, this package is compiled to a `common-js` (CJS - `main`) file with supplemental `Universal Module Definition` (UMD - `fallback`) and a `ECMAScript Module` (ESM - `module`) files. If you wish to use one of the supplemental verisons, then you can do so by either:  

**Option 1**: Import from `react-smde/dist/(esm|umd)/index.(esm.umd).js`. 

**Option 2**: If you're using webpack, then you can utilize the `resolve.mainFields` property and point to one of the fields listed above: `main`, `module`, or `fallback`. See the <a href="https://webpack.js.org/configuration/resolve/#resolvemainfields"> **resolve.mainFields** webpack documentation</a> for more info.

## Report bugs

If you run into any issues, please fill out a <a href="https://github.com/mattcarlotta/react-smde/issues/new?assignees=&labels=&template=bug_report.md&title=">bug report</a>. 

**⚠️ NOTE**: Please provide a reproducible codesandbox example of the bug(s) you're experiencing. Issues that don't provide a reproducible example **may be ignored.**

## Feature Requests

Have a feature you want included or believe the editor is missing a standard feature? You can either fork the repo, commit changes, and submit a new  <a href="https://github.com/mattcarlotta/react-smde/pulls">PR</a> (please include relevant `.tests.js` files and run `npm run test:cov` or `yarn test:cov` to make sure the code is covered) or you can submit a <a href="https://github.com/mattcarlotta/react-smde/issues/new?assignees=&labels=&template=feature_request.md&title=">feature request</a>. 

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
