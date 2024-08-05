import { Fragment } from 'react';
import { Body } from '../typography/Body.styled';
import { Tab } from './TabsHeader.styled';

type TabsHeaderProps = {
  tabNames: string[];
  activeTab: string;
  className?: string;
  onTabChange?: (tab: string) => void;
};

export function TabsHeader({ tabNames, activeTab, className, onTabChange }: TabsHeaderProps) {
  const handleTabClick = (tab: string) => {
    if (activeTab !== tab) {
      if (onTabChange) {
        onTabChange(tab);
      }
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
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
