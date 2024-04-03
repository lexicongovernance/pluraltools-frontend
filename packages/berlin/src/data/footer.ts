const footer = {
  copy: [
    { id: 0, text: 'A grants program funded by Plurality Labs and the Arbitrum DAO' },
    { id: 1, text: 'Co-sponsored by RadicalXChange, MetaGov & De-Sci Foundation' },
    { id: 2, text: 'Tooling built by Lexicon Governance' },
  ],
  logos: [
    {
      src: `arbitrum`, // src here its just the filename as we render it as `/logo/${src}-{theme}.svg`
      alt: 'Arbitrum',
      link: 'https://arbitrum.foundation/grants',
    },
    {
      src: `radicalxchange`,
      alt: 'RadicalXChange',
      link: 'https://www.radicalxchange.org/',
    },
    {
      src: `metagov`,
      alt: 'MetaGov',
      link: 'https://metagov.org/',
    },
    {
      src: `desci`,
      alt: 'De-Sci Foundation',
      link: 'https://www.descifoundation.org/',
    },
    {
      src: `lexicon`,
      alt: 'Lexicon Governance',
      link: 'https://github.com/lexicongovernance',
    },
  ],
};

export default footer;
