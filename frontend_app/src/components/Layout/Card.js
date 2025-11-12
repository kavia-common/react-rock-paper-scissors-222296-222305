import React from 'react';
import PropTypes from 'prop-types';

/**
 * PUBLIC_INTERFACE
 * Card component that provides a surface with padding, rounded corners,
 * and subtle shadow following the Ocean Professional theme.
 */
function Card({ children, className, as: Tag, ariaLabel }) {
  return (
    <Tag
      className={`rps-card animate-pop ${className || ''}`.trim()}
      role="region"
      aria-label={ariaLabel || 'Content Area'}
    >
      {children}
    </Tag>
  );
}

Card.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
  ariaLabel: PropTypes.string
};

Card.defaultProps = {
  children: null,
  className: '',
  as: 'section',
  ariaLabel: 'Content Area'
};

export default Card;
