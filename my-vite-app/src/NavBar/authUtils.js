

/**
 * Get the display name from a user object
 * @param {Object} user - The user object
 * @returns {String} The display name
 */
export const getDisplayName = (user) => {
    if (!user) return 'User';
    return user.unique_name || user.name || user.username || user.email?.split('@')[0] || 'User';
  };
  

  export const isActiveLink = (path, sectionId, location) => {
    // For path with section
    if (sectionId) {
      return location.pathname.toLowerCase() === path.toLowerCase() && 
             location.hash.toLowerCase() === `#${sectionId}`.toLowerCase();
    }
    // For path without section
    return location.pathname.toLowerCase() === path.toLowerCase() && 
           (!location.hash || location.hash === '');
  };
  

  export const getNavigationItems = (
    user, 
    authenticated, 
    handleLogout, 
    handleMessageClick,
    handleLoginClick
  ) => {
    
    const items = [
      { name: 'Home', icon: 'HomeIcon', path: '/home' },
      { name: 'Topic', icon: 'ArticleIcon', path: '/home', sectionId: 'topic' },
      { name: 'Training', icon: 'BuildIcon', path: '/home', sectionId: 'training' },
      { name: 'Gantt', icon: 'DateRangeIcon', path: '/gantt' },
      { name: 'Message', icon: 'MessageIcon', onClick: handleMessageClick },
    ];
    
    // Add profile or login based on authentication status
    if (authenticated && user) {
      items.push({ name: 'Profile', icon: 'PersonIcon', path: '/profile' });
      items.push({ name: 'Logout', icon: 'LoginIcon', onClick: handleLogout });
    } else {
      items.push({ name: 'Login', icon: 'LoginIcon', onClick: handleLoginClick });
    }
    
    return items;
  };