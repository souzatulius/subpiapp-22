
import React from 'react';
import SettingsCard from './SettingsCard';

interface SettingsCategorySectionProps {
  title: string;
  cards: any[];
  onCardClick: (section: string) => void;
}

const SettingsCategorySection: React.FC<SettingsCategorySectionProps> = ({
  title,
  cards,
  onCardClick
}) => {
  // Extract section name from card link (e.g., "/settings?tab=usuarios" => "usuarios")
  const getSectionFromLink = (link: string) => {
    const match = link.match(/\?tab=([^&]+)/);
    return match ? match[1] : '';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-medium">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {cards.map((card, index) => (
          <SettingsCard
            key={index}
            title={card.title}
            description={card.description}
            icon={card.icon}
            color={card.color}
            link={card.link}
            onClick={() => onCardClick(getSectionFromLink(card.link))}
            count={card.count}
            loading={card.loading}
            chart={card.chart}
          />
        ))}
      </div>
    </div>
  );
};

export default SettingsCategorySection;
