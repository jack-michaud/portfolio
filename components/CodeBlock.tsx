import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import monokai from 'react-syntax-highlighter/dist/cjs/styles/hljs/monokai';

interface IProps {
  value: string;
  language: string;
}
const CodeBlock = (props: IProps) => {
  return (
    <SyntaxHighlighter language={props.language} style={monokai}>
      { props.value }
    </SyntaxHighlighter>
  )
}

export default CodeBlock;
