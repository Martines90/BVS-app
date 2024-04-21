import { render } from '@testing-library/react';
import * as React from 'react';

import { MainToastContainer } from '@components/toasts/Toasts';
import InfoContextWrapper from '@hooks/context/infoContext/InfoContextWrapper';
import ModalContextWrapper from '@hooks/context/modalContext/ModalContextWrapper';
import ThemeProviderWrapper from '@hooks/context/themeContext/ThemeContextWrapper';
import UserContextWrapper from '@hooks/context/userContext/UserContextWrapper';

type ProviderProps = {
  children: React.ReactNode,
  initUserState?: any
};

const AllTheProviders = (
  { children, initUserState = {} }: ProviderProps
) => (
  <InfoContextWrapper>
    <ThemeProviderWrapper>
      <UserContextWrapper userState={initUserState}>
        <ModalContextWrapper>
          {children}
          <MainToastContainer />
        </ModalContextWrapper>
      </UserContextWrapper>
    </ThemeProviderWrapper>
  </InfoContextWrapper>
);

const customRender = (ui: React.ReactElement, options?: any) => render(ui, {
  wrapper: (props) => <AllTheProviders {...props} {...options?.wrapperProps} />, ...options
});

export * from '@testing-library/react';
export { customRender as render };
