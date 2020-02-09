import React, { Component } from "react";
import ReactMarkdown from "react-markdown";
import Container from "~components/Container";
import MDEditor from "~components/MDEditor";
import ShowSource from "~components/ShowSource";
import "./styles.scss";

class CustomClasses extends Component {
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
			<MDEditor
				onChange={this.handleValueChange}
				value={this.state.value}
				classes={{
					mde: "editor",
					mdetooltip: "tooltip",
				}}
				textAreaProps={{
					placeholder:
						"This example uses the 'classes' property to customize the look of the editor!",
				}}
			>
				<ReactMarkdown>{this.state.value || "(empty)"}</ReactMarkdown>
			</MDEditor>
		);
	}
}

const text = `import React, { Component } from "react";
import ReactMarkdown from "react-markdown";
import MDEditor from "react-smde";
import "react-smde/dist/styles/react-smde.css";
import "./styles.scss";

class CustomClassesExample extends Component {
  constructor() {
    super();
    this.state = { value: "" };
    this.handleValueChange = this.handleValueChange.bind(this);
  }

  handleValueChange(value){
    this.setState({ value });
  } 

  render() {
    return (
      <MDEditor
        onChange={this.handleValueChange}
        value={this.state.value}
        classes={{
          mde: "editor",
          mdetooltip: "tooltip",
        }}
        textAreaProps={{
          placeholder:
            "This example uses the 'classes' property to customize the look of the editor!",
        }}
      >
        <ReactMarkdown>{this.state.value || "(empty)"}</ReactMarkdown>
      </MDEditor>
    );
  }
}`;

export default () => (
	<Container>
		<ShowSource text={text}>
			<CustomClasses />
		</ShowSource>
		<p>
			To see the stylesheet source, click{" "}
			<a
				href="https://github.com/mattcarlotta/react-smde/blob/master/src/stories/CustomClassesExample/styles.scss"
				area-label="stylesheet source link"
				rel="noopener noreferrer"
				target="_blank"
			>
				here
			</a>
			.
		</p>
	</Container>
);
