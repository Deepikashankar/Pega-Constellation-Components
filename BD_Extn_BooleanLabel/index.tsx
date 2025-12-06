import * as React from "react";
import {
  Checkbox as CosmosCheckbox,
  CheckboxGroup,
  FieldValueList,
  Text,
  withConfiguration,
  BooleanDisplay
} from "@pega/cosmos-react-core";

import type { PConnFieldProps } from "./PConnProps";
import "./create-nonce";

import handleEvent from "./event-utils";
import StyledBdExtnBooleanLabelWrapper from "./styles";

interface BdExtnBooleanLabelProps extends PConnFieldProps {
  displayAsStatus?: boolean;
  isTableFormatter?: boolean;
  hasSuggestions?: boolean;
  variant?: any;
  formatter: string;
  caption: string;
  trueLabel: string;
  falseLabel: string;

  /** Independent top label above the whole control */
  topLabel?: string;
  hideTopLabel?: boolean;
}

interface StateProps {
  value: string;
  hasSuggestions: boolean;
}

interface ActionsProps {
  onClick: (e: unknown) => void;
}

function BdExtnBooleanLabel(props: BdExtnBooleanLabelProps) {
  const {
    getPConnect,
    value = false,
    label = "",                 // existing CheckboxGroup label (retain)
    helperText = "",
    caption,
    validatemessage,
    hideLabel,                  // existing hide for CheckboxGroup label
    testId,
    additionalProps = {},
    displayMode,
    variant = "inline",
    trueLabel,
    falseLabel,

    // NEW independent top label
    topLabel = "",
    hideTopLabel = false
  } = props;

  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const actionsProps = pConn.getActionsApi() as unknown as ActionsProps;
  const stateProps = pConn.getStateProps() as StateProps;

  // ensure string for handleEvent typing; let TS infer the type
  const propName = String(stateProps?.value ?? "");

  // normalize boolean-like props that might arrive as strings
  let { readOnly = false, required = false, disabled = false } = props;
  [readOnly, required, disabled] = [readOnly, required, disabled].map(
    (prop) => prop === true || (typeof prop === "string" && prop === "true")
  );

  let status: "error" | "success" | "warning" | "pending" | undefined;
  if (validatemessage && validatemessage !== "") status = "error";

  // display-only value widget
  const displayComponent = (
    <BooleanDisplay value={!!value} trueLabel={trueLabel} falseLabel={falseLabel} />
  );

  // editable checkbox
  const aCosmosCheckbox = (
    <CosmosCheckbox
      {...additionalProps}
      className="standard"
      checked={!!value}
      label={caption}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      onClick={actionsProps.onClick}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        handleEvent(actions, "changeNblur", propName, event.target.checked);
      }}
      onBlur={(event: React.FocusEvent<HTMLInputElement>) => {
        const checked = (event.target as HTMLInputElement).checked;
        (pConn.getValidationApi() as { validate: (val: any) => void }).validate(checked);
      }}
      data-testid={testId}
    />
  );

  const parentTestId = testId ? `${testId}-parent` : undefined;

  // ---------- Top Label (with reserved space) ----------
  const TopLabel = (
    <div
      className="mb-2 block"
      style={{
        visibility: hideTopLabel ? "hidden" : "visible",
        minHeight: "1.25rem" // roughly the height of a line (~20px)
      }}
    >
      {topLabel}
    </div>
  );

  // ---------- RENDER ----------

  if (displayMode === "DISPLAY_ONLY") {
    return (
      <StyledBdExtnBooleanLabelWrapper>
        {TopLabel}
        {displayComponent}
      </StyledBdExtnBooleanLabelWrapper>
    );
  }

  if (displayMode === "LABELS_LEFT") {
    return (
      <StyledBdExtnBooleanLabelWrapper>
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
      </StyledBdExtnBooleanLabelWrapper>
    );
  }

  if (displayMode === "STACKED_LARGE_VAL") {
    return (
      <StyledBdExtnBooleanLabelWrapper>
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
      </StyledBdExtnBooleanLabelWrapper>
    );
  }

  // Editable (default)
  return (
    <StyledBdExtnBooleanLabelWrapper>
      {TopLabel}
      <CheckboxGroup
        label={label}                 // existing label retained
        labelHidden={hideLabel}       // existing hide retained
        data-testid={parentTestId ?? undefined}
        info={validatemessage || helperText}
        status={status}
      >
        {aCosmosCheckbox}
      </CheckboxGroup>
    </StyledBdExtnBooleanLabelWrapper>
  );
}

export default withConfiguration(BdExtnBooleanLabel);
