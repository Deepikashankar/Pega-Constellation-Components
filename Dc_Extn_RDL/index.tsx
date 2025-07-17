import { Grid, Flex, FieldGroup, withConfiguration } from '@pega/cosmos-react-core';

import type { PConnFieldProps } from './PConnProps';
import './create-nonce';
import DetailsRender from './DetailsRender';

import StyledDcExtnRdlWrapper from './styles';

// interface for props
interface DcExtnRdlProps extends PConnFieldProps {
  // If any, enter additional props that only exist on TextInput here
  showLabel: boolean;
  children: any;
}

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
function DcExtnRdl(props: DcExtnRdlProps) {


  const { children = [], label, showLabel, getPConnect, readOnly, displayMode  } = props;
  const propsToUse = { label, showLabel, ...getPConnect().getInheritedProps() };

  const numRegions = children?.length;
  const gridRepeat = "repeat(".concat(numRegions).concat(", 1fr)");
  const gridContainer = {"colGap" : 6};
  // @ts-ignore
  gridContainer.cols = gridRepeat;
  // @ts-ignore
  gridContainer.alignItems = 'start';

  const flexContainer = {direction: 'column'};
  // @ts-ignore
  flexContainer.gap = 2;

  if (readOnly && readOnly === true || displayMode && displayMode === 'DISPLAY_ONLY') {
    return (
      <StyledDcExtnRdlWrapper>
        <FieldGroup name={propsToUse.showLabel ? propsToUse.label : ''}>
          <Grid container={gridContainer} data-testid={`column-count-${numRegions}`}>
            {children.map((child: any, i: number) => (
              <Flex
                // @ts-ignore
                container={{ direction: 'column', alignItems: 'normal', colGap: 1, rowGap: 1.5 }}
                key={`r-${i + 1}`}
              >
                <DetailsRender child={child} />
              </Flex>
            ))}
          </Grid>
        </FieldGroup>
      </StyledDcExtnRdlWrapper>
    );
  }

  return (
    <StyledDcExtnRdlWrapper>
      <FieldGroup name={propsToUse.showLabel ? propsToUse.label : ''}>
        <Grid container={gridContainer}>
        {children.map((child: any, i: number) => (
          // @ts-ignore
          <Flex container={flexContainer} key={`r-${i + 1}`}>
          {child}
          </Flex>
        ))}
        </Grid>
      </FieldGroup>
    </StyledDcExtnRdlWrapper>
  );

}


export default withConfiguration(DcExtnRdl);
