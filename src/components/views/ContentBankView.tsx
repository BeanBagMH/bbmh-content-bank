import React from 'react';
import { GridView } from './GridView';
import { ListView } from './ListView';
import { CalendarView } from './CalendarView';
import type { ContentItem } from '../../types';

interface ContentBankViewProps {
  items: ContentItem[];
  filter: {
    subView: string;
    [key: string]: any;
  };
  setFilter: (filter: any) => void;
  onCardClick: (id: string) => void;
  onAddNew: () => void;
}

export const ContentBankView: React.FC<ContentBankViewProps> = ({ 
  items, 
  filter, 
  onCardClick,
  onAddNew 
}) => {
  return (
    <>
      {filter.subView === 'grid' && (
        <GridView 
          items={items} 
          onCardClick={(id) => onCardClick(id)} 
        />
      )}
      {filter.subView === 'list' && (
        <ListView 
          items={items} 
          onCardClick={(id) => onCardClick(id)} 
        />
      )}
      {filter.subView === 'calendar' && (
        <CalendarView 
          items={items} 
          onCardClick={(id: string) => onCardClick(id)} 
          onNewContent={() => {
            onAddNew();
          }}
        />
      )}
    </>
  );
};
