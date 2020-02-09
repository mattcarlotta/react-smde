import React, { Component } from "react";
import ReactMarkdown from "react-markdown";
import MDEditor from "~components/MDEditor";
import ShowSource from "~components/ShowSource";
import Container from "~components/Container";
import CodeBlock from "./CodeBlock";

class SyntaxHighlightExample extends Component {
	constructor() {
		super();
		this.state = {
			value: `
This example includes a configuration to add syntax highlighting to \`JSX\` code blocks! Please note that this example will vary depending on which editor and which syntax highlighter you choose.

\`\`\`jsx
import React, { useCallback, useEffect, useState } from "react";
import copy from "copy-to-clipboard";
import Button from "~components/Button";
import Modal from "~components/Modal";
import CopyButton from "~components/CopyButton";
import SyntaxHighlighter from "~components/SyntaxHighlighter";
      
const ShowSource = ({ children, text }) => {
  const [showModal, setModalState] = useState(false);
  const [copied, setCopied] = useState(false);
      
  const toggleModalState = useCallback(
    () => setModalState(prevState => !prevState),
    [],
  );
      
  const handleCopyClick = useCallback(() => {
    setCopied(true);
    copy(text, {
      format: "text/plain",
    });
  }, [text]);
      
  useEffect(() => {
    if (!showModal) setCopied(false);
  }, [setCopied, showModal]);
      
  return (
    <>
      {children}
      <Button onClick={toggleModalState}>
        View Source
      </Button>
      {showModal && (
        <Modal maxWidth="100%" onClick={toggleModalState}>
          <SyntaxHighlighter height="400px" language="javascript">
            {text}
          </SyntaxHighlighter>
          <CopyButton copied={copied} onClick={handleCopyClick} />
        </Modal>
      )}
     </>
  );
};
\`\`\``,
		};
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
				maxEditorHeight={850}
			>
				<ReactMarkdown renderers={{ code: CodeBlock }}>
					{this.state.value || "(empty)"}
				</ReactMarkdown>
			</MDEditor>
		);
	}
}

const text = `import React, { Component,PureComponent } from "react";
import ReactMarkdown from "react-markdown";
import MDEditor from "react-smde";
import hljs from "highlight.js";
import "highlight.js/styles/atelier-forest-light.css";

class CodeBlock extends PureComponent {
  componentDidMount() {
    this.highlightCode();
  }

  componentDidUpdate() {
    this.highlightCode();
  }

  highlightCode() {
    hljs.highlightBlock(this.codeEl);
  }

  render() {
    return (
      <pre>
        <code
          ref={node => (this.codeEl = node)}
          className={"language-jsx"}
        >
          {this.props.value}
        </code>
      </pre>
    );
  }
}


class SyntaxHighlightExample extends Component {
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
        <ReactMarkdown renderers={{ code: CodeBlock }}>
          {this.state.value || "(empty)"}
        </ReactMarkdown>
      </MDEditor>
    );
  }
}`;

export default () => (
	<Container>
		<ShowSource text={text}>
			<SyntaxHighlightExample />
		</ShowSource>
	</Container>
);
