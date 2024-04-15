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
      description: 'This action will create a Research Group and join you to it.',
      actionButtonText: 'Create group',
      form: {
        input: {
          label: 'Research Group name',
          placeholder: 'Enter your group name',
          requiredMessage: 'Group name must be 2 characters long or more',
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
        text: 'As a collaborator, you can join a research group. Please ask to your Lead Researcher for the group code.',
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
