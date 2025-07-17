import { useEffect, useState } from 'react';
import {
  Icon,
  Button,
  withConfiguration,
  registerIcon,
  Table,
  Label,
  Link,
  URLDisplay
} from '@pega/cosmos-react-core';
import type { PConnFieldProps } from './PConnProps';
import './create-nonce';

// IMPORTANT
// To use Icons, need to individually import the icon file form @pega/cosmos-react-core (see path below)
// Icons filename is kabab case (file-name), where as the icon you import is camel case (fileName)
// Icons need to be registered (camel case), and then used (kabab case)
import * as listNumber from '@pega/cosmos-react-core/lib/components/Icon/icons/list-number.icon';
import * as arrowRight from '@pega/cosmos-react-core/lib/components/Icon/icons/arrow-right.icon';
import * as globe from '@pega/cosmos-react-core/lib/components/Icon/icons/globe.icon';

import StyledDcGenericDeepikaButtonWrapper from './styles';

// interface for props
interface DcGenericDeepikaButtonProps extends PConnFieldProps {
  // If any, enter additional props that only exist on TextInput here
  countryCode: string;
}

export const textFormatter = (value: string) => {
  const displayComponent = (
    <URLDisplay target='_blank' value={value} displayText={value} variant='link' />
  );

  return displayComponent;
};

// *************
// This component is meant to be an example of usage (Icon, Button, Link, etc.) and NOT meant to be
// used "as is"
//
// In this example, Icon is shown on its own and inside a Button
// Though an Icon can have an "onClick" event is it recommended if you want to click on it,
// to put it in a Button (shown below), so you can have a tooltip and hover style or put it
// in a Link (shown below) as a URL.
//
// For the button, the click will get a list of states for a given country and display in a
// table below.  The table display will toggle with the click of the button icon. Example shows
// how to handle click, retrieve data from PCore and display it.
//
// Globe icon is an icon placed in a Link element. The Link element to use an icon internally.  (NOTE: In general
// the Link element shows the open icon to the left of the link text, but here we are using
// another icon, so with "icon" specified in the Link element, the open icon doesn't show)
// Link elements do not handle bad urls well, so we have a simple validator to prevent the Link element
// from getting most bad urls.
//
// NOTE: because icons have to be imported and registered, you can NOT put the icon name
// inside the config.json and let the user pick it, if it is not already part of your
// import and registration (can't be done on the fly)
// **************

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
function DcGenericDeepikaButton(props: DcGenericDeepikaButtonProps) {
  const { value, displayMode, countryCode = 'USA', getPConnect, testId } = props;
  const [statelist, setStatelist] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [validUrl, setValidUrl] = useState('about:blank');
  const PConnect = getPConnect();
  const dataViewName = 'D_pyStateList';
  const context = PConnect.getContextName();

  // IMPORTANT: need to register icons used in camel case
  registerIcon(listNumber, arrowRight, globe);


   // setting up columns for the work list table
  const columns = [
    { renderer: 'stateName', label: PConnect.getLocalizedValue('State name', '', '') },
    { renderer: 'stateCode', label: PConnect.getLocalizedValue('State code', '', '') }
  ];

  // toggle showing table and getting table data
  function showHideTable() {
    setShowTable(prevShowTable => !prevShowTable);
  }

  // check if url is valid (simple)
  function validateUrl(href: string) {
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
      href
    );
  }

  // Testing to see if value entered is valid url, if not can't use it.
  // Reason for this code is that you can NOT pass to Link component
  // a bad url, or it will error out.
  // For example: Since the value is the property field,
  // it could be entered from another component and thus as it is
  // entered (typed in), it won't be valid until it is all entered.
  // NOTE: can't have a blank value for the url as the Link element will error out
  // in App studio preview
  useEffect(() => {
    if (validateUrl(value)) {
      setValidUrl(value);
    } else {
      setValidUrl('about:blank');
    }
  }, [value]);

  // going to get data for worklist to put into a table
  // data comes from calling a PCore function to get
  // get data from a data page and a PConnect function
  // to get getContextName
  useEffect(() => {
    const params = { pyCountry: countryCode };

    // only retrieve table data if table is shown
    if (showTable) {
      PCore.getDataPageUtils()
        .getDataAsync(dataViewName, context, params, null, null)
        .then((response: any) => {
          setIsLoading(false);
          // table requires an index or will get setExtraStackFrame error
          if (response.data !== null) {
            setStatelist(
              response.data.map((entry: any, index: number) => {
                // mapping the data into the column names
                // MUST have an id/index or will get a setExtraStackFrame error
                // put a key in the table
                return {
                  stateName: entry.pyLabel,
                  stateCode: entry.pyStateCode,
                  id: index
                };
              })
            );
          } else {
            setStatelist([]);
            setIsLoading(false);
          }
        })
        .catch((error: any) => {
          setStatelist([]);
          setIsLoading(false);
          console.log(error);
        });
    }
  }, [context, countryCode, showTable]);

  // when DISPLAY_ONLY, in this example we will just show the URL.
  if (displayMode === 'DISPLAY_ONLY') {
    const displayComp = textFormatter(validUrl);
    return (
      <StyledDcGenericDeepikaButtonWrapper> {displayComp} </StyledDcGenericDeepikaButtonWrapper>
    );
  }

  return (
    <StyledDcGenericDeepikaButtonWrapper>
    <div style={{ display: 'flex' }} data-testid={testId}>
      <Icon
        style={{ height: '1.5rem', width: '1.5rem' }}
        // icon name is kabab case
        name='arrow-right'
        role='img'
        aria-label='arrow right'
      />
      <Label style={{ margin: '0.1rem' }}>
        {' '}
        {PConnect.getLocalizedValue('State list for', '', '')}{' '}
        {PConnect.getLocalizedValue(`${countryCode}`, '', '')}{' '}
      </Label>
      <Button
        icon
        label={PConnect.getLocalizedValue('Click to show/hide state list', '', '')}
        variant='link'
        compact={false}
        onClick={showHideTable}
      >
        <Icon
          style={{ height: '1.5rem', width: '1.5rem' }}
          // icon name is kabab case
          name='list-number'
          role='img'
          aria-label='numbered list'
        />
      </Button>
      <Link href={validUrl} variant='link' label={validUrl} icon>
        <Icon
          style={{ height: '1.5rem', width: '1.5rem' }}
          // icon name is kabab case
          name='globe'
          role='img'
          aria-label='open link'
        />
      </Link>
    </div>
      {showTable && (
        <Table
          title={PConnect.getLocalizedValue('State list', '', '')}
          columns={columns}
          data={statelist}
          loading={isLoading}
          loadingMessage={PConnect.getLocalizedValue('Loading state list', '', '')}
        />
      )}
    </StyledDcGenericDeepikaButtonWrapper>
  );
}


export default withConfiguration(DcGenericDeepikaButton);
