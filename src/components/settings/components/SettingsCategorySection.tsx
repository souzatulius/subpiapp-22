
import React from 'react';
import SettingsCard from './SettingsCard';

interface SettingsCategorySectionProps {
  category: string;
  cards: any[];
}

const SettingsCategorySection: React.FC<SettingsCategorySectionProps> = ({ category, cards }) => {
  return (
    <div key={category}>
      <h2 className="text-xl font-semibold mb-4 text-gray-700">{category}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <SettingsCard
            key={index}
            title={card.title}
            description={card.description}
            icon={card.icon}
            link={card.link}
            color={card.color}
            count={card.count}
            category={card.category}
          >
            {card.chart}
            {card.loading && (
              <div className="animate-pulse mt-2 h-20 bg-gray-200 rounded"></div>
            )}
          </SettingsCard>
        ))}
      </div>
    </div>
  );
};

export default SettingsCategorySection;
