# react-smde

A **Simple Markdown Editor** for React.

## Table of contents

[Installation](#installation)

[Demo](#demo)

[Basic Usage](#basic-usage)

[Props API](#props-api)

[Markdown Previewing](#markdown-previewing)

[Commands API](#commands-api)

[Suggestions API](#suggestions-api)

[Tooltip API](#tooltip-api)

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

- [Demo]()
- [Demo on CodeSandbox]()

## Basic Usage

```jsx
import MDEditor from "react-smde";
import ReactMarkdown from "react-markdown";
import "react-smde/styles/react-smde.css";

class App extends Component {
  state = {
    value: "## Hello"
  };

  handleValueChange = value => this.setState({ value });

  render = () => (
    <div className="container">
      <MDEditor onChange={this.handleValueChange} value={this.state.value}>
        <ReactMarkdown skipHtml className="mde-preview-content">
          {this.state.value}
        </ReactMarkdown>
      </MDEditor>
    </div>
  );
}
```

## Props API

The following props are accepted by `MDEditor`:

| `prop`                            | Description                                                                                        |
| --------------------------------- | -------------------------------------------------------------------------------------------------- |
| `value`(str)                      | A **required** `string` value.                                                                     |
| `onChange`(func)                  | A **required** callback `function` to handle value changes.                                        |
| `classes`(obj)                    | An optional `object` of `string` classes that will be appended to the specified `className`.†      |
| `autoGrow`(bool)                  | A `boolean` to autogrow the textarea until `maxEditorHeight` (default: `false`).                   |
| `commands`(arr)                   | A single `array` with an array of grouped object commands (see Commands API for more info).        |
| `disablePreview`(bool)            | A `boolean` to disable the preview button. (default: `false`)                                      |
| `maxEditorHeight`(num)            | A maximum editor height `number` that is set in `px`. (default: `500`)                             |
| `minEditorHeight`(num)            | A minimum editor height `number` that is set in `px`. (default: `250`)                             |
| `maxEditorWidth` (num)            | A maximum editor width `number` that is set in `px`. (default: `100%`)                             |
| `minPreviewHeight`(num)           | A minimum preview height `number` that is set in `px`. (default: `200`)                            |
| `readOnly`(bool)                  | A `boolean` to disable editing the text within the textarea. (default: `false`)                    |
| `textAreaProps`(obj)              | An optional `object` of properties to apply to the textarea.                                       |
| `loadSuggestions`(func)           | A `function` that returns an `array` of suggestions triggered by the `suggestionTriggerCharacter`. |
| `debounceSuggestions`(num)        | A `number` set in `ms` to debounce calling the `loadSuggestions` function. (default: `300`)††      |
| `suggestionTriggerCharacter`(str) | A `string` character to trigger suggestions. (default: `@`)                                        |
| `tooltipPlacement`(str)           | The tooltip postion relative to the target. (default: `top` -- see Tooltip API for more info)      |

<details>
<summary>† Click to view a summary of available "mde" class properties</summary>
<pre><code>
mde (applied to root)
mdetoolbar (applied to toolbar)
mdetoolbargroup (applied to toolbar groups)
mdetoolbaritem (applied to toolbar items)
mdetoolbarseparator (applied to toolbar separators)
mdepreview (applied to preview wrapper)
mdepreviewcontent (applied to previewed content)
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

†† Setting `debounceSuggestions` lower than 300ms, will disable the suggestions loading indictor. In testing, a number lower than 300ms caused unavoidable UI flashes when the returned data is static. As such, this allows you to utilize an array of static data and avoid seeing a loading indicator for each key input.

## Markdown Previewing

react-smde is unopinated when it comes to previewing markdown content. Therefore, you **must** supply your own Markdown previewer as `children` to the `MDEditor`. The demo provided in the source and the example below utilizes [react-markdown](https://github.com/rexxars/react-markdown).

```jsx
import React, { Component } from "react";
import MDEditor from "react-smde";
import ReactMarkdown from "react-markdown";
import "react-smde/styles/react-smde.css";

class App extends Component {
  state = {
    value: "## Hello"
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

## Commands API

You can rearrange, remove and adjust command properties (and their icons). The `commands` property of `MDEditor` expects a single array of array groups that contain commands.

Commands are simple objects where `name` must match a name from the predefined [list](src/commands/index.js#L18-L27), however, everything else is customizable:

```
{
  name: "bold",
  tooltip: "Add bold text (ctrl+b)",
  buttonProps: { "aria-label": "Add bold text" },
  icon: <SvgIcon icon="bold" />
}
```

For example:

```jsx
import MDEditor, { commands } from "react-smde";
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
            icon: <>Bold</>
          }
        ]
      ]
    }
    ...otherProps
>
  ...etc
</MDEditor>
```

## Suggestions API

In order to use suggestions, you must supply a callback function to the `MDEditor` as `loadSuggestions`. The `loadSuggestions` callback function **must** return data in the following structure:

```
[
  { value: "example1" },
  { value: "example2" },
  { value: "example3" },
  ...etc
]
```

By default, the `MDEditor` expects the data to be filtered server-side or by the `loadSuggestions` callback function. The suggestions overlay will only be triggered by the `suggestionTriggerCharacter` and will only execute the `loadSuggestions` function as determined by the `debounceSuggestions` property.

Please note that setting a `debounceSuggestions` lower than `300`ms will disable the loading indicator -- this is useful if the returned data remains static.

For example, static data is returned:

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

  loadSuggestions = searchText => {
    return this.state.suggestions.filter(({ value }) =>
      value.toLowerCase().includes(searchText.toLowerCase())
    );
  };

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

## Tooltip API

You can specify the position of the tooltip in relation to its target. For example, one of the following `string`s can be passed to `tooltipPlacement` property:

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
