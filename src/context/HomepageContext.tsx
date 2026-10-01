import React, { createContext, useContext, useState, useEffect } from 'react';
import { HomepageConfig, HomepageSection, HeroSlide, PromoBanner } from '../types';
import { INITIAL_HOMEPAGE_CONFIG } from '../data/mockData';
import { useToast } from './ToastContext';

interface HomepageContextType {
  config: HomepageConfig;
  updateConfig: (newConfig: Partial<HomepageConfig>) => Promise<void>;
  toggleSection: (sectionId: string) => void;
  reorderSection: (sectionId: string, direction: 'up' | 'down') => void;
  updateSectionTitle: (sectionId: string, title: string, subtitle?: string) => void;
  updateHeroSlide: (slideId: string, updatedSlide: Partial<HeroSlide>) => void;
  addHeroSlide: (slide: Omit<HeroSlide, 'id'>) => void;
  deleteHeroSlide: (slideId: string) => void;
  updatePromoBanner: (bannerId: string, updatedBanner: Partial<PromoBanner>) => void;
  resetToDefault: () => void;
  isSaving: boolean;
}

const HomepageContext = createContext<HomepageContextType | undefined>(undefined);

export const HomepageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<HomepageConfig>(() => {
    const saved = localStorage.getItem('boka_homepage_config');
    return saved ? JSON.parse(saved) : INITIAL_HOMEPAGE_CONFIG;
  });

  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    localStorage.setItem('boka_homepage_config', JSON.stringify(config));
  }, [config]);

  const updateConfig = async (newConfig: Partial<HomepageConfig>) => {
    setIsSaving(true);
    const merged = { ...config, ...newConfig };
    setConfig(merged);

    try {
      await fetch('/api/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(merged)
      });
      showToast('Homepage layout updated successfully!', 'success');
    } catch {
      showToast('Saved to local storage', 'info');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSection = (sectionId: string) => {
    const updatedSections = config.sections.map(sec =>
      sec.id === sectionId ? { ...sec, enabled: !sec.enabled } : sec
    );
    updateConfig({ sections: updatedSections });
  };

  const reorderSection = (sectionId: string, direction: 'up' | 'down') => {
    const sorted = [...config.sections].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex(s => s.id === sectionId);
    if (index === -1) return;

    if (direction === 'up' && index > 0) {
      const prevOrder = sorted[index - 1].order;
      sorted[index - 1].order = sorted[index].order;
      sorted[index].order = prevOrder;
    } else if (direction === 'down' && index < sorted.length - 1) {
      const nextOrder = sorted[index + 1].order;
      sorted[index + 1].order = sorted[index].order;
      sorted[index].order = nextOrder;
    }

    updateConfig({ sections: sorted });
  };

  const updateSectionTitle = (sectionId: string, title: string, subtitle?: string) => {
    const updatedSections = config.sections.map(sec =>
      sec.id === sectionId ? { ...sec, title, ...(subtitle !== undefined ? { subtitle } : {}) } : sec
    );
    updateConfig({ sections: updatedSections });
  };

  const updateHeroSlide = (slideId: string, updatedSlide: Partial<HeroSlide>) => {
    const updatedSlides = config.heroSlides.map(s =>
      s.id === slideId ? { ...s, ...updatedSlide } : s
    );
    updateConfig({ heroSlides: updatedSlides });
  };

  const addHeroSlide = (slide: Omit<HeroSlide, 'id'>) => {
    const newSlide: HeroSlide = {
      ...slide,
      id: `slide-${Date.now()}`
    };
    updateConfig({ heroSlides: [...config.heroSlides, newSlide] });
  };

  const deleteHeroSlide = (slideId: string) => {
    if (config.heroSlides.length <= 1) {
      showToast('You must keep at least one hero slide', 'error');
      return;
    }
    updateConfig({ heroSlides: config.heroSlides.filter(s => s.id !== slideId) });
  };

  const updatePromoBanner = (bannerId: string, updatedBanner: Partial<PromoBanner>) => {
    const updatedBanners = config.promoBanners.map(b =>
      b.id === bannerId ? { ...b, ...updatedBanner } : b
    );
    updateConfig({ promoBanners: updatedBanners });
  };

  const resetToDefault = () => {
    setConfig(INITIAL_HOMEPAGE_CONFIG);
    localStorage.setItem('boka_homepage_config', JSON.stringify(INITIAL_HOMEPAGE_CONFIG));
    showToast('Reset homepage to default layout', 'info');
  };

  return (
    <HomepageContext.Provider
      value={{
        config,
        updateConfig,
        toggleSection,
        reorderSection,
        updateSectionTitle,
        updateHeroSlide,
        addHeroSlide,
        deleteHeroSlide,
        updatePromoBanner,
        resetToDefault,
        isSaving
      }}
    >
      {children}
    </HomepageContext.Provider>
  );
};

export const useHomepage = () => {
  const context = useContext(HomepageContext);
  if (!context) throw new Error('useHomepage must be used within HomepageProvider');
  return context;
};
