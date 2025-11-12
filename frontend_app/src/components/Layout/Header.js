import React from 'react';
import PropTypes from 'prop-types';

/**
 * PUBLIC_INTERFACE
 * Header component that displays the application title and optional right-aligned actions.
 * Uses Ocean Professional theme variables for styling.
 */
function Header({ title, actions }) {
  return (
    <header className="rps-header" role="banner">
      <div className="rps-header__content">
        <h1 className="rps-header__title">{title}</h1>
        <div className="rps-header__actions" role="group" aria-label="Header actions">
          {actions}
        </div>
      </div>
    </header>
  );
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  actions: PropTypes.node
};

Header.defaultProps = {
  actions: null
};

export default Header;
