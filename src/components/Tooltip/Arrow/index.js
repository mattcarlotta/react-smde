import styled from "styled-components";

const setPlacement = (tooltip, placement) => {
	switch (placement) {
		case "bottom":
			return "top: 30px;";
		case "right":
			return "top: 5px; left: 30px;";
		case "left":
			return "top: 5px; right: 30px";
		default:
			return `top: ${tooltip.height}px; right: 0px;`;
	}
};

export default styled.div`
	position: absolute;
	display: block;
	width: 13.07107px;
	height: 13.07107px;
	overflow: hidden;
	background: transparent;
	pointer-events: none;
	left: 50%;
	transform: translateX(-50%);
	${({ tooltipDimensions, placement }) =>
		setPlacement(tooltipDimensions, placement)}

	&::before {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		display: block;
		width: 5px;
		height: 5px;
		margin: auto;
		background-color: rgba(0, 0, 0, 0.77);
		content: "";
		pointer-events: auto;
		transform: translateY(-6.53553px) rotate(45deg);
	}
`;
