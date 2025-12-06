import { withConfiguration, Flex, Button } from '@pega/cosmos-react-core';

type ActionableButtonProps = {
  label: string;
  className: string;
  actionID: string;
  actionName: string;
  getPConnect: any;
};

export const BdExtnDataObjectAction = (props: ActionableButtonProps) => {
  const { getPConnect, label, className, actionID, actionName } = props;

  if (className && actionID && actionName) {
    const LaunchDataObjectAction = async () => {
      const actionsAPI = getPConnect().getActionsApi();

      // Get runtime pyGUID from clipboard
      const guid = getPConnect().getValue('.pyGUID');

      if (!guid) {
        console.error('pyGUID not found in clipboard.');
        return;
      }

      // ✅ Store pyGUID into pyWorkPage.pyText
      try {
        getPConnect().setValue('pyWorkPage.pyText', guid);
        console.log("Stored pyGUID into pyWorkPage.pyText:", guid);
      } catch (err) {
        console.error("Failed to set pyWorkPage.pyText", err);
      }

      // 🔹 Now launch the data object action
      try {
        await actionsAPI.openDataObjectAction(
          className,
          { pyGUID: guid },
          actionID,
          actionName
        );
        console.log('openDataObjectAction success');
      } catch (err) {
        console.error('openDataObjectAction failed', err);
      }
    };

    return (
      <Flex container={{ direction: 'row' }}>
        <Button onClick={LaunchDataObjectAction}>{label}</Button>
      </Flex>
    );
  }

  return null;
};

export default withConfiguration(BdExtnDataObjectAction);
