function getGitlabChoices(data) {
  const users = []; const groups = [];
  const separatorLine = {
    type: 'separator',
  };
  data.forEach((item) => {
    const choice = {
      name: item.name,
      value: item.full_path,
    };
    switch (item.kind) {
      case 'user':
        users.push(item);
        break;
      case 'group':
        groups.push(item);
        break;
      default:
        break;
    }
  });
  return users.concat(separatorLine).concat(groups);
}

export {
  getGitlabChoices,
};
