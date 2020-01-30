# react-smde

An unopinationed, simple, **Markdown Editor** for React.

## Demo

- [Demo]()
- [Demo on CodeSandbox]()

## Installing

```
npm i react-smde
```

or

```
yarn install react-smde
```

## Usage

```jsx
import MDEditor from "react-smde";
import ReactMarkdown from "react-markdown";
import "react-smde/index.css";

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

## Props

The types are described below

- **value: string**: The Markdown value.
- **onChange**: (value: string): Event handler for the `onChange` event.
- **selectedTab: "write" | "preview"**: The currently selected tab.
- **onTabChange: (tab) => void**: Function called when the selected tab changes.
- **classes?**: [An object](https://github.com/andrerpena/react-mde/blob/master/src/classes.ts) containing the following optional properties: _reactMde_, _toolbar_, _preview_, _textArea_, _grip_ and _suggestionsDropdown_.
  This allows for passing class names to each of the inner components of React-mde. Classes defined in the _classes_ prop
  follow the specification of [Jed Watson's classNames project](https://github.com/JedWatson/classnames).
- **className?: string**: OBSOLETE - Optional class name to be added to the top level element. Use the _classes_ prop instead.
- **commands?: CommandGroup[]**: An array of `CommandGroup`, which, each one, contain a `commands` property (array of `Command`). If no commands are specified, the default will be used. Commands are explained in more details below.
- **readOnly: boolean**: Flag to render the editor in read-only mode.
- **textAreaProps**: Extra props to be passed to the `textarea` component.
- **minEditorHeight (number)**: The minimum height of the editor.
- **maxEditorHeight (number)**: The max height of the editor (after that, it will scroll).
- **maxEditorWidth (number)**: The max width of the editor.
- **minPreviewHeight (number)**: The minimum height of the preview.
- **loadSuggestions (text: string, triggeredBy: string) => Promise<Suggestion[]>**: Function to load mention suggestions based on the
  given `text` and `triggeredBy` (character that triggered the suggestions). The result should be an array of `{preview: React.ReactNode, value: string}`.
  The `preview` is what is going to be displayed in the suggestions box. The `value` is what is going to be inserted in the `textarea` on click or enter.
- **suggestionTriggerCharacters (string[])**: Characters that will trigger mention suggestions to be loaded. This property is useless
  without `loadSuggestions`.

## Markdown Previewing

react-smde is unopinated when it comes to previewing markdown content. Therefore, you **must** supply your own Markdown previewer as `children` to the `MDEditor`. The demo provided in the source and the example below utilizes [react-markdown](https://github.com/rexxars/react-markdown).

```jsx
import MDEditor from "react-smde";
import ReactMarkdown from "react-markdown";

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

## Customizing Commands and Icons

You can rearrange, remove and adjust commands (and their icons). The `commands` property of react-smde expects an array of array groups that contains commands (which are simple objects). For example, import the existing `commands` as displayed below.

Commands are simple objects where `name` must match a name that is in the predefined [list](src/commands/index.js#L18-L27), however, everything else is editable:

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
import MDEditor, {commands} from "react-smde";

<MDEditor
    commands={[
        [commands.orderedList, commands.unorderedList, commands.checkedList],
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
    ...
/>
```

## License

react-smde is [MIT licensed](LICENSE).

## Third party

In order to make react-smde, the following packages are referenced and used within this package:

- https://github.com/grassator/insert-text-at-cursor
- https://github.com/JedWatson/classnames
- https://github.com/andrerpena/react-mde
- https://github.com/ant-design/ant-design
- https://github.com/react-component/tooltip
