import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import monokai from 'react-syntax-highlighter/dist/cjs/styles/hljs/monokai';

interface IProps {
  children?: React.ReactNode;
  className?: string;
}
const CodeBlock = (props: IProps) => {
  const match = /language-(\w+)/.exec(props.className || '');
  const language = match ? match[1] : '';
  const code = String(props.children).replace(/\n$/, '');

  return (
    <SyntaxHighlighter language={language} style={monokai}>
      {code}
    </SyntaxHighlighter>
  )
}

export default CodeBlock;
