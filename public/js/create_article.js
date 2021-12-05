/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");
var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./node_modules/axios/lib/helpers/cookies.js");
var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var buildFullPath = __webpack_require__(/*! ../core/buildFullPath */ "./node_modules/axios/lib/core/buildFullPath.js");
var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./node_modules/axios/lib/helpers/parseHeaders.js");
var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");
var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/axios/lib/core/createError.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var Axios = __webpack_require__(/*! ./core/Axios */ "./node_modules/axios/lib/core/Axios.js");
var mergeConfig = __webpack_require__(/*! ./core/mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(/*! ./cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(/*! ./helpers/spread */ "./node_modules/axios/lib/helpers/spread.js");

// Expose isAxiosError
axios.isAxiosError = __webpack_require__(/*! ./helpers/isAxiosError */ "./node_modules/axios/lib/helpers/isAxiosError.js");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/Cancel.js":
/*!*************************************************!*\
  !*** ./node_modules/axios/lib/cancel/Cancel.js ***!
  \*************************************************/
/***/ ((module) => {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Cancel = __webpack_require__(/*! ./Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/***/ ((module) => {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var buildURL = __webpack_require__(/*! ../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./node_modules/axios/lib/core/InterceptorManager.js");
var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./node_modules/axios/lib/core/dispatchRequest.js");
var mergeConfig = __webpack_require__(/*! ./mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "./node_modules/axios/lib/core/buildFullPath.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/buildFullPath.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isAbsoluteURL = __webpack_require__(/*! ../helpers/isAbsoluteURL */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");
var combineURLs = __webpack_require__(/*! ../helpers/combineURLs */ "./node_modules/axios/lib/helpers/combineURLs.js");

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/createError.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/createError.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var enhanceError = __webpack_require__(/*! ./enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var transformData = __webpack_require__(/*! ./transformData */ "./node_modules/axios/lib/core/transformData.js");
var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/core/enhanceError.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/enhanceError.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/mergeConfig.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/mergeConfig.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = [
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
    'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
  ];
  var directMergeKeys = ['validateStatus'];

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  utils.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys)
    .concat(directMergeKeys);

  var otherKeys = Object
    .keys(config1)
    .concat(Object.keys(config2))
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, mergeDeepProperties);

  return config;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var createError = __webpack_require__(/*! ./createError */ "./node_modules/axios/lib/core/createError.js");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),

/***/ "./node_modules/axios/lib/defaults.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/defaults.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/* provided dependency */ var process = __webpack_require__(/*! process/browser */ "./node_modules/process/browser.js");


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var normalizeHeaderName = __webpack_require__(/*! ./helpers/normalizeHeaderName */ "./node_modules/axios/lib/helpers/normalizeHeaderName.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(/*! ./adapters/xhr */ "./node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ./adapters/http */ "./node_modules/axios/lib/adapters/xhr.js");
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;


/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/***/ ((module) => {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAxiosError.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAxiosError.js ***!
  \********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return (typeof payload === 'object') && (payload.isAxiosError === true);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/normalizeHeaderName.js":
/*!***************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/normalizeHeaderName.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/***/ ((module) => {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};


/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/***/ ((module) => {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!****************************************!*\
  !*** ./resources/js/create_article.js ***!
  \****************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }



function datasetHTMLTemplate(currentChartDataset) {
  return "\n    <div class=\"row mb-3 d-flex align-items-end dataset\" id=\"dataset_".concat(currentChartDataset, "\">\n        <div class=\"col-4\">\n            <label for=\"label_").concat(currentChartDataset, "\" class=\"form-label\">\u041D\u0430\u0437\u0432\u0430 \u043F\u043E\u043B\u044F</label>\n            <input type=\"text\" class=\"form-control dataset_element dataset_label\" id=\"label_").concat(currentChartDataset, "\">\n        </div>\n        <div class=\"col-5\">\n            <label for=\"value_").concat(currentChartDataset, "\" class=\"form-label\">\u0417\u043D\u0430\u0447\u0435\u043D\u043D\u044F</label>\n            <input type=\"text\" class=\"form-control dataset_element dataset_value\" id=\"value_").concat(currentChartDataset, "\">\n        </div>\n        <div class=\"col-3\">\n            <button class=\"btn btn-primary col-12\" onclick=\"document.querySelector('#dataset_").concat(currentChartDataset, "').remove()\">\n                \u0412\u0438\u0434\u0430\u043B\u0438\u0442\u0438\n            </button>\n        </div>\n    </div>\n    ");
}

var isValidationEnabled = false;
var datasetContainer = document.querySelector('#datasets_container');
var editDatasetContainer = document.querySelector('#edit_datasets_container');
var currentChartDataset = 0;

document.querySelector('#add_dataset_button').onclick = function () {
  datasetContainer.innerHTML += datasetHTMLTemplate(currentChartDataset);
  currentChartDataset += 1;
};

document.querySelector('#edit_add_dataset_button').onclick = function () {
  editDatasetContainer.innerHTML += datasetHTMLTemplate(currentChartDataset);
  currentChartDataset += 1;
};
/* ************************************************************************ */


var chartFieldsIDs = ['chart_title', 'chart_legend', 'chart_type', 'chart_axis_x', 'chart_axis_y', 'chart_sufix', 'chart_verbal_rounding', 'chart_verbal_rounding_when_hovered'];
var editChartFieldsIDs = ['edit_chart_id', 'edit_chart_title', 'edit_chart_legend', 'edit_chart_type', 'edit_chart_axis_x', 'edit_chart_axis_y', 'edit_chart_sufix', 'edit_chart_verbal_rounding', 'edit_chart_verbal_rounding_when_hovered'];
var rules = {
  'requeried': function requeried(string) {
    return string.length > 0 ? true : false;
  },
  'numbers': function numbers(string) {
    var re = /^[0-9]+$/gmi;
    return string.match(re) != null ? true : false;
  },
  'letters': function letters(string) {
    var re = /^[a-zA-Zа-яА-ЯґҐїЇіІ\s`"’'.]+$/gmi;
    return string.match(re) != null ? true : false;
  },
  'datasets': function datasets() {
    var amountOfDatasets = document.querySelectorAll('.dataset');
    return amountOfDatasets.length > 0 ? true : false;
  }
};
var elementsForValidation = [{
  selector: '#chart_title',
  rules: ['requeried'],
  errorMessage: 'Поле "Назва графіка" повинно бути заповнене'
}, // {
//     selector: '#edit_chart_title', 
//     rules: ['requeried'], 
//     errorMessage: 'Поле "Назва графіка" повинно бути заповнене'
// },
{
  selector: '#chart_legend',
  rules: ['requeried'],
  errorMessage: 'Поле "Додаткова назва графіка" повинне бути заповнене'
}, // {
//     selector: '#edit_chart_legend', 
//     rules: ['requeried'], 
//     errorMessage: 'Поле "Додаткова назва графіка" повинне бути заповнене'
// },
{
  selector: '#chart_type',
  rules: ['requeried'],
  errorMessage: 'Необхідно обрати тип графіку'
}, // {
//     selector: '#edit_chart_type', 
//     rules: ['requeried'], 
//     errorMessage: 'Необхідно обрати тип графіку'
// },
// {
//     selector: '#chart_axis_x', 
//     rules: ['requeried', 'letters'], 
//     errorMessage: 'Поле "Назва осі Х" повинно бути заповнене та не може містити цифри'
// },
// {
//     selector: '#chart_axis_y', 
//     rules: ['requeried', 'letters'], 
//     errorMessage: 'Поле "Назва осі Y" повинно бути заповнене та не може містити цифри'
// },
// {
//     selector: '#chart_sufix', 
//     rules: ['requeried', 'letters'], 
//     errorMessage: 'Поле "Суфікс показників" повинно заповнене та містити лише літери'
// },
{
  selector: '.dataset_label',
  rules: ['requeried'],
  errorMessage: 'Назва набору даних повнинна бути заповнена'
}, {
  selector: '.dataset_value',
  rules: ['requeried', 'numbers'],
  errorMessage: 'Значення набору даних повинне бути заповнене та містити лише цифри'
}, {
  selector: '#add_dataset_button',
  rules: ['datasets'],
  errorMessage: 'Додайте хоча б один набір данних!'
} // {
//     selector: '#edit_add_dataset_button', 
//     rules: ['datasets'], 
//     errorMessage: 'Додайте хоча б один набір данних!'
// },
];

function chartHTMLTemplate(chartArrayId) {
  return "\n    <div class=\"col-12 col-md-10 col-xxl-8 ms-4 px-3 py-4 shadow chart-holder\"> \n        <div class=\"chart-menu-buttons-holder d-flex flex-column\">\n            <button class=\"btn btn-primary edit-chart-button mb-2\" chart_array_id=\"".concat(chartArrayId, "\">\u0420\u0435\u0434\u0430\u0433\u0443\u0432\u0430\u0442\u0438</button>\n            <button class=\"btn btn-danger remove-chart-button\" chart_array_id=\"").concat(chartArrayId, "\">\u0412\u0438\u0434\u0430\u043B\u0438\u0442\u0438</button>\n        </div>\n        <canvas class=\"chart\"></canvas> \n    </div>\n    <hr class=\"mb-3\"/>\n    ");
}

var selectors = {
  chartContainer: '.charts-container',
  chart: '.chart',
  editChartButton: '.edit-chart-button',
  removeChartButton: '.remove-chart-button'
};
var charts = [];
var articleChartsInstances = [];
/**
 * Cuts incoming string into pieces with length wich are close to "symbolsPerLine" number and places them into array 
 * 
 * @param {number} symbolsPerLine 
 * @param {string} string 
 * @returns 
 */

function stringCut(symbolsPerLine, string) {
  function findClosestSpaceToSymbolsPerLineNumberInString(lengthPerLine, string) {
    var spaceIndexes = [];
    var closestSpaces = [];
    var previousDifference;
    var currentClosestSpaceIndex;

    for (var i = 0; i < string.length; i++) {
      if (string[i] === ' ') {
        spaceIndexes.push(i);
      }
    }

    var _loop = function _loop(_i) {
      lengthPerLine = lengthPerLine * _i;
      spaceIndexes.forEach(function (spaceIndex, index) {
        if (index == 0) {
          previousDifference = Math.abs(lengthPerLine - spaceIndex);
        } else if (previousDifference > Math.abs(lengthPerLine - spaceIndex)) {
          currentClosestSpaceIndex = spaceIndex;
          previousDifference = Math.abs(lengthPerLine - spaceIndex);
          closestSpaces[_i - 1] = spaceIndex;
        }
      });
    };

    for (var _i = 1; spaceIndexes[spaceIndexes.length - 1] > lengthPerLine; _i++) {
      _loop(_i);
    } //deletes last space


    closestSpaces.pop();
    return closestSpaces;
  }

  function devideStringBySpaceIndexes(closestSpaceIndexes, string) {
    var devidedString = [];
    var tempString;
    closestSpaceIndexes.unshift(0);
    closestSpaceIndexes.push(string.length);

    for (var i = 0; i < closestSpaceIndexes.length - 1; i++) {
      tempString = '';

      for (var j = i == 0 ? closestSpaceIndexes[i] : closestSpaceIndexes[i] + 1; j < closestSpaceIndexes[i + 1]; j++) {
        tempString += string[j];
      }

      devidedString[i] = tempString;
    }

    return devidedString;
  }

  if (string.length < symbolsPerLine * 1.5) {
    return string;
  } else {
    return devideStringBySpaceIndexes(findClosestSpaceToSymbolsPerLineNumberInString(symbolsPerLine, string), string);
  }
}

function removeElementFromChartArray(chartArrayIndex) {
  charts.splice(chartArrayIndex, 1);
  articleChartsInstances.splice(chartArrayIndex, 1);
}
/**
 * Show edit chart modal with filled inputs
 * 
 * @param {number} id id of a particular chart in charts array
 */


function showEditChartModal(id) {
  function element(selector) {
    return document.querySelector(selector);
  }

  var modal = new bootstrap.Modal(document.getElementById('editChartModal'));
  var chartElement = charts[id];
  modal.show();
  var chartTitle = '';

  if (_typeof(chartElement.title) == 'object') {
    chartElement.title.forEach(function (titleFragment, index) {
      chartTitle += index == 0 ? titleFragment : ' ' + titleFragment;
    });
  } else {
    chartTitle = chartElement.title;
  }

  element('#edit_chart_id').value = id;
  element('#edit_chart_title').value = chartTitle;
  element('#edit_chart_legend').value = chartElement.legend;
  element('#edit_chart_type').value = chartElement.type;
  element('#edit_chart_axis_x').value = chartElement.axis.x;
  element('#edit_chart_axis_y').value = chartElement.axis.y;
  element('#edit_chart_sufix').value = chartElement.suffix;
  element('#edit_chart_verbal_rounding').checked = chartElement.isVerbalRoundingEnabled == 'true' ? true : false;
  element('#edit_chart_verbal_rounding_when_hovered').checked = chartElement.isVerbalRoundingEnabledForHoveredLabels == 'true' ? true : false;
  editDatasetContainer.innerHTML = '';
  chartElement.dataset.forEach(function (data, index) {
    editDatasetContainer.innerHTML += datasetHTMLTemplate(index);
  });
  document.querySelectorAll('.dataset_label').forEach(function (element, index) {
    element.value = chartElement.dataset[index].label;
  });
  document.querySelectorAll('.dataset_value').forEach(function (element, index) {
    element.value = chartElement.dataset[index].value;
  });
}
/**
 * 
 * @param {string} chartHTMLTemplate template for chart's canvas, actually chart holder template
 * @param {object} selectors object wich contains selectors for main elements
 * @param {array} chartsArray array with charts params like title, legend, values, etc
 * @returns 
 */


function buildCharts(chartHTMLTemplate, selectors, chartsArray) {
  var chartContainer = document.querySelector(selectors.chartContainer);
  chartContainer.innerHTML = '';
  charts.forEach(function (chart, index) {
    chartContainer.innerHTML += chartHTMLTemplate(index);
  });
  /* ITEMS FOR CHART DISPLAYING */

  var ChartPrototype = function ChartPrototype() {
    this.type = '';
    this.data = {
      labels: [],
      datasets: [{
        label: '',
        data: [],
        backgroundColor: [],
        borderColor: []
      }]
    };
  };

  function optimizeCanvasSize(canvas, chartData) {
    var chartsDefaultHeight = {
      more0less300: 120,
      more300less370: 93,
      more370less450: 80,
      more450less580: 65,
      more580less768: 65,
      more768less1365: 55,
      more1365: 55
    };

    function optimizeCanvasHeight(chartHeight, multiplier) {
      if (chartData.type === 'pie' || chartData.type === 'doughnut') {
        canvas.width = '100';
        canvas.height = (chartHeight + chartData.dataset.length * multiplier).toString();
      } else {
        //if chart has additional strings to their title, height of canvas will be increased
        if (_typeof(chartData.title) === 'object') {
          canvas.height = (chartHeight + chartData.title.length * multiplier).toString();
          canvas.width = '80';
        } else {
          canvas.height = chartHeight.toString();
          canvas.width = '80';
        }
      }
    }

    if (window.innerWidth > 0 && window.innerWidth <= 300) {
      optimizeCanvasHeight(chartsDefaultHeight.more0less300, 4);
    }

    if (window.innerWidth > 300 && window.innerWidth <= 370) {
      optimizeCanvasHeight(chartsDefaultHeight.more300less370, 4);
    }

    if (window.innerWidth > 370 && window.innerWidth <= 450) {
      optimizeCanvasHeight(chartsDefaultHeight.more370less450, 4);
    }

    if (window.innerWidth > 450 && window.innerWidth <= 580) {
      optimizeCanvasHeight(chartsDefaultHeight.more450less580, 3);
    }

    if (window.innerWidth > 580 && window.innerWidth <= 768) {
      optimizeCanvasHeight(chartsDefaultHeight.more580less768, 3);
    }

    if (window.innerWidth > 768 && window.innerWidth <= 1365) {
      optimizeCanvasHeight(chartsDefaultHeight.more768less1365, 3);
    }

    if (window.innerWidth > 1365) {
      optimizeCanvasHeight(chartsDefaultHeight.more1365, 3);
    }
  }

  function getRandomColor() {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    return {
      r: r,
      g: g,
      b: b
    };
  }

  function proceedAdditionalOptionsToChart(chartInstance, chartData) {
    var type = chartInstance.type,
        legend = chartData.legend,
        name = stringCut(35, chartData.title),
        axisNames = chartData.axis,
        dataLabelSuffix = chartData.suffix,
        arrayWithData = chartInstance.data.datasets[0].data.map(function (element) {
      return parseInt(element);
    }),
        showVerbalRounding = chartData.isVerbalRoundingEnabled === 'true',
        showVerbalRoundingForHoveredLabels = chartData.isVerbalRoundingEnabledForHoveredLabels === 'true',
        barsBackgroundsColors = [];
    chartInstance.data.datasets[0].barPercentage = 0.7;
    chartInstance.type = type;
    chartInstance.data.datasets[0].label = legend;
    chartInstance.options = {
      //here chart's title can be enabled
      title: {
        display: true,
        text: name,
        fontSize: 16,
        fontColor: 'black',
        fontFamily: '\'Open Sans\', sans-serif',
        padding: chartInstance.type === 'pie' || chartInstance.type === 'doughnut' ? 0 : 20
      },
      tooltips: {
        titleFontSize: 14,
        bodyFontSize: 12,
        footerFontSize: 12,
        callbacks: {
          label: function label(tooltipItem, data) {
            var currentItemIndex = tooltipItem.index,
                currentItemData = data.datasets[0].data[currentItemIndex],
                label = "".concat(data.labels[currentItemIndex], ": ");

            if (showVerbalRoundingForHoveredLabels == 'true' || showVerbalRoundingForHoveredLabels == true) {
              if (currentItemData >= 1000 && currentItemData < 1000000) {
                return "".concat(label).concat((currentItemData / 1000).toFixed(1), " \u0442\u0438\u0441.").concat(dataLabelSuffix);
              } else if (currentItemData >= 1000000 && currentItemData < 1000000000) {
                return "".concat(label).concat((currentItemData / 1000000).toFixed(1), " \u043C\u043B\u043D.").concat(dataLabelSuffix);
              } else if (currentItemData >= 1000000000) {
                return "".concat(label).concat((currentItemData / 1000000000).toFixed(1), " \u043C\u043B\u0440\u0434.").concat(dataLabelSuffix);
              } else {
                return "".concat(label).concat(currentItemData).concat(dataLabelSuffix);
              }
            } else {
              return "".concat(label).concat(currentItemData).concat(dataLabelSuffix);
            }
          }
        }
      },
      legend: {
        display: chartInstance.type === 'pie' || chartInstance.type === 'doughnut' || legend !== '',
        labels: {
          display: true,
          fontFamily: '\'Open Sans\', sans-serif',
          fontColor: 'black',
          fontSize: 14
        }
      },
      plugins: {
        datalabels: {
          display: !(chartInstance.type === 'pie' || chartInstance.type === 'doughnut'),
          anchor: chartInstance.type === 'pie' || chartInstance.type === 'doughnut' ? 'center' : 'end',
          align: chartInstance.type === 'pie' || chartInstance.type === 'doughnut' ? 'end' : chartInstance.type === 'horizontalBar' ? 'end' : 'top',
          formatter: function formatter(value, context) {
            if (showVerbalRounding == 'true' || showVerbalRounding == true) {
              if (value >= 1000 && value < 1000000) {
                return "".concat((value / 1000).toFixed(1), " \u0442\u0438\u0441.").concat(dataLabelSuffix);
              } else if (value >= 1000000 && value < 1000000000) {
                return "".concat((value / 1000000).toFixed(1), " \u043C\u043B\u043D.").concat(dataLabelSuffix);
              } else if (value >= 1000000000) {
                return "".concat((value / 1000000000).toFixed(1), " \u043C\u043B\u0440\u0434.").concat(dataLabelSuffix);
              } else {
                return "".concat(value).concat(dataLabelSuffix);
              }
            } else {
              return "".concat(value).concat(dataLabelSuffix);
            }
          },
          font: {
            family: '\'Open Sans\', sans-serif',
            size: 14
          },
          color: 'black'
        }
      }
    };

    if (chartInstance.type === 'line') {
      chartInstance.data.datasets[0].fill = false;
      /*
      fill chart elements with color according to amount of incoming data
          */

      for (var i = 0; i < arrayWithData.length; i++) {
        chartInstance.data.datasets[0].pointBorderColor.push('rgba(0, 0, 0, 1)');
        chartInstance.data.datasets[0].pointBackgroundColor.push('rgba(255, 99, 132, 1)');
        chartInstance.data.datasets[0].borderColor.push('rgba(255, 99, 132, 1)');
      }

      chartInstance.data.datasets[0].pointBorderWidth = 2;
    }

    if (chartInstance.type === 'bar' || chartInstance.type === 'horizontalBar') {
      for (var _i2 = 0; _i2 < arrayWithData.length; _i2++) {
        chartInstance.data.datasets[0].backgroundColor.push('rgba(255, 0, 0, 1)');
      }

      chartInstance.data.datasets[0].borderWidth = 0;
    }

    if (chartInstance.type === 'doughnut' || chartInstance.type === 'pie') {
      chartInstance.options.legend.position = window.innerWidth < 768 ? 'top' : 'top';

      for (var _i3 = 0; _i3 < arrayWithData.length; _i3++) {
        var randomColor = getRandomColor();
        chartInstance.data.datasets[0].backgroundColor.push("rgba(".concat(randomColor.r, ",").concat(randomColor.g, ",").concat(randomColor.b, ", 0.4)"));
        chartInstance.data.datasets[0].borderColor.push("rgba(".concat(randomColor.r, ",").concat(randomColor.g, ",").concat(randomColor.b, ", 0.8)"));
      }

      chartInstance.data.datasets[0].borderWidth = 1;
    }

    if (chartInstance.type === 'bar' || chartInstance.type === 'horizontalBar' || chartInstance.type === 'line') {
      chartInstance.options.scales = {
        xAxes: [{
          scaleLabel: {
            labelString: axisNames.x,
            display: axisNames.x !== '',
            fontFamily: '\'Open Sans\', sans-serif',
            fontSize: 14,
            fontColor: 'black',
            padding: 0
          },
          offset: chartInstance.type !== 'horizontalBar',
          ticks: {
            callback: function callback(value, index, values) {
              if (showVerbalRounding == 'true' || showVerbalRounding == true) {
                if (value >= 1000 && value < 1000000) {
                  return "".concat((value / 1000).toFixed(1), " \u0442\u0438\u0441.").concat(dataLabelSuffix);
                } else if (value >= 1000000 && value < 1000000000) {
                  return "".concat((value / 1000000).toFixed(1), " \u043C\u043B\u043D.").concat(dataLabelSuffix);
                } else if (value >= 1000000000) {
                  return "".concat((value / 1000000000).toFixed(1), " \u043C\u043B\u0440\u0434.").concat(dataLabelSuffix);
                } else {
                  return "".concat(value).concat(dataLabelSuffix);
                }
              } else {
                return "".concat(value).concat(dataLabelSuffix);
              }
            },
            beginAtZero: true,
            fontSize: 14,
            suggestedMax: Math.max.apply(Math, _toConsumableArray(arrayWithData)) * 1.25
          }
        }],
        yAxes: [{
          scaleLabel: {
            labelString: axisNames.y,
            display: axisNames.y !== '',
            fontFamily: '\'Open Sans\', sans-serif',
            fontSize: 14,
            fontColor: 'black',
            padding: 0
          },
          ticks: {
            callback: function callback(value, index, values) {
              if (showVerbalRounding == 'true' || showVerbalRounding == true) {
                if (value >= 1000 && value < 1000000) {
                  return "".concat((value / 1000).toFixed(1), " \u0442\u0438\u0441.").concat(dataLabelSuffix);
                } else if (value >= 1000000 && value < 1000000000) {
                  return "".concat((value / 1000000).toFixed(1), " \u043C\u043B\u043D.").concat(dataLabelSuffix);
                } else if (value >= 1000000000) {
                  return "".concat((value / 1000000000).toFixed(1), " \u043C\u043B\u0440\u0434.").concat(dataLabelSuffix);
                } else {
                  return "".concat(value).concat(dataLabelSuffix);
                }
              } else {
                return "".concat(value).concat(dataLabelSuffix);
              }
            },
            beginAtZero: true,
            fontSize: 14,
            suggestedMax: Math.max.apply(Math, _toConsumableArray(arrayWithData)) * 1.25
          }
        }]
      };
    }
  }

  var chartCanvases = document.querySelectorAll(selectors.chart),
      articleChartsInstances = [];

  if (chartCanvases.length <= chartsArray.length) {
    /*
        Building a chart according to amount of canvases (chart holders)
    */
    chartCanvases.forEach(function (canvas, index) {
      var currentChartData = chartsArray[index],
          chart = new ChartPrototype();
      chart.type = currentChartData.type;
      chart.data.datasets[0].label = currentChartData.label;
      /*
          optimizing canvas size depends on incoming data and other information,
          before assigning it as a chart holder
      */

      optimizeCanvasSize(canvas, currentChartData);
      /*
          fills chart prototype with data according to it's structure
      */

      currentChartData.dataset.forEach(function (data) {
        chart.data.datasets[0].data.push(data.value); //[0,1,2,3,4,N,...,Nx]

        chart.data.labels.push(data.label); //[label1,label2,label3,...,labelN]
      });
      proceedAdditionalOptionsToChart(chart, currentChartData);
      articleChartsInstances.push(new Chart(canvas, chart));
    });
  } else {
    /*
        Building a chart according to amount of datasets
    */
    chartsArray.forEach(function (currentChartData, index) {
      var canvas = chartCanvases[index],
          chart = new ChartPrototype();
      chart.type = currentChartData.type;
      chart.data.datasets[0].label = currentChartData.label;
      /*
          optimizing canvas size depends on incoming data and other information,
          before assigning it as a chart holder
      */
      // optimizeCanvasSize(canvas, currentChartData);

      /*
          fills chart prototype with data according to it's structure
      */

      currentChartData.dataset.forEach(function (data) {
        chart.data.datasets[0].data.push(data.value); //[data1,data2,data3,...,dataN]

        chart.data.labels.push(data.label); //[label1,label2,label3,...,labelN]
      });
      proceedAdditionalOptionsToChart(chart, currentChartData);
      articleChartsInstances.push(new Chart(canvas, chart));
    });
  } //assign to chart keys some actions (edit, remove, etc)


  if (articleChartsInstances.length > 0) {
    //remove button asignment
    document.querySelectorAll('.remove-chart-button').forEach(function (button) {
      button.onclick = function (event) {
        removeElementFromChartArray(event.target.getAttribute('chart_array_id'));
        buildCharts(chartHTMLTemplate, selectors, charts);
      };
    }); //edit button asignment

    document.querySelectorAll('.edit-chart-button').forEach(function (button) {
      button.onclick = function (event) {
        showEditChartModal(event.target.getAttribute('chart_array_id'));
      };
    });
  }

  return articleChartsInstances;
}
/**
 * do errors validation of html inputs
 * 
 * 1) gets all fields wich are needed to be validated
 * 2) checks it value, if it match required rule (basically regexp based)
 * 3) fills error array with invalid inputs IDs and error messages
 * 4) returns this array to further proceed
 */


function doFieldsValidation(elementsForValidation, rules) {
  var errors = [],
      nodesFromHTML;
  elementsForValidation.forEach(function (element) {
    nodesFromHTML = document.querySelectorAll(element.selector);
    nodesFromHTML.forEach(function (node) {
      element.rules.every(function (rule) {
        if (!rules[rule](node.value)) {
          errors.push({
            nodeID: node.id,
            message: element.errorMessage
          });
          return false;
        } else {
          return true;
        }
      });
    });
  });
  return errors;
}
/**
 * Removes old error displaying, generate new depends on needs 
 * 
 * returns true, if errors is still on the page, false - if there is no errors left
 */


function handleErrorDisplaying(errors, errorsContainerSelector) {
  var chartErrorsContainer = document.querySelector(errorsContainerSelector);
  chartErrorsContainer.hidden = true;
  chartErrorsContainer.innerHTML = '';
  document.querySelectorAll('.is-invalid').forEach(function (errorNode) {
    errorNode.classList.remove('is-invalid');
  });

  if (errors.length > 0) {
    chartErrorsContainer.hidden = false;
    errors.forEach(function (error) {
      chartErrorsContainer.innerHTML += "<li>".concat(error.message, "</li>");
      document.querySelector("#".concat(error.nodeID)).classList.add('is-invalid');
    });
    return true;
  } else {
    return false;
  }
}

function clearCreateChartModal() {
  chartFieldsIDs.forEach(function (ID) {
    if (ID == 'chart_verbal_rounding' || ID == 'chart_verbal_rounding_when_hovered') {
      document.querySelector("#".concat(ID)).checked = false;
    } else {
      document.querySelector("#".concat(ID)).value = '';
    }
  });
  currentChartDataset = 0;
  datasetContainer.innerHTML = '';
  var myModalEl = document.getElementById('diagramModal');
  var modal = bootstrap.Modal.getInstance(myModalEl);
  modal.hide();
}

function clearEditChartModal() {
  editChartFieldsIDs.forEach(function (ID) {
    if (ID == 'edit_chart_verbal_rounding' || ID == 'edit_chart_verbal_rounding_when_hovered') {
      document.querySelector("#".concat(ID)).checked = false;
    } else {
      document.querySelector("#".concat(ID)).value = '';
    }
  });
  currentChartDataset = 0;
  editDatasetContainer.innerHTML = '';
  var modalEl = document.getElementById('editChartModal');
  var modal = bootstrap.Modal.getInstance(modalEl);
  modal.hide(); //clear black backscreens

  document.querySelectorAll('.modal-backdrop').forEach(function (element) {
    element.remove();
  });
} //TODO: need to work on mode 'edit'


function submitChartData(mode, chartID) {
  if (isValidationEnabled == true && handleErrorDisplaying(doFieldsValidation(elementsForValidation, rules), '#chart_errors')) {
    return false;
  }
  /* Defining and filling chart fields with values */


  var chartFields = {};

  switch (mode) {
    case 'create':
      chartFieldsIDs.every(function (ID) {
        if (ID == 'chart_verbal_rounding') {
          chartFields[ID] = document.querySelector("#".concat(ID)).checked ? 'true' : 'false';
          return true;
        }

        if (ID == 'chart_verbal_rounding_when_hovered') {
          chartFields[ID] = document.querySelector("#".concat(ID)).checked ? 'true' : 'false';
          return true;
        }

        chartFields[ID] = document.querySelector("#".concat(ID)).value;
        return true;
      });
      break;

    case 'edit':
      editChartFieldsIDs.every(function (ID) {
        if (ID == 'edit_chart_verbal_rounding') {
          chartFields[ID] = document.querySelector("#".concat(ID)).checked ? 'true' : 'false';
          return true;
        }

        if (ID == 'edit_chart_verbal_rounding_when_hovered') {
          chartFields[ID] = document.querySelector("#".concat(ID)).checked ? 'true' : 'false';
          return true;
        }

        chartFields[ID] = document.querySelector("#".concat(ID)).value;
        return true;
      });
      break;
  }
  /* Defining and filling chart datasets with values */


  var dataset = [];
  var datasetElement = {};
  var datasetElements = document.querySelectorAll('.dataset_element');
  datasetElements.forEach(function (element, index) {
    if (index % 2 == 0) {
      datasetElement.label = element.value;
    }

    if (index % 2 == 1) {
      datasetElement.value = element.value;
      dataset.push(datasetElement);
      datasetElement = {};
    }
  });
  var chartInstance = {};

  switch (mode) {
    case 'create':
      chartInstance = {
        // numberInList: charts.length,
        title: chartFields.chart_title,
        legend: chartFields.chart_legend,
        type: chartFields.chart_type,
        axis: {
          x: chartFields.chart_axis_x,
          y: chartFields.chart_axis_y
        },
        suffix: chartFields.chart_sufix,
        isVerbalRoundingEnabled: chartFields.chart_verbal_rounding,
        isVerbalRoundingEnabledForHoveredLabels: chartFields.chart_verbal_rounding_when_hovered,
        dataset: dataset
      };
      charts.push(chartInstance);
      clearCreateChartModal();
      break;

    case 'edit':
      chartInstance = {
        // numberInList: charts.length,
        title: chartFields.edit_chart_title,
        legend: chartFields.edit_chart_legend,
        type: chartFields.edit_chart_type,
        axis: {
          x: chartFields.edit_chart_axis_x,
          y: chartFields.edit_chart_axis_y
        },
        suffix: chartFields.edit_chart_sufix,
        isVerbalRoundingEnabled: chartFields.edit_chart_verbal_rounding,
        isVerbalRoundingEnabledForHoveredLabels: chartFields.edit_chart_verbal_rounding_when_hovered,
        dataset: dataset
      };
      charts[chartID] = chartInstance;
      clearEditChartModal();
      break;
  }
  /* */


  charts = [//    {
  //         title: 'Виконання бюджету',
  //         legend: 'План',
  //         type: 'horizontalBar',
  //         axis: {
  //             x: 'назва фонду',
  //             y: 'грн'
  //         },
  //         suffix: 'грн',
  //         isVerbalRoundingEnabled: 'false',
  //         isVerbalRoundingEnabledForHoveredLabels: 'true',
  //         dataset: [
  //             {label: 'Загальний фонд', value: '1701400000'},
  //             {label: 'Міжбюджетні трансферти', value: '492900000'},
  //             {label: 'Спеціальний фонд', value: '134200000'},
  //             {label: 'Бюджет розвитку', value: '33000000'},
  //             {label: 'Міжбюджетні трансферти', value: '492900000'},
  //             {label: 'Спеціальний фонд', value: '134200000'},
  //             {label: 'Бюджет розвитку', value: '33000000'},
  //             {label: 'Міжбюджетні трансферти', value: '492900000'},
  //             {label: 'Спеціальний фонд', value: '134200000'},
  //             {label: 'Бюджет розвитку', value: '33000000'}
  //         ] 
  //     },
  {
    title: 'Назва діаграми',
    legend: 'Додаткова назва діаграми',
    type: 'doughnut',
    axis: {
      x: 'назва фонду',
      y: 'назва фонду'
    },
    suffix: 'грн',
    isVerbalRoundingEnabled: 'false',
    isVerbalRoundingEnabledForHoveredLabels: 'false',
    dataset: [{
      label: 'Назва діаграми',
      value: '123'
    }, {
      label: 'Назва діаграми 2',
      value: '321'
    }]
  } // {
  //     title: 'Виконання бюджету',
  //     legend: 'План',
  //     type: 'bar',
  //     axis: {
  //         x: 'назва фонду',
  //         y: 'грн'
  //     },
  //     suffix: 'грн',
  //     isVerbalRoundingEnabled: 'true',
  //     isVerbalRoundingEnabledForHoveredLabels: 'true',
  //     dataset: [
  //         {label: 'Загальний фонд', value: '1701400000'},
  //         {label: 'Міжбюджетні трансферти', value: '492900000'},
  //         {label: 'Спеціальний фонд', value: '134200000'},
  //         {label: 'Бюджет розвитку', value: '33000000'}
  //     ] 
  // }
  ];
  /* */

  console.log(charts);
  articleChartsInstances = buildCharts(chartHTMLTemplate, selectors, charts);
}

document.querySelector('#submit_chart_data').onclick = function () {
  submitChartData('create');
};

document.querySelector('#submit_edited_chart_data').onclick = function () {
  submitChartData('edit', document.querySelector('#edit_chart_id').value);
};

document.querySelector('#debug').onclick = function () {};
})();

/******/ })()
;