import styled from "styled-components";

const setPlacement = (container, tooltip, placement) => {
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
		setPlacement(containerDimensions, tooltipDimensions, placement)}
`;
