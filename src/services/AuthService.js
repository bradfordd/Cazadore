const getCurrentUserRole = () => {
  return sessionStorage.getItem("userRole");
};

export { getCurrentUserRole };
