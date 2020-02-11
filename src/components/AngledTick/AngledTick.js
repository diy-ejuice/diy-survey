import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

export default class AngledTick extends PureComponent {
  static propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    payload: PropTypes.object
  };

  static defaultProps = {
    x: 0,
    y: 0,
    payload: {}
  };

  render() {
    const { x, y, payload } = this.props;

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={18}
          textAnchor="end"
          fill="#666"
          transform="rotate(-35)"
          fontSize={14}
        >
          {payload.value}
        </text>
      </g>
    );
  }
}
