/* istanbul ignore file */
import styled from "styled-components";

export default styled.div`
	padding: 6px 6px 6px 0px;
	text-align: left;
	overflow-y: auto;
	margin-right: -4px;

	p,
	blockquote,
	ul,
	ol,
	dl,
	table,
	pre {
		margin-top: 0;
		margin-bottom: 16px;
	}

	hr {
		height: 0.25em;
		padding: 0;
		margin: 24px 0;
		background-color: #e1e4e8;
		border: 0;
	}

	h1,
	h2,
	h3 {
		margin-top: 24px;
		margin-bottom: 16px;
		font-weight: 600;
		line-height: 1.25;
		border-bottom: 1px solid #eee;
		padding-bottom: 0.3em;
	}

	h1 {
		font-size: 36px;
	}

	h2 {
		font-size: 30px;
	}

	h3 {
		font-size: 24px;
	}

	h4 {
		font-size: 18px;
	}

	h5 {
		font-size: 14px;
	}

	h6 {
		font-size: 12px;
	}

	ul,
	ol {
		padding-left: 2em;
	}

	blockquote {
		margin-left: 0;
		padding: 0 1em;
		color: #777;
		border-left: 0.25em solid #ddd;

		& > :first-child {
			margin-top: 0;
		}

		& > :last-child {
			margin-bottom: 0;
		}
	}

	code {
		padding: 0.2em 0 0.2em 0;
		margin: 0;
		font-size: 90%;
		background-color: #efefef;
		border-radius: 3px;
		white-space: pre-wrap;

		&::before,
		&::after {
			letter-spacing: -0.2em;
			content: "\\00a0";
		}
	}

	pre {
		padding: 16px;
		overflow: auto;
		font-size: 85%;
		line-height: 1.45;
		background-color: #efefef;
		border-radius: 3px;

		code {
			display: inline;
			padding: 0;
			margin: 0;
			overflow: visible;
			line-height: inherit;
			word-wrap: normal;
			background-color: transparent;
			border: 0;
			&::before,
			&::after {
				content: none;
			}
		}

		> code {
			padding: 0;
			margin: 0;
			font-size: 100%;
			word-break: normal;
			white-space: pre;
			background: transparent;
			border: 0;
		}
	}

	img {
		max-width: 100%;
	}

	a {
		color: #4078c0;
		text-decoration: none;
		&:hover {
			text-decoration: underline;
		}
	}

	& > *:first-child {
		margin-top: 0 !important;
	}

	& > *:last-child {
		margin-bottom: 0 !important;
	}

	&::after {
		display: table;
		clear: both;
		content: "";
	}

	table {
		display: block;
		width: 100%;
		border-spacing: 0;
		border-collapse: collapse;

		thead {
			th {
				font-weight: bold;
			}
		}

		th,
		td {
			padding: 6px 13px;
			border: 1px solid #c8ccd0;
		}
	}
`;
