import React from "react";
import PropTypes from "prop-types";
import { Prism } from "react-syntax-highlighter";
import atomDark from "react-syntax-highlighter/dist/esm/styles/prism/atom-dark";
import styled from "styled-components";

const Highlighter = ({ className, children }) => (
	<Prism className={className} language="jsx" style={atomDark}>
		{children}
	</Prism>
);

Highlighter.propTypes = {
	className: PropTypes.string.isRequired,
	children: PropTypes.string.isRequired,
};

const StyledHighlighter = styled(Highlighter)`
	color: #ffffff !important;
	background: #191919 !important;
	white-space: pre-wrap !important;
	word-break: break-word !important;
	height: auto;
	width: 95%;
	overflow-y: auto;
	margin-left: auto !important;
	margin-right: auto !important;
	margin-top: 20px !important;
	border-radius: 4px !important;
	transition: height 350ms cubic-bezier(0.4, 0, 0.2, 1);
	code {
		display: block;
		color: #ffffff !important;
		white-space: pre-wrap !important;
		word-break: break-word !important;
		background: #191919 !important;
		padding: 0 !important;
		font-size: 16px !important;
		line-height: 2;
		white-space: pre;
		font-weight: normal;
		text-align: left;
	}
`;

export default StyledHighlighter;
