// calling mount function in marketing's remoteEntry.js
// should not alias to any library specific name eg MarketingReactApp
import { mount } from 'marketing/MarketingApp';
import React, { useRef, useEffect } from 'react';

export default () => {
  const ref = useRef(null);

  useEffect(() => {
    mount(ref.current, {
      onNavigate: () => {
        console.log('navigation noticed in marketing');
      }
    });
  });

  return <div ref={ref} />;
};
