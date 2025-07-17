
/* eslint-disable react/jsx-no-useless-fragment */
import type { Meta, StoryObj } from '@storybook/react';

import DcExtnCardEx from './index';

import { stateProps, fieldMetadata, configProps } from './mock';

const meta: Meta<typeof DcExtnCardEx> = {
  title: 'DcExtnCardEx',
  component: DcExtnCardEx,
  excludeStories: /.*Data$/
};

export default meta;
type Story = StoryObj<typeof DcExtnCardEx>;

export const BaseDcExtnCardEx: Story = (args: any) => {

  const props = {
    value: configProps.value,
    hasSuggestions: configProps.hasSuggestions,
    fieldMetadata,
    getPConnect: () => {
      return {
        getStateProps: () => {
          return stateProps;
        },
        getActionsApi: () => {
          return {
            updateFieldValue: () => {/* nothing */},
            triggerFieldChange: () => {/* nothing */}
          };
        },
        ignoreSuggestion: () => {/* nothing */},
        acceptSuggestion: () => {/* nothing */},
        setInheritedProps: () => {/* nothing */},
        resolveConfigProps: () => {/* nothing */}
      };
    }
  };

  return (
    <>
      <DcExtnCardEx {...props} {...args} />
    </>
  );
};

BaseDcExtnCardEx.args = {
  label: configProps.label,
  helperText: configProps.helperText,
  placeholder: configProps.placeholder,
  testId: configProps.testId,
  readOnly: configProps.readOnly,
  disabled: configProps.disabled,
  required: configProps.required,
  status: configProps.status,
  hideLabel: configProps.hideLabel,
  displayMode: configProps.displayMode,
  variant: configProps.variant,
  validatemessage: configProps.validatemessage
};
