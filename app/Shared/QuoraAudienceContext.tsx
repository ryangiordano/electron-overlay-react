import React, { createContext } from 'react';

const QuoraAudienceContext = createContext({
  emojis: {},
  quoraEmojis: {},
});

export const withQuoraAudienceContext = <P extends Record<string, unknown>>(
  Component: React.ComponentType<P>
) => (props: any) => {
  return (
    <QuoraAudienceContext.Consumer>
      {(context) => (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <Component {...props} context={{ ...props.context, ...context }} />
      )}
    </QuoraAudienceContext.Consumer>
  );
};
export default QuoraAudienceContext;
