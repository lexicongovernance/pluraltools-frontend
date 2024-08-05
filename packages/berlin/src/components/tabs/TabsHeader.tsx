import { Fragment } from 'react';
import { Body } from '../typography/Body.styled';
import { Tab } from './TabsHeader.styled';

type TabsHeaderProps = {
  tabNames: string[];
  initialTab: string | null;
  className?: string;
  onTabChange?: (tab: string) => void;
};

export function TabsHeader({ tabNames, initialTab, className, onTabChange }: TabsHeaderProps) {
  const handleTabClick = (tab: string) => {
    if (onTabChange && initialTab !== tab) {
      onTabChange(tab);
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      {tabNames.map((tabName, index) => (
        <Fragment key={tabName}>
          <Tab
            className={initialTab === tabName ? 'active' : ''}
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
