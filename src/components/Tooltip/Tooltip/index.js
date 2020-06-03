import styled from "styled-components";

const setContainerPlacement = (container, tooltip, placement) => {
	switch (placement) {
		case "bottom":
			return "top: 30px;";
		case "right":
			return "top: 5px; left: 30px;";
		case "left":
			return "top: 5px; right: 30px";
		default:
			return `top: ${container.height * 2 - 10}px; left: ${container.height +
				container.left -
				tooltip.width / 2}px;`;
	}
};

const setArrowPlacement = (tooltip, placement) => {
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
	font-size: 14px;
	line-height: 1.5715;
	position: absolute;
	z-index: 1000;
	max-width: 250px;
	opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
	box-shadow: 0px 8px 8px -2px rgba(0, 0, 0, 0.25);
	background-color: rgba(0, 0, 0, 0.77);
	color: #eee;
	transition: opacity 0.125s ease-in-out;
	${({ containerDimensions, tooltipDimensions, placement }) =>
		setContainerPlacement(containerDimensions, tooltipDimensions, placement)};

	& .TooltipArrow {
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
			setArrowPlacement(tooltipDimensions, placement)}

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
	}

	& .TooltipOverlay {
		padding: 6px 8px;
	}
`;
