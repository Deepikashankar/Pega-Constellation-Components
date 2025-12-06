/* eslint-disable react/jsx-no-useless-fragment */
import type { Meta, StoryObj } from '@storybook/react';

import DcExtnCaseTransition from './index';

import historyData from './mock';

const meta: Meta<typeof DcExtnCaseTransition> = {
  title: 'DcExtnCaseTransition',
  component: DcExtnCaseTransition,
  excludeStories: /.*Data$/
};

export default meta;
type Story = StoryObj<typeof DcExtnCaseTransition>;

if (!window.PCore) {
  window.PCore = {} as any;
}

export const BaseDcExtnCaseTransition: Story = (args: any) => {

  window.PCore.getConstants = () => {
    return {
      CASE_INFO: {
        CASE_INFO_ID: 'caseInfo.ID'
      }
    } as any;
  };

  window.PCore.getLocaleUtils = () => {
    return {
      getLocaleValue: (value: any) => {
        return value;
      }
    } as any;
  };

  window.PCore.getDataApiUtils = () => {
    return {
      getData: () => {
        return new Promise(resolve => {
          resolve(historyData);
        });
      }
    } as any;
  };

  const props = {
    getPConnect: () => {
      return {
        getValue: (value: any) => {
          return value;
        },
        getContextName: () => {
          return 'app/primary_1';
        },
        getLocalizedValue: (value: any) => {
          return value;
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
      <DcExtnCaseTransition {...props} {...args} />
    </>
  );
};

BaseDcExtnCaseTransition.args = {
  label: 'Case history',
};
