export default {
  profile: {
    avatar: localStorage.getItem('avatar') || '',
    firstName: localStorage.getItem('firstName') || '',
    lastName: localStorage.getItem('lastName') || '',
    userName: localStorage.getItem('userName') || '',
  },
  status: '',
};
