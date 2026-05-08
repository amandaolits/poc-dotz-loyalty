const returnValueMap = new Map();

globalThis.jasmine = {
  createSpy(name) {
    const fn = jest.fn().mockName(name || "spy");
    fn.and = { returnValue(v) { fn.mockReturnValue(v); return fn; } };
    fn.withArgs = (...args) => {
      const key = JSON.stringify(args);
      const wrapper = (...callArgs) => { const v = returnValueMap.get(key); return v !== undefined ? v : fn(...callArgs); };
      wrapper.and = {
        returnValue(v) {
          returnValueMap.set(key, v);
          fn.mockImplementation((...callArgs) => {
            const val = returnValueMap.get(JSON.stringify(callArgs));
            return val !== undefined ? val : undefined;
          });
          return wrapper;
        },
      };
      return wrapper;
    };
    return fn;
  },

  createSpyObj(name, methodNames, properties) {
    const obj = {};
    const names = Array.isArray(methodNames) ? methodNames : Object.keys(methodNames);
    for (const method of names) obj[method] = globalThis.jasmine.createSpy(`${name}.${method}`);
    if (properties) Object.assign(obj, properties);
    return obj;
  },

  objectContaining(obj) { return expect.objectContaining(obj); },
  any(type) { return expect.any(type); },
  stringMatching(pattern) { return expect.stringMatching(pattern); },
};
