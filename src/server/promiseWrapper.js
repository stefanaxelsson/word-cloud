const promiseWrapper = () => {
  const wrapper = {};

  wrapper.promise = new Promise((resolve, reject) => {
    wrapper.resolve = resolve;
    wrapper.reject = reject;
  });

  return wrapper;
};

module.exports = promiseWrapper;
