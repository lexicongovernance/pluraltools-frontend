const groups = {
  create: {
    subtitle: 'Create a Research Group',
    body: [
      {
        id: 0,
        text: 'Share the access code with your collaborators',
      },
    ],
    buttonText: 'Create group',
    dialog: {
      actionButtonText: 'Create group',
      form: {
        input: {
          placeholder: 'Research group name',
          requiredMessage: 'Research group name must be 2 characters long or more',
        },
        buttonText: 'Create group',
      },
      buttonText: 'Create group',
    },
  },
  join: {
    subtitle: 'Join a Research Group',
    body: [],
    input: {
      label: 'Ask the group creator for the access code',
      placeholder: 'Enter access code',
      requiredMessage: 'Access code is required',
    },
    buttonText: 'Join group',
  },
};

export default groups;
