import Grid from '@/components/grid/Grid.tsx';
import Links from '@/components/links/Links.tsx';
import { Theme } from '@radix-ui/themes';
import '@/styles/index.css';
import '@/styles/links.css';

import '@radix-ui/themes/styles.css';

function App() {
  return (
    <>
      <Theme style={{ backgroundColor: '#002F6C' }}>
        <Grid />
        <Links />
      </Theme>
    </>
  );
}

export default App;
