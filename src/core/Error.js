/**
 * @author PreCog Security / https://precog.security/
 * Structured error handling for three.js
 * Replaces string-based errors with typed error classes
 */

THREE.Error = function (message, options) {
  options = options || {};

  Error.call(this, message);

  this.name = 'THREE.Error';
  this.message = message;
  this.code = options.code || 'THREE_ERROR';
  this.recoverable = options.recoverable !== undefined ? options.recoverable : true;
  this.details = options.details || {};
  this.timestamp = new Date().toISOString();

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  }
};

THREE.Error.prototype = Object.create(Error.prototype);
THREE.Error.prototype.constructor = THREE.Error;

THREE.Error.prototype.toJSON = function () {
  return {
    name: this.name,
    message: this.message,
    code: this.code,
    recoverable: this.recoverable,
    details: this.details,
    timestamp: this.timestamp,
    stack: this.stack
  };
};

THREE.Error.prototype.toString = function () {
  return `${this.name  }: ${  this.message  } (code: ${  this.code  })`;
};

// Validation Error - for input validation failures
THREE.ValidationError = function (message, options) {
  options = options || {};
  options.code = options.code || 'VALIDATION_ERROR';
  options.recoverable = options.recoverable !== undefined ? options.recoverable : false;

  THREE.Error.call(this, message, options);

  this.name = 'THREE.ValidationError';
  this.field = options.field || null;
  this.value = options.value;
  this.constraints = options.constraints || {};
};

THREE.ValidationError.prototype = Object.create(THREE.Error.prototype);
THREE.ValidationError.prototype.constructor = THREE.ValidationError;

// WebGL Error - for WebGL-specific failures
THREE.WebGLError = function (message, options) {
  options = options || {};
  options.code = options.code || 'WEBGL_ERROR';
  options.recoverable = options.recoverable !== undefined ? options.recoverable : false;

  THREE.Error.call(this, message, options);

  this.name = 'THREE.WebGLError';
  this.context = options.context || null;
  this.extension = options.extension || null;
};

THREE.WebGLError.prototype = Object.create(THREE.Error.prototype);
THREE.WebGLError.prototype.constructor = THREE.WebGLError;

// Shader Error - for shader compilation/linking failures
THREE.ShaderError = function (message, options) {
  options = options || {};
  options.code = options.code || 'SHADER_ERROR';
  options.recoverable = options.recoverable !== undefined ? options.recoverable : false;

  THREE.Error.call(this, message, options);

  this.name = 'THREE.ShaderError';
  this.shaderType = options.shaderType || null; // 'vertex' | 'fragment'
  this.source = options.source || null;
  this.log = options.log || null;
};

THREE.ShaderError.prototype = Object.create(THREE.Error.prototype);
THREE.ShaderError.prototype.constructor = THREE.ShaderError;

// Loader Error - for asset loading failures
THREE.LoaderError = function (message, options) {
  options = options || {};
  options.code = options.code || 'LOADER_ERROR';
  options.recoverable = options.recoverable !== undefined ? options.recoverable : true;

  THREE.Error.call(this, message, options);

  this.name = 'THREE.LoaderError';
  this.url = options.url || null;
  this.status = options.status || null;
  this.loader = options.loader || null;
};

THREE.LoaderError.prototype = Object.create(THREE.Error.prototype);
THREE.LoaderError.prototype.constructor = THREE.LoaderError;

// Geometry Error - for geometry-related failures
THREE.GeometryError = function (message, options) {
  options = options || {};
  options.code = options.code || 'GEOMETRY_ERROR';
  options.recoverable = options.recoverable !== undefined ? options.recoverable : false;

  THREE.Error.call(this, message, options);

  this.name = 'THREE.GeometryError';
  this.geometryType = options.geometryType || null;
  this.attribute = options.attribute || null;
};

THREE.GeometryError.prototype = Object.create(THREE.Error.prototype);
THREE.GeometryError.prototype.constructor = THREE.GeometryError;

// Texture Error - for texture-related failures
THREE.TextureError = function (message, options) {
  options = options || {};
  options.code = options.code || 'TEXTURE_ERROR';
  options.recoverable = options.recoverable !== undefined ? options.recoverable : true;

  THREE.Error.call(this, message, options);

  this.name = 'THREE.TextureError';
  this.textureType = options.textureType || null;
  this.format = options.format || null;
};

THREE.TextureError.prototype = Object.create(THREE.Error.prototype);
THREE.TextureError.prototype.constructor = THREE.TextureError;

// Animation Error - for animation-related failures
THREE.AnimationError = function (message, options) {
  options = options || {};
  options.code = options.code || 'ANIMATION_ERROR';
  options.recoverable = options.recoverable !== undefined ? options.recoverable : true;

  THREE.Error.call(this, message, options);

  this.name = 'THREE.AnimationError';
  this.clip = options.clip || null;
  this.track = options.track || null;
};

THREE.AnimationError.prototype = Object.create(THREE.Error.prototype);
THREE.AnimationError.prototype.constructor = THREE.AnimationError;

// Error factory for common error scenarios
THREE.ErrorFactory = {
  webglContextLost: function (reason) {
    return new THREE.WebGLError(`WebGL context lost: ${  reason}`, {
      code: 'WEBGL_CONTEXT_LOST',
      recoverable: true,
      details: { reason: reason }
    });
  },

  webglContextCreationFailed: function (attributes) {
    return new THREE.WebGLError('Failed to create WebGL context', {
      code: 'WEBGL_CONTEXT_CREATION_FAILED',
      recoverable: false,
      details: { attributes: attributes }
    });
  },

  shaderCompileFailed: function (shaderType, source, log) {
    return new THREE.ShaderError(`Shader compilation failed: ${  shaderType}`, {
      code: 'SHADER_COMPILE_FAILED',
      shaderType: shaderType,
      source: source,
      log: log
    });
  },

  shaderLinkFailed: function (vertexSource, fragmentSource, log) {
    return new THREE.ShaderError('Shader program linking failed', {
      code: 'SHADER_LINK_FAILED',
      source: { vertex: vertexSource, fragment: fragmentSource },
      log: log
    });
  },

  invalidParameter: function (paramName, expectedType, actualValue) {
    return new THREE.ValidationError(`Invalid parameter: ${  paramName}`, {
      code: 'INVALID_PARAMETER',
      field: paramName,
      value: actualValue,
      constraints: { expectedType: expectedType }
    });
  },

  outOfRange: function (paramName, value, min, max) {
    return new THREE.ValidationError(`Parameter out of range: ${  paramName}`, {
      code: 'OUT_OF_RANGE',
      field: paramName,
      value: value,
      constraints: { min: min, max: max }
    });
  },

  missingRequiredParameter: function (paramName) {
    return new THREE.ValidationError(`Missing required parameter: ${  paramName}`, {
      code: 'MISSING_REQUIRED_PARAMETER',
      field: paramName,
      constraints: { required: true }
    });
  },

  loadFailed: function (url, status, loader) {
    return new THREE.LoaderError(`Failed to load resource: ${  url}`, {
      code: 'LOAD_FAILED',
      url: url,
      status: status,
      loader: loader
    });
  },

  unsupportedFormat: function (format, context) {
    return new THREE.Error(`Unsupported format: ${  format}`, {
      code: 'UNSUPPORTED_FORMAT',
      details: { format: format, context: context }
    });
  },

  deprecated: function (oldApi, newApi) {
    return new THREE.Error(`${oldApi  } is deprecated. Use ${  newApi  } instead.`, {
      code: 'DEPRECATED',
      recoverable: true,
      details: { oldApi: oldApi, newApi: newApi }
    });
  }
};