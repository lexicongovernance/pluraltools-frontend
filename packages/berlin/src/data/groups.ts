const groups = {
  create: {
    subtitle: 'Create a Group',
    body: [
      {
        id: 0,
        text: 'Share the access code with your collaborators',
      },
      {
        id: 1,
        text: 'Any group member can assign their proposal to this group',
      },
    ],
    buttonText: 'Create',
    dialog: {
      actionButtonText: 'Create',
      form: {
        input: {
          placeholder: 'Group name',
          requiredMessage: 'Group name must be 2 characters long or more',
        },
        buttonText: 'Create',
      },
      buttonText: 'Create',
    },
  },
  join: {
    subtitle: 'Join a Group',
    body: [
      {
        id: 0,
        text: 'Ask the group creator for the access code',
      },
    ],
    input: {
      placeholder: 'Enter access code',
      requiredMessage: 'Access code is required',
    },
    buttonText: 'Join',
  },
};

export default groups;
