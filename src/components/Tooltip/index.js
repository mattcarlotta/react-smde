import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import Tooltip from "./Tooltip";

// TODO - Add right, bottom, left tooltip positions

const containerDimensions = {
	bottom: 0,
	height: 0,
	left: 0,
	right: 0,
	top: 0,
	width: 0,
	x: 0,
	y: 0,
};
const tooltipDimensions = containerDimensions;

class TooltipContainer extends React.Component {
	state = {
		isVisible: false,
		wasCreated: false,
		containerDimensions,
		tooltipDimensions,
	};

	componentDidUpdate = prevProps => {
		const { disabled, overlay } = this.props;

		if (overlay !== prevProps.overlay) this.setTooltipDimensions();
		if (disabled !== prevProps.disabled) this.hideTooltip();
	};

	handleVisibleChange = () => {
		this.setState(
			{
				isVisible: true,
				wasCreated: true,
			},
			this.setTooltipDimensions,
		);
	};

	hideTooltip = () => this.setState({ isVisible: false });

	setTooltipDimensions = () => {
		this.setState({
			containerDimensions: this.containerRef
				? this.containerRef.getBoundingClientRect()
				: containerDimensions,
			tooltipDimensions: this.tooltipRef
				? this.tooltipRef.getBoundingClientRect()
				: tooltipDimensions,
		});
	};

	render = () => (
		<div
			onMouseEnter={!this.props.disabled ? this.handleVisibleChange : null}
			onMouseLeave={!this.props.disabled ? this.hideTooltip : null}
		>
			<span ref={node => (this.containerRef = node)}>
				{this.props.children}
			</span>
			{this.state.wasCreated &&
				ReactDOM.createPortal(
					<Tooltip
						{...this.state}
						ref={node => (this.tooltipRef = node)}
						placement={this.props.placement}
					>
						<div className="TooltipArrow" />
						<div className="TooltipOverlay">{this.props.overlay}</div>
					</Tooltip>,
					document.body,
				)}
		</div>
	);
}

TooltipContainer.propTypes = {
	children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
	className: PropTypes.string,
	overlay: PropTypes.string.isRequired,
	placement: PropTypes.string.isRequired,
};

export default TooltipContainer;
