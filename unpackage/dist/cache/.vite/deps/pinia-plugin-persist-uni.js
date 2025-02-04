import "./chunk-TDUMLE5V.js";

// D:/BOEINGcode/b787/ninini/node_modules/pinia-plugin-persist-uni/dist/pinia-persist-uni.es.js
var isH5 = typeof alert === "function";
var updateStorage = (strategy, store, options) => {
  const storage = strategy.storage;
  const storeKey = strategy.key || store.$id;
  const isCustomStorage = isH5 || (options == null ? void 0 : options.enforceCustomStorage);
  if (strategy.paths) {
    const partialState = strategy.paths.reduce((finalObj, key) => {
      finalObj[key] = store.$state[key];
      return finalObj;
    }, {});
    if (isCustomStorage && storage) {
      storage.setItem(storeKey, JSON.stringify(partialState));
    } else {
      uni.setStorage({ key: storeKey, data: JSON.stringify(partialState) });
    }
  } else if (isCustomStorage && storage) {
    storage.setItem(storeKey, JSON.stringify(store.$state));
  } else {
    uni.setStorage({ key: storeKey, data: JSON.stringify(store.$state) });
  }
};
var index = ({ options, store }) => {
  var _a, _b, _c, _d, _e, _f;
  if ((_a = options.persist) == null ? void 0 : _a.enabled) {
    const defaultStrat = [
      {
        key: store.$id,
        storage: ((_b = options.persist) == null ? void 0 : _b.H5Storage) || (window == null ? void 0 : window.sessionStorage)
      }
    ];
    const strategies = ((_d = (_c = options.persist) == null ? void 0 : _c.strategies) == null ? void 0 : _d.length) ? (_e = options.persist) == null ? void 0 : _e.strategies : defaultStrat;
    strategies.forEach((strategy) => {
      var _a2, _b2;
      const storage = strategy.storage || ((_a2 = options.persist) == null ? void 0 : _a2.H5Storage) || (window == null ? void 0 : window.sessionStorage);
      const storeKey = strategy.key || store.$id;
      let storageResult;
      if (isH5 || ((_b2 = options.persist) == null ? void 0 : _b2.enforceCustomStorage)) {
        storageResult = storage.getItem(storeKey);
      } else {
        storageResult = uni.getStorageSync(storeKey);
      }
      if (storageResult) {
        store.$patch(JSON.parse(storageResult));
        updateStorage(strategy, store, options.persist);
      }
    });
    store.$subscribe(() => {
      strategies.forEach((strategy) => {
        updateStorage(strategy, store, options.persist);
      });
    }, { detached: ((_f = options.persist) == null ? void 0 : _f.detached) ? true : false });
  }
};
export {
  index as default
};
//# sourceMappingURL=pinia-plugin-persist-uni.js.map
