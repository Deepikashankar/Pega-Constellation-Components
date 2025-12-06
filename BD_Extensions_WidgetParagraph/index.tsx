import React from 'react';
import { withConfiguration } from '@pega/cosmos-react-core';
import StyledBdExtensionsWidgetParagraphWrapper from './styles';

interface BdExtensionsWidgetParagraphProps {
  description: string;
  fontSize?: number;
  color?: string;
  bold?: boolean;
}

function BdExtensionsWidgetParagraph(props: BdExtensionsWidgetParagraphProps) {
  const { description, fontSize = 14, color = '#000000', bold = false } = props;

  // validate hex color (fallback to black if invalid)
  const isHexColor = /^#([0-9A-F]{3}){1,2}$/i.test(color);
  const appliedColor = isHexColor ? color : '#000000';

  const style: React.CSSProperties = {
    fontSize: `${fontSize}px`,
    color: appliedColor,
    fontWeight: bold ? 'bold' : 'normal',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    overflowWrap: 'anywhere'
  };

  return (
    <StyledBdExtensionsWidgetParagraphWrapper>
      <p style={style}>{description}</p>
    </StyledBdExtensionsWidgetParagraphWrapper>
  );
}

export default withConfiguration(BdExtensionsWidgetParagraph);
