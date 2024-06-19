import { useState } from 'react';
import { Body } from '../typography/Body.styled';
import { FlexRow } from '../containers/FlexRow.styled';
import { Tab } from './TabsHeader.styled';

type TabsHeaderProps = {
  tabNames: string[];
  initialTab?: string;
  onTabChange?: (tab: string) => void;
};

function TabsHeader({ tabNames, initialTab, onTabChange }: TabsHeaderProps) {
  const [activeTab, setActiveTab] = useState<string>(initialTab || tabNames[0]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <FlexRow $gap="0.5rem">
      {tabNames.map((tabName, index) => (
        <>
          <Tab
            key={tabName}
            className={activeTab === tabName ? 'active' : ''}
            onClick={() => handleTabClick(tabName)}
          >
            {tabName}
          </Tab>
          {index < tabNames.length - 1 && <Body>/</Body>}
        </>
      ))}
    </FlexRow>
  );
}

export default TabsHeader;
