import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { useAppStore } from './store';

export const GlobalStyle = createGlobalStyle`
*,
*::after,
*::before {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --color-primary: '#222';
  --color-secondary: '#fff';
  --color-white: ${(props) => props.theme.backgroundColor};
  --color-black: ${(props) => props.theme.textColor};
  --color-gray:  ${(props) => props.theme.gray};
  --color-darkgray:  ${(props) => props.theme.darkGray};
  --color-error: #DB4545;
  --font-family-title: 'EB Garamond', serif;
  --font-family-body: 'EB Garamond', serif;
  --font-family-button: 'Raleway', sans-serif;
}

body {
  background-color: var(--color-white);
  color: var(--color-black);
  font-family: var(--font-family-body);
  line-height: 1.5;
}

img {
  display: block;
  max-width: 100%;
}

input,
textarea,
button,
select {
  color: inherit;
  font: inherit;
}

button {
  cursor: pointer;
  transition: opacity 0.2s ease-out;

  &:hover {
  opacity: 0.8;
  transition: opacity 0.2s ease-in;

  }
}

a {
  color: inherit;
  text-decoration: inherit;
}
`;

type ThemedAppProps = {
  children: React.ReactNode;
};

const ThemedApp = ({ children }: ThemedAppProps) => {
  const theme = useAppStore((state) => state.theme);

  const themes = {
    light: {
      backgroundColor: '#ffffff',
      textColor: '#222222',
      gray: '#bbbbbb',
      darkGray: '#cccccc',
    },
    dark: {
      backgroundColor: '#222222',
      textColor: '#ffffff',
      gray: '#777777',
      darkGray: '#888888',
    },
  };

  return (
    <ThemeProvider theme={themes[theme]}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
};

export default ThemedApp;
