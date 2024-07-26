import { Fragment, useState } from 'react';
import { Body } from '../typography/Body.styled';
import { Tab } from './TabsHeader.styled';

type TabsHeaderProps = {
  tabNames: string[];
  initialTab?: string;
  onTabChange?: (tab: string) => void;
};

export function TabsHeader({ tabNames, initialTab, onTabChange }: TabsHeaderProps) {
  const [activeTab, setActiveTab] = useState<string>(initialTab || tabNames[0]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <div className="flex gap-2">
      {tabNames.map((tabName, index) => (
        <Fragment key={tabName}>
          <Tab
            className={activeTab === tabName ? 'active' : ''}
            onClick={() => handleTabClick(tabName)}
          >
            {tabName}
          </Tab>
          {index < tabNames.length - 1 && <Body>/</Body>}
        </Fragment>
      ))}
    </div>
  );
}
