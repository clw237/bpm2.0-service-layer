import Introduction from 'components/introduction';
import { KF1Button, KF1LanguageSelector } from 'kfone-component-library';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className='root-pages' id='root-home' data-testid='root-home'>
      <div className='mt-16 text-center'>
        <KF1LanguageSelector />
        <KF1Button
          id='id_ods_btn'
          text='ODS Tokens Integration'
          onClick={() => navigate('/odsTokensIntegration')}
          className='mx-auto mt-5'
        />
        <Introduction />
      </div>
    </div>
  );
};

export default Home;
