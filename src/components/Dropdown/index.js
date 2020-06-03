/* istanbul ignore file */
import styled from "styled-components";

export default styled.ul`
	position: absolute;
	left: 5px;
	top: 35px;
	background-color: #fff;
	border: 1px solid #c8ccd0;
	padding: 5px;
	z-index: 2;
	transform: translateX(-9px);

	li {
		margin: 0;
		white-space: nowrap;
		list-style: none;
		display: block;

		button {
			display: block;
			height: auto;

			p {
				display: block;
				margin: 0;
				padding: 0;
				font-weight: bold;
				line-height: 1em;
				background: none;
				border: 0;
				text-align: left;

				&.header-1 {
					font-size: 36px;
				}

				&.header-2 {
					font-size: 30px;
				}

				&.header-3 {
					font-size: 24px;
				}

				&.header-4 {
					font-size: 18px;
				}

				&.header-5 {
					font-size: 14px;
				}

				&.header-6 {
					font-size: 12px;
				}
			}
		}
	}

	&::before {
		position: absolute;
		content: "";
		width: 0;
		height: 0;
		border: 8px solid transparent;
		border-bottom-color: rbga(0, 0, 0, 0.15);
		top: -16px;
		left: 3px;
		transform: translateX(50%);
	}

	&::after {
		position: absolute;
		content: "";
		width: 0;
		height: 0;
		border: 7px solid transparent;
		border-bottom-color: #fff;
		top: -14px;
		left: 5px;
		transform: translateX(50%);
	}
`;
