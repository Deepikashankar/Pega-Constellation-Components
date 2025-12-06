import { Flex, Button, withConfiguration } from '@pega/cosmos-react-core';
import type { PConnFieldProps } from './PConnProps';
import './create-nonce';

interface BdExtensionsActionButtonProps extends PConnFieldProps {
  buttonName?: string;
  buttonColor?: string;
  buttonVariant?: 'primary' | 'secondary';
  localAction: string;
  value: string;
  getPConnect: any;
}

function BdExtensionsActionButton(props: BdExtensionsActionButtonProps) {
  const {
    getPConnect,
    buttonName = 'Click Me',
    buttonColor = '#007bff',
    buttonVariant = 'primary',
    localAction,
    value
  } = props;

  if (!value || !localAction) {
    return null;
  }

  const availableActions =
    getPConnect().getValue((window as any).PCore.getConstants().CASE_INFO.AVAILABLEACTIONS) || [];
  const targetAction = availableActions.find((action: { ID: string }) => action.ID === localAction);
  const actionName = targetAction?.name || buttonName;

  const LaunchLocalAction = async () => {
    const actionsAPI = getPConnect().getActionsApi();
    if (getPConnect().getContainerName() === 'workarea') {
      await actionsAPI.saveAssignment(getPConnect().getContextName());
    }
    const openLocalAction = actionsAPI.openLocalAction.bind(actionsAPI);
    openLocalAction(localAction, {
      caseID: value,
      containerName: 'modal',
      type: 'express',
      name: actionName
    });
  };

  let style: React.CSSProperties = {};
  if (buttonVariant === 'primary') {
    style = {
      backgroundColor: buttonColor,
      color: '#fff', // always white text
      border: `1px solid ${buttonColor}`
    };
  } else if (buttonVariant === 'secondary') {
    style = {
      backgroundColor: 'transparent',
      color: buttonColor,
      border: `1px solid ${buttonColor}`
    };
  }

  return (
    <Flex container={{ direction: 'row' }}>
      <Button onClick={LaunchLocalAction} style={style}>
        {buttonName}
      </Button>
    </Flex>
  );
}

export default withConfiguration(BdExtensionsActionButton);
