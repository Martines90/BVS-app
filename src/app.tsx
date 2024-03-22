import React from 'react';
import ReactDOM from 'react-dom/client';


import { Header, Main, Footer } from './components/page';
import { CssBaseline, Container } from '@mui/material';

const App: React.FC = () => {
  return (
    <>
      <CssBaseline />
      <Header />
      <Container component="main" maxWidth={false}>
        <Main />
      </Container>
      <Footer />
    </>
  );
}

const root = ReactDOM.createRoot((document as any).getElementById('root'));

root.render(<App />);
