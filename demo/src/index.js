import React, { Component } from "react";
import { render } from "react-dom";
import MDEditor from "../../src/index.js";
import ReactMarkdown from "react-markdown";
// import MDEditor from "../../dist/index.js";
import "../../src/styles/all.scss";
import "../../dist/index.css";
import "./styles/demo.scss";

class App extends Component {
  state = {
    value: "## Hello"
  };

  handleValueChange = value => this.setState({ value });

  loadSuggestions = text => {
    return new Promise(resolve => {
      setTimeout(() => {
        const suggestions = [
          {
            value: "andre"
          },
          {
            value: "angela"
          },
          {
            value: "david"
          },
          {
            value: "louise"
          }
        ].filter(({ value }) =>
          value.toLowerCase().includes(text.toLowerCase())
        );
        resolve(suggestions);
      }, 250);
    });
  };

  render = () => (
    <div className="container">
      <MDEditor
        onChange={this.handleValueChange}
        value={this.state.value}
        loadSuggestions={this.loadSuggestions}
        suggestionTriggerCharacters={["@"]}
      >
        <ReactMarkdown skipHtml className="mde-preview-content">
          {this.state.value}
        </ReactMarkdown>
      </MDEditor>
    </div>
  );
}

render(<App />, document.getElementById("root"));
