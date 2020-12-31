import React, { createContext } from 'react';

const AudienceContext = createContext({
  emojis: {},
  quoraEmojis: {},
});

export const withAudienceContext = <P extends Record<string, unknown>>(
  Component: React.ComponentType<P>
) => (props: any) => {
  return (
    <AudienceContext.Consumer>
      {(context) => (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <Component {...props} context={{ ...props.context, ...context }} />
      )}
    </AudienceContext.Consumer>
  );
};
export default AudienceContext;
