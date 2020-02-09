import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const iconStyle = {
	marginRight: 5,
	position: "relative",
	top: 2,
};

const CopyButton = ({ className, copied, onClick }) => (
	<button className={className} type="button" onClick={onClick}>
		{!copied ? (
			<>
				<span style={iconStyle}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true"
						focusable="false"
						width="20"
						height="20"
						viewBox="0 0 24 24"
					>
						<path
							d="M4 7v14h14v2H4c-1.1 0-2-.9-2-2V7h2m16-4c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h3.18C11.6 1.84 12.7 1 14 1c1.3 0 2.4.84 2.82 2H20m-6 0c-.55 0-1 .45-1 1s.45 1 1 1s1-.45 1-1s-.45-1-1-1m-4 4V5H8v12h12V5h-2v2h-8z"
							fill="currentColor"
						/>
					</svg>
				</span>
				Copy
			</>
		) : (
			<>
				<span style={iconStyle}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true"
						focusable="false"
						width="20"
						height="20"
						viewBox="0 0 24 24"
					>
						<path
							d="M4 7v14h14v2H4c-1.1 0-2-.9-2-2V7h2m8.8 8.35l-3.3-3.3l1.4-1.4l1.9 1.9l4.3-4.3l1.4 1.4l-5.7 5.7M20 3c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h3.18C11.6 1.84 12.7 1 14 1c1.3 0 2.4.84 2.82 2H20m-6 0c-.55 0-1 .45-1 1s.45 1 1 1s1-.45 1-1s-.45-1-1-1m-4 4V5H8v12h12V5h-2v2h-8z"
							fill="currentColor"
						/>
					</svg>
				</span>
				Copied
			</>
		)}
	</button>
);

CopyButton.propTypes = {
	className: PropTypes.string.isRequired,
	copied: PropTypes.bool.isRequired,
	onClick: PropTypes.func.isRequired,
};

export default styled(CopyButton)`
	color: #fff;
	background-color: ${({ copied }) => (copied ? "#f56342" : "#0f7ae5")};
	width: 200px;
	margin-left: auto;
	margin-right: auto;
	margin-top: 20px;
	margin-bottom: 10px;
	cursor: pointer;
	font-size: 18px;
	font-weight: bold;
	padding: 8px 16px;
	border-radius: 4px;
	border: 1px solid transparent;
	&:focus {
		outline: none;
	}

	&::after {
		content: "";
		clear: both;
		display: table;
	}
`;
