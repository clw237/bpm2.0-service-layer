import Pricing from 'components/pricing';
import { KF1LanguageProvider } from 'kfone-component-library';
import { languageResources } from './lang-resources';

const MFPricing = () => {
  return (
    <KF1LanguageProvider resources={languageResources} translationId='MFPricing'>
      <Pricing />
    </KF1LanguageProvider>
  );
};

export default MFPricing;
