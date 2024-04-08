import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

import InfoContextWrapper from '@hooks/context/infoContext/InfoContextWrapper';
import ThemeProviderWrapper from '@hooks/context/themeContext/ThemeContextWrapper';
import UserContextWrapper from '@hooks/context/userContext/UserContextWrapper';
import ModalContextWrapper from '@hooks/context/modalContext/ModalContextWrapper';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <InfoContextWrapper>
      <ThemeProviderWrapper>
        <UserContextWrapper>
          <ModalContextWrapper>{children}</ModalContextWrapper>
        </UserContextWrapper>
      </ThemeProviderWrapper>
    </InfoContextWrapper>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
