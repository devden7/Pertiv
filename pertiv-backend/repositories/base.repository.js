const baseRepository = (model) => {
  return {
    count: (where = {}) => model.count({ where }),
  };
};

module.exports = baseRepository;
