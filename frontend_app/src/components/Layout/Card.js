import React from 'react';
import PropTypes from 'prop-types';

/**
 * PUBLIC_INTERFACE
 * Card component that provides a surface with padding, rounded corners,
 * and subtle shadow following the Ocean Professional theme.
 */
function Card({ children, className, as: Tag }) {
  return (
    <Tag className={`rps-card ${className || ''}`.trim()} role="region">
      {children}
    </Tag>
  );
}

Card.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType])
};

Card.defaultProps = {
  children: null,
  className: '',
  as: 'section'
};

export default Card;
