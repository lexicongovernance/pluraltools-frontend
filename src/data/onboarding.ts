const onboarding = {
  data: [
    {
      id: 0,
      title: `Privacy Ambitions`,
      body: `A number of our mechanisms (plural voting, peer prediction, your hearts)  require certain social information (e.g., organizational affiliation, academic credentials) to function.`,
    },
    {
      id: 1,
      title: `ZuPass Registration`,
      body: `When you register for the community or an in-person event, a PCD (proof-carrying data) will be added to your Zupass which records your attendance and current affiliation.`,
    },
    {
      id: 2,
      title: `Incremental Privacy`,
      body: `We will use these Zupass PCDs to progressively upgrade the forum and voting tool until it works in a purely zero-knowledge fashion. Then, all identifying data will be eliminated from our database. Plurality scores will be calculated with all identities, affiliations and other groupings fully anonymized.`,
    },
    {
      id: 3,
      title: `Initial Trust Assumptions`,
      body: `However, since this requires parallel development on Zupass, some of this information will initially be stored in the community’s secure database (managed by Lexicon) , and used solely for the purposes of calculating plurality scores, implementing votes and managing event attendance.`,
    },
    {
      id: 4,
      title: `The Future`,
      body: `With time, we hope that these PCDs can serve as a source of verified affiliations and credentials for gatherings outside of the Plural Research Society.`,
    },
  ],
};

export default onboarding;
