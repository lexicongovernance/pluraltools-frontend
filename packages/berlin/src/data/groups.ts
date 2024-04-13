const groups = {
  create: {
    subtitle: 'Create a Research Group',
    body: [
      {
        id: 0,
        text: 'If you are the Lead Researcher or a Solo Researcher, please create a research group.',
      },
      {
        id: 1,
        text: 'You will get a code that you can share with your collaborators.',
      },
    ],
    buttonText: 'Create group',
    dialog: {
      title: 'Do you want to create a Research Group?',
      description: 'This action will create a group...',
      actionButtonText: 'Create group',
    },
  },
  join: {
    subtitle: 'Join a Research Group',
    body: [
      {
        id: 0,
        text: ' As a collaborator, you can join a research group. Please ask to your Lead Researcher for the group code.',
      },
    ],
    input: {
      label: 'Research Group Code',
      placeholder: 'Enter the secret code here...',
      requiredMessage: 'Code is required',
    },
    buttonText: 'Join group',
  },
};

export default groups;
