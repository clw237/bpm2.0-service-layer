import Introduction from 'components/introduction';
import { KF1LanguageProvider } from 'kfone-component-library';
import { languageResources } from './lang-resources';

const MFIntroduction = () => {
  return (
    <KF1LanguageProvider resources={languageResources} translationId='MFIntro'>
      <Introduction />
    </KF1LanguageProvider>
  );
};

export default MFIntroduction;
