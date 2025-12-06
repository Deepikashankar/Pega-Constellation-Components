import {
  FieldValueList,
  Text,
  withConfiguration
} from '@pega/cosmos-react-core';

import type { PConnFieldProps } from './PConnProps';
import './create-nonce';

import StyledBdExtnLinkComponentWrapper from './styles';

interface BdExtnLinkComponentProps extends PConnFieldProps {
  paragraphText: string;
  textSize: number;
  testId: string;
  label: string;
  hideLabel: boolean;
  displayMode?: string;
}

const LINK_REGEX =
  /<Link\s+url="([^"]+)"\s*>(.*?)<\/Link>/gi;

function parseParagraph(text: string, fontSize: string) {
  const parts: any[] = [];
  let lastIndex = 0;
  let match;

  // eslint-disable-next-line no-cond-assign
  while ((match = LINK_REGEX.exec(text)) !== null) {
    const [full, url, label] = match;
    const start = match.index;

    if (start > lastIndex) {
      parts.push(
        <span
          key={`txt-${start}`}
          style={{
            display: "inline",
            fontSize,
            color: "inherit",
            textDecoration: "none"
          }}
        >
          {text.substring(lastIndex, start)}
        </span>
      );
    }

    parts.push(
      <a
        key={`lnk-${start}`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline",
          fontSize,
          color: "#0050B3",
          textDecoration: "underline",
          cursor: "pointer"
        }}
      >
        {label}
      </a>
    );

    lastIndex = start + full.length;
  }

  if (lastIndex < text.length) {
    parts.push(
      <span
        key="txt-last"
        style={{
          display: "inline",
          fontSize,
          color: "inherit",
          textDecoration: "none"
        }}
      >
        {text.substring(lastIndex)}
      </span>
    );
  }

  return parts;
}

function BdExtnLinkComponent(props: BdExtnLinkComponentProps) {
  const {
    getPConnect,
    paragraphText = "",
    textSize = 14,
    testId,
    label,
    hideLabel,
    displayMode
  } = props;

  const pConn = getPConnect();
  const rawValue: string =
    pConn.getValue("paragraphText") || paragraphText;

  const fontSize = `${textSize}px`;
  const content = parseParagraph(rawValue, fontSize);

  /** ALWAYS DISPLAY — NEVER EDIT */
  const RenderBlock = (
    <StyledBdExtnLinkComponentWrapper
      style={{ fontSize, lineHeight: "20px" }}
      data-testid={testId}
    >
      {content}
    </StyledBdExtnLinkComponentWrapper>
  );

  if (displayMode === "DISPLAY_ONLY") return RenderBlock;

  if (displayMode === "LABELS_LEFT") {
    return (
      <StyledBdExtnLinkComponentWrapper style={{ fontSize }}>
        <FieldValueList
          data-testid={testId}
          fields={[
            {
              id: "1",
              name: hideLabel ? "" : label,
              value: RenderBlock
            }
          ]}
        />
      </StyledBdExtnLinkComponentWrapper>
    );
  }

  if (displayMode === "STACKED_LARGE_VAL") {
    return (
      <StyledBdExtnLinkComponentWrapper style={{ fontSize }}>
        <FieldValueList
          variant="stacked"
          fields={[
            {
              id: "2",
              name: hideLabel ? "" : label,
              value: <Text variant="h1">{content}</Text>
            }
          ]}
        />
      </StyledBdExtnLinkComponentWrapper>
    );
  }

  /** DEFAULT MODE → STILL DISPLAY ONLY */
  return RenderBlock;
}

export default withConfiguration(BdExtnLinkComponent);
