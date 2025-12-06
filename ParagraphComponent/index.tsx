import React from 'react';
import { withConfiguration } from '@pega/cosmos-react-core';
import StyledBdExtensionsParagraphComponentWrapper from './styles';

interface BdExtensionsParagraphComponentProps {
  description: string;
  fontSize?: number;
  color?: string;
  bold?: boolean;
}

function BdExtensionsParagraphComponent(props: BdExtensionsParagraphComponentProps) {
  const { description = '', fontSize = 14, color = '#000000', bold = false } = props;

  // Validate hex color (fallback to black if invalid)
  const isHexColor = /^#([0-9A-F]{3}){1,2}$/i.test(color);
  const appliedColor = isHexColor ? color : '#000000';

  // Safe key generator (no ++ to satisfy lint)
  let keyCounter = 0;
  const genKey = (prefix = 'k') => {
    keyCounter += 1;
    return `${prefix}-${keyCounter}`;
  };

  /**
   * Replace {\n}, {\\n}, \\n, or real \n → actual newlines
   */
  const normalizeNewlines = (text: string) =>
    text
      .replace(/\\r\\n/g, '\n') // Windows-style
      .replace(/\\n/g, '\n') // escaped newline
      .replace(/\{\\n\}/g, '\n') // literal {\n}
      .replace(/\{\\\\n\}/g, '\n'); // double-escaped {\\n}

  /**
   * Convert \n → <br />
   */
  const addNewlines = (text: string): React.ReactNode[] => {
    const lines = text.split('\n');
    const nodes: React.ReactNode[] = [];

    lines.forEach((line, idx) => {
      nodes.push(<React.Fragment key={genKey('line')}>{line}</React.Fragment>);
      if (idx < lines.length - 1) {
        nodes.push(<br key={genKey('br')} />);
      }
    });

    return nodes;
  };

  /**
   * Parse inline color tags like {#FF0000}text{/color}
   */
  const parseText = (rawText: string): React.ReactNode[] => {
    const text = normalizeNewlines(rawText);
    const parts: React.ReactNode[] = [];
    const regex = /\{(#[0-9A-Fa-f]{3,6})\}([\s\S]*?)\{\/color\}/g;

    let lastIndex = 0;
    let match: RegExpExecArray | null;

    // eslint-disable-next-line no-cond-assign
    while ((match = regex.exec(text)) !== null) {
      const [fullMatch, colorCode, coloredText] = match;

      if (match.index > lastIndex) {
        parts.push(...addNewlines(text.slice(lastIndex, match.index)));
      }

      parts.push(
        <span key={genKey('color')} style={{ color: colorCode }}>
          {addNewlines(coloredText)}
        </span>
      );

      lastIndex = match.index + fullMatch.length;
    }

    if (lastIndex < text.length) {
      parts.push(...addNewlines(text.slice(lastIndex)));
    }

    return parts;
  };

  const style: React.CSSProperties = {
    fontSize: `${fontSize}px`,
    color: appliedColor,
    fontWeight: bold ? 'bold' : 'normal',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    overflowWrap: 'anywhere',
  };

  return (
    <StyledBdExtensionsParagraphComponentWrapper>
      <p style={style}>{parseText(description)}</p>
    </StyledBdExtensionsParagraphComponentWrapper>
  );
}

export default withConfiguration(BdExtensionsParagraphComponent);
