import React, { createContext } from "react";

const QuoraAudienceContext = createContext({
  emojis: {},
  quoraEmojis: {}
});

export const withQuoraAudienceContext = (Component: any) => (props: any) => {
  return (
    <QuoraAudienceContext.Consumer>
      {context => (
        <Component {...props} context={{ ...props.context, ...context }} />
      )}
    </QuoraAudienceContext.Consumer>
  );
};
export default QuoraAudienceContext;
