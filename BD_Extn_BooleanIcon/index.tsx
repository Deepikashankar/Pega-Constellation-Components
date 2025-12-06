import {
  CheckboxGroup,
  FieldValueList,
  Text,
  withConfiguration,
  BooleanDisplay
} from "@pega/cosmos-react-core";

import type { PConnFieldProps } from "./PConnProps";
import "./create-nonce";

// includes in bundle
import handleEvent from "./event-utils";
import StyledBdExtnBooleanIconWrapper from "./styles";

// props
interface BdExtnBooleanIconProps extends PConnFieldProps {
  displayAsStatus?: boolean;
  isTableFormatter?: boolean;
  hasSuggestions?: boolean;
  variant?: any;
  formatter: string;
  caption: string;
  trueLabel: string;
  falseLabel: string;

  // Independent top label (with reserved space)
  topLabel?: string;
  hideTopLabel?: boolean;
}

// state props from PConnect
interface StateProps {
  value: string;
  hasSuggestions: boolean;
}

// inline search icon (SVG) — outline only
function SearchIcon({ disabled }: { disabled: boolean }) {
  const opacity = disabled ? 0.4 : 1;
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      style={{ display: "inline-block", verticalAlign: "middle", opacity }}
    >
      {/* outline only, never filled */}
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function BdExtnBooleanIcon(props: BdExtnBooleanIconProps) {
  const {
    getPConnect,
    value = false,
    label = "",
    helperText = "",
    caption,
    validatemessage,
    hideLabel,
    testId,
    additionalProps = {},
    displayMode,
    variant = "inline",
    trueLabel,
    falseLabel,

    // top label controls
    topLabel = "",
    hideTopLabel = false
  } = props;

  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const stateProps = pConn.getStateProps() as StateProps;

  const propName = String(stateProps?.value ?? "");

  // normalize boolean-like props that might arrive as strings
  let { readOnly = false, required = false, disabled = false } = props;
  [readOnly, required, disabled] = [readOnly, required, disabled].map(
    (prop) => prop === true || (typeof prop === "string" && prop === "true")
  );

  let status: "error" | "success" | "warning" | "pending" | undefined;
  if (validatemessage && validatemessage !== "") status = "error";

  const isDisabled = disabled || readOnly;
  const isChecked = !!value;

  // display-only value
  const displayComponent = (
    <BooleanDisplay value={isChecked} trueLabel={trueLabel} falseLabel={falseLabel} />
  );

  // toggle handler (no animation, just flip + blur)
  const onToggle = (next: boolean) => {
    handleEvent(actions, "changeNblur", propName, next);
    (pConn.getValidationApi() as { validate: (v: any) => void }).validate(next);
  };

  const IconToggle = (
    <button
      type="button"
      role="checkbox"
      aria-checked={isChecked}
      aria-label={caption}
      disabled={isDisabled}
      onClick={(e) => {
        if (isDisabled) return;
        onToggle(!isChecked);              // select/unselect on click
        (e.currentTarget as HTMLButtonElement).blur(); // remove focus immediately (no blue outline)
      }}
      data-testid={testId}
      // no animations, no outline/box
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.625rem",
        background: "transparent",
        border: "none",
        padding: 0,
        borderRadius: 0,
        cursor: isDisabled ? "not-allowed" : "pointer",
        lineHeight: 1.2,
        outline: "none",
        boxShadow: "none"
      }}
      {...additionalProps}
    >
      <SearchIcon disabled={isDisabled} />
      <span style={{ fontSize: "0.95rem" }}>{caption}</span>
    </button>
  );

  const parentTestId = testId ? `${testId}-parent` : undefined;

  // Top Label (space reserved even when hidden)
  const TopLabel = (
    <div
      className="mb-2 block"
      style={{
        visibility: hideTopLabel ? "hidden" : "visible",
        minHeight: "1.25rem", // keep layout stable
        fontSize: "0.875rem", // smaller (≈14px)
        lineHeight: "1.25rem"
      }}
    >
      {topLabel}
    </div>
  );

  // render paths

  if (displayMode === "DISPLAY_ONLY") {
    return (
      <StyledBdExtnBooleanIconWrapper>
        {TopLabel}
        {displayComponent}
      </StyledBdExtnBooleanIconWrapper>
    );
  }

  if (displayMode === "LABELS_LEFT") {
    return (
      <StyledBdExtnBooleanIconWrapper>
        {TopLabel}
        <FieldValueList
          variant={hideLabel ? "stacked" : variant}
          data-testid={testId}
          fields={[
            {
              id: "1",
              name: hideLabel ? "" : label,
              value: displayComponent
            }
          ]}
        />
      </StyledBdExtnBooleanIconWrapper>
    );
  }

  if (displayMode === "STACKED_LARGE_VAL") {
    return (
      <StyledBdExtnBooleanIconWrapper>
        {TopLabel}
        <FieldValueList
          variant="stacked"
          data-testid={testId}
          fields={[
            {
              id: "2",
              name: hideLabel ? "" : label,
              value: (
                <Text variant="h1" as="span">
                  {displayComponent}
                </Text>
              )
            }
          ]}
        />
      </StyledBdExtnBooleanIconWrapper>
    );
  }

  // Editable (default)
  return (
    <StyledBdExtnBooleanIconWrapper>
      {TopLabel}
      <CheckboxGroup
        label={label}
        labelHidden={hideLabel}
        data-testid={parentTestId ?? undefined}
        info={validatemessage || helperText}
        status={status}
      >
        {IconToggle}
      </CheckboxGroup>
    </StyledBdExtnBooleanIconWrapper>
  );
}

export default withConfiguration(BdExtnBooleanIcon);
