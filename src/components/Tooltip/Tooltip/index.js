import styled from "styled-components";

const setContainerPlacement = (container, tooltip, placement) => {
	switch (placement) {
		case "bottom":
			return `top: ${container.bottom +
				container.height / 2}px;left: ${container.height +
				container.left -
				tooltip.width / 2}px;padding-top: 8px;`;
		case "right":
			return `top: ${container.top - container.height / 2}px;left: ${
				container.right
			}px;padding-left: 8px;`;
		case "left":
			return `top: ${container.top -
				container.height / 2}px;left: ${container.left -
				tooltip.width}px;padding-right: 8px;`;
		default:
			return `top: ${container.height - 4}px;left: ${container.height +
				container.left -
				tooltip.width / 2}px;padding-bottom: 8px;`;
	}
};

const setArrowWindowPlacement = placement => {
	switch (placement) {
		case "bottom":
			return `left: 50%;top: -5px;transform: translateX(-50%);`;
		case "right":
			return "top: 50%;left: -5px;transform: translateY(-50%);";
		case "left":
			return "top: 50%;right: -5px;transform: translateY(-50%);";
		default:
			return `left: 50%;bottom: -5px;transform: translateX(-50%);`;
	}
};

const setArrowRotation = placement => {
	switch (placement) {
		case "bottom":
			return `translateY(6.5355px)`;
		case "right":
			return "translateX(6.5355px)";
		case "left":
			return "translateX(-6.5355px)";
		default:
			return "translateY(-6.5355px)";
	}
};

export default styled.div`
	margin: 0;
	padding: 0;
	color: #eee;
	font-size: 14px;
	line-height: 1.5715;
	list-style: none;
	position: absolute;
	z-index: 1000;
	max-width: 250px;
	display: ${({ isVisible }) => (isVisible ? "block" : "none")};
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
		${({ placement }) => setArrowWindowPlacement(placement)}

		&::before {
			transform: ${({ placement }) =>
				`${setArrowRotation(placement)} rotate(45deg);`};
			box-shadow: 3px 3px 7px rgba(0, 0, 0, 0.07);
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
		}
	}

	& .TooltipOverlay {
		min-width: 30px;
		min-height: 32px;
		padding: 6px 8px;
		color: #fff;
		text-align: left;
		text-decoration: none;
		word-wrap: break-word;
		background-color: rgba(0, 0, 0, 0.77);
		border-radius: 4px;
		box-sizing: border-box;
		box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12),
			0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
	}
`;
