import React, {useState, useCallback} from 'react';

const Menu = ({
  gamePause,
  toggleGamePause
  }) => {

  const [forceUpdate, setForceUpdate] = useState('');
  const toggleGamePauseWrapper = () => {
    toggleGamePause();
    setForceUpdate(Math.random());
  };

  return(
    <div className="menu">
      <button
        className={gamePause.current ? 'resume' : 'pause'}
        onClick={toggleGamePauseWrapper}
      >{gamePause.current ? 'Resume' : 'Pause'}</button>
    </div>
  );
};

export default Menu;
