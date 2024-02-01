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
  --color-black: ${(props) => props.theme.backgroundColor};
  --color-white: ${(props) => props.theme.textColor};
  --font-family-title: 'Playfair Display', serif;
  --font-family-body: 'Playfair', serif;
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
    },
    dark: {
      backgroundColor: '#222222',
      textColor: '#ffffff',
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
