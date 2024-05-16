const groups = {
  create: {
    subtitle: 'Create a Research Group',
    body: [
      {
        id: 0,
        text: '(For Lead & Solo Researchers)',
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
    body: [
      {
        id: 0,
        text: '(For Collaborators)',
      },
    ],
    input: {
      label: 'Ask your Lead Researchers for a Code',
      placeholder: 'Enter the secret code here...',
      requiredMessage: 'Code is required',
    },
    buttonText: 'Join group',
  },
};

export default groups;
