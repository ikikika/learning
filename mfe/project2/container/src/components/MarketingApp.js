// calling mount function in marketing's remoteEntry.js
// should not alias to any library specific name eg MarketingReactApp
import { mount } from 'marketing/MarketingApp';
import React, { useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export default () => {
  const ref = useRef(null);
  const history = useHistory();

  useEffect(() => {
    const {onParentNavigate} = mount(ref.current, {
      onNavigate: (location) => {
        const {pathname} = history.location;
        const nextpathName = location.pathname;
        if( pathname !== nextpathName ){
          console.log('navigation noticed in marketing');
          history.push(nextpathName);
        }
      }
    });

    history.listen(onParentNavigate);
  }, []);

  return <div ref={ref} />;
};
