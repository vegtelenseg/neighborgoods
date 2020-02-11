import React from 'react';
import MuiTab from '@material-ui/core/Tab/Tab';
import {TabPanel} from '../TabPanel/TabPanel';
interface Props {
  icon: JSX.Element;
  label: string;
  panelContent: JSX.Element;
  index: number;
  value: number;
}

export const TabWithPanel = (props: Props) => {
  const {icon, label, index, value, panelContent} = props;
  return (
    <>
      <MuiTab icon={icon} label={label} />
      <TabPanel
        index={index}
        value={value}
      >{panelContent}</TabPanel>
    </>
  );
};
