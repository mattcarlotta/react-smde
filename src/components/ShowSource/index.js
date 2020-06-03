import React from "react";
import copy from "copy-to-clipboard";
import PropTypes from "prop-types";
import Button from "~components/Button";
import Modal from "~components/Modal";
import CopyButton from "~components/CopyButton";
import SyntaxHighlighter from "~components/SyntaxHighlighter";

const ShowSource = ({ children, text }) => {
	const [showModal, setModalState] = React.useState(false);
	const [copied, setCopied] = React.useState(false);

	const toggleModalState = React.useCallback(
		() => setModalState(prevState => !prevState),
		[],
	);

	const handleCopyClick = React.useCallback(() => {
		setCopied(true);
		copy(text, {
			format: "text/plain",
		});
	}, [text]);

	React.useEffect(() => {
		if (!showModal) setCopied(false);
	}, [setCopied, showModal]);

	return (
		<>
			{children}
			<Button onClick={toggleModalState}>
				<span style={{ marginRight: 10, position: "relative", top: 5 }}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 50 50"
					>
						<path
							fill="currentColor"
							d="M 29.125 7.34375 L 17.125 41.34375 L 20.875 42.65625 L 32.875 8.65625 L 29.125 7.34375 z M 9.9375 13.375 L 1.25 23.71875 L 0.1875 25 L 1.25 26.28125 L 9.9375 36.65625 L 13.03125 34.09375 L 5.40625 25 L 13 15.9375 L 9.9375 13.375 z M 40.0625 13.375 L 37 15.9375 L 44.59375 25 L 37 34.0625 L 40.09375 36.625 L 48.71875 26.28125 L 49.78125 25 L 48.71875 23.71875 L 40.0625 13.375 z"
						/>
					</svg>
				</span>
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

ShowSource.propTypes = {
	children: PropTypes.node.isRequired,
	text: PropTypes.string.isRequired,
};

export default ShowSource;
