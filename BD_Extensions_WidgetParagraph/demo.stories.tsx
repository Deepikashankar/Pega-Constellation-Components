/* eslint-disable react/jsx-no-useless-fragment */
import type { Meta, StoryObj } from '@storybook/react';

import BdExtensionsWidgetParagraph from './index';

import { configProps, operatorDetails } from './mock';

const meta: Meta<typeof BdExtensionsWidgetParagraph> = {
  title: 'BdExtensionsWidgetParagraph',
  component: BdExtensionsWidgetParagraph,
  excludeStories: /.*Data$/
};

export default meta;
type Story = StoryObj<typeof BdExtensionsWidgetParagraph>;

if (!window.PCore) {
  window.PCore = {} as any;
}

window.PCore.getLocaleUtils = () => {
  return {
    getLocaleValue: (value: any) => {
      return value;
    }
  } as any;
};

window.PCore.getUserApi = () => {
  return {
    getOperatorDetails: () => {
      return new Promise(resolve => {
        resolve(operatorDetails);
      });
    }
  } as any;
};

export const BaseBdExtensionsWidgetParagraph: Story = (args: any) => {

  const props = {
    label: configProps.label,
    createOperator: configProps.createOperator,
    updateOperator: configProps.updateOperator,
    createDateTime: configProps.createDateTime,
    updateDateTime: configProps.updateDateTime,

    getPConnect: () => {
      return {
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
      <BdExtensionsWidgetParagraph {...props} {...args} />
    </>
  );
};

BaseBdExtensionsWidgetParagraph.args = {
  createLabel: configProps.createLabel,
  updateLabel: configProps.updateLabel,
  hideLabel: configProps.hideLabel
};
