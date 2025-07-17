
/* eslint-disable react/jsx-no-useless-fragment */
import type { Meta, StoryObj } from '@storybook/react';

import DcGenericDeepikaButton from './index';
import { configProps } from './mock';

const meta: Meta<typeof DcGenericDeepikaButton> = {
  title: 'DcGenericDeepikaButton',
  component: DcGenericDeepikaButton,
  excludeStories: /.*Data$/
};

export default meta;
type Story = StoryObj<typeof DcGenericDeepikaButton>;

if (!window.PCore) {
  window.PCore = {} as any;
}

const statelistData = {
  data: [
    {
      pyLabel: 'Massachusetts',
      pyStateCode: 'MA'
    },
    {
      pyLabel: 'Rhode Island',
      pyStateCode: 'RI'
    },
    {
      pyLabel: 'Connecticut',
      pyStateCode: 'CT'
    }
  ]
};

export const BaseDcGenericDeepikaButton: Story = (args: any) => {

  window.PCore.getDataPageUtils = () => {
    return {
      getData: () => {
        return new Promise(resolve => {
          resolve(statelistData);
        });
      },
      getDataAsync: () => {
        return new Promise(resolve => {
          resolve(statelistData);
        });
      }
    } as any;
  };

  const props = {
    countryCode: configProps.countryCode,
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
            updateFieldValue: () => {
              /* nothing */
            },
            triggerFieldChange: () => {
              /* nothing */
            }
          };
        },
        ignoreSuggestion: () => {
          /* nothing */
        },
        acceptSuggestion: () => {
          /* nothing */
        },
        setInheritedProps: () => {
          /* nothing */
        },
        resolveConfigProps: () => {
          /* nothing */
        }
      };
    }
  };

  return (
    <>
      <DcGenericDeepikaButton {...props} {...args} />
    </>
  );
};

BaseDcGenericDeepikaButton.args = {
  countryCode: configProps.countryCode
};
