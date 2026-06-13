export function getCareersByCode(code) {
  const upperCode = (code || '').toUpperCase();
  
  switch (upperCode) {
    case 'SAE':
      return [
        { title: 'Counselling Psychologist', match: '98%', cluster: 'Human Services' },
        { title: 'Human Resources Manager', match: '92%', cluster: 'Business' },
        { title: 'Special Educator', match: '88%', cluster: 'Education' }
      ];
    case 'IRE':
      return [
        { title: 'Software Developer', match: '96%', cluster: 'Information Technology' },
        { title: 'Data Scientist', match: '91%', cluster: 'Science & Engineering' },
        { title: 'Research Analyst', match: '87%', cluster: 'Business' }
      ];
    case 'EAC':
      return [
        { title: 'Marketing Manager', match: '95%', cluster: 'Business' },
        { title: 'Public Relations Specialist', match: '90%', cluster: 'Communications' },
        { title: 'Event Planner', match: '85%', cluster: 'Hospitality' }
      ];
    default:
      return [
        { title: 'Exploratory Pathway 1', match: '90%', cluster: 'General' },
        { title: 'Exploratory Pathway 2', match: '85%', cluster: 'General' },
        { title: 'Exploratory Pathway 3', match: '80%', cluster: 'General' }
      ];
  }
}
