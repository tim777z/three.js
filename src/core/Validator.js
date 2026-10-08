/**
 * @author PreCog Security / https://precog.security/
 * Input validation utilities for three.js
 * Provides runtime type checking and constraint validation
 */

THREE.Validator = (function () {
  const Validator = {};

  // Type checking helpers
  const typeCheckers = {
    'string': function (v) { return typeof v === 'string'; },
    'number': function (v) { return typeof v === 'number' && !isNaN(v); },
    'integer': function (v) { return Number.isInteger(v); },
    'boolean': function (v) { return typeof v === 'boolean'; },
    'function': function (v) { return typeof v === 'function'; },
    'object': function (v) { return v !== null && typeof v === 'object' && !Array.isArray(v); },
    'array': function (v) { return Array.isArray(v); },
    'null': function (v) { return v === null; },
    'undefined': function (v) { return v === undefined; },
    'HTMLCanvasElement': function (v) { return v instanceof HTMLCanvasElement; },
    'WebGLRenderingContext': function (v) { return v instanceof WebGLRenderingContext; },
    'WebGL2RenderingContext': function (v) { return v instanceof WebGL2RenderingContext; },
    'Image': function (v) { return v instanceof HTMLImageElement; },
    'Video': function (v) { return v instanceof HTMLVideoElement; },
    'Canvas': function (v) { return v instanceof HTMLCanvasElement; },
    'ArrayBuffer': function (v) { return v instanceof ArrayBuffer; },
    'TypedArray': function (v) { return ArrayBuffer.isView(v) && !(v instanceof DataView); },
    'DataView': function (v) { return v instanceof DataView; }
  };

  // Check if a value matches a type
  Validator.checkType = function (value, type) {
    const checker = typeCheckers[type];
    if (checker) {
      return checker(value);
    }
    // Check for THREE classes
    if (typeof type === 'function' && THREE[type.name]) {
      return value instanceof type;
    }
    return false;
  };

  // Get type name for error messages
  Validator.getTypeName = function (value) {
    if (value === null) {return 'null';}
    if (value === undefined) {return 'undefined';}
    if (Array.isArray(value)) {return 'array';}
    if (value instanceof HTMLCanvasElement) {return 'HTMLCanvasElement';}
    if (value instanceof WebGLRenderingContext) {return 'WebGLRenderingContext';}
    if (value instanceof WebGL2RenderingContext) {return 'WebGL2RenderingContext';}
    if (value instanceof HTMLImageElement) {return 'HTMLImageElement';}
    if (value instanceof HTMLVideoElement) {return 'HTMLVideoElement';}
    if (value instanceof ArrayBuffer) {return 'ArrayBuffer';}
    if (ArrayBuffer.isView(value) && !(value instanceof DataView)) {return 'TypedArray';}
    if (value instanceof DataView) {return 'DataView';}
    return typeof value;
  };

  // Validate a single value against constraints
  Validator.validateValue = function (value, constraints, fieldName) {
    fieldName = fieldName || 'value';
    const errors = [];

    // Required check
    if (constraints.required && (value === undefined || value === null)) {
      errors.push(new THREE.ValidationError(`Missing required field: ${  fieldName}`, {
        field: fieldName,
        constraints: { required: true }
      }));
      return errors;
    }

    // Skip further validation if value is null/undefined and not required
    if (value === undefined || value === null) {
      return errors;
    }

    // Type check
    if (constraints.type) {
      const expectedType = constraints.type;
      if (!Validator.checkType(value, expectedType)) {
        errors.push(new THREE.ValidationError(`Invalid type for ${  fieldName}`, {
          field: fieldName,
          value: value,
          constraints: { expectedType: expectedType, actualType: Validator.getTypeName(value) }
        }));
        return errors; // Don't continue if type is wrong
      }
    }

    // Number constraints
    if (typeof value === 'number') {
      if (constraints.min !== undefined && value < constraints.min) {
        errors.push(new THREE.ValidationError(`${fieldName  } below minimum`, {
          field: fieldName,
          value: value,
          constraints: { min: constraints.min }
        }));
      }
      if (constraints.max !== undefined && value > constraints.max) {
        errors.push(new THREE.ValidationError(`${fieldName  } above maximum`, {
          field: fieldName,
          value: value,
          constraints: { max: constraints.max }
        }));
      }
      if (constraints.integer && !Number.isInteger(value)) {
        errors.push(new THREE.ValidationError(`${fieldName  } must be an integer`, {
          field: fieldName,
          value: value,
          constraints: { integer: true }
        }));
      }
      if (constraints.positive && value <= 0) {
        errors.push(new THREE.ValidationError(`${fieldName  } must be positive`, {
          field: fieldName,
          value: value,
          constraints: { positive: true }
        }));
      }
      if (constraints.nonNegative && value < 0) {
        errors.push(new THREE.ValidationError(`${fieldName  } must be non-negative`, {
          field: fieldName,
          value: value,
          constraints: { nonNegative: true }
        }));
      }
    }

    // String constraints
    if (typeof value === 'string') {
      if (constraints.minLength !== undefined && value.length < constraints.minLength) {
        errors.push(new THREE.ValidationError(`${fieldName  } too short`, {
          field: fieldName,
          value: value,
          constraints: { minLength: constraints.minLength }
        }));
      }
      if (constraints.maxLength !== undefined && value.length > constraints.maxLength) {
        errors.push(new THREE.ValidationError(`${fieldName  } too long`, {
          field: fieldName,
          value: value,
          constraints: { maxLength: constraints.maxLength }
        }));
      }
      if (constraints.pattern && !constraints.pattern.test(value)) {
        errors.push(new THREE.ValidationError(`${fieldName  } does not match pattern`, {
          field: fieldName,
          value: value,
          constraints: { pattern: constraints.pattern.toString() }
        }));
      }
      if (constraints.enum && constraints.enum.indexOf(value) === -1) {
        errors.push(new THREE.ValidationError(`${fieldName  } must be one of: ${  constraints.enum.join(', ')}`, {
          field: fieldName,
          value: value,
          constraints: { enum: constraints.enum }
        }));
      }
    }

    // Array constraints
    if (Array.isArray(value)) {
      if (constraints.minLength !== undefined && value.length < constraints.minLength) {
        errors.push(new THREE.ValidationError(`${fieldName  } has too few elements`, {
          field: fieldName,
          value: value,
          constraints: { minLength: constraints.minLength }
        }));
      }
      if (constraints.maxLength !== undefined && value.length > constraints.maxLength) {
        errors.push(new THREE.ValidationError(`${fieldName  } has too many elements`, {
          field: fieldName,
          value: value,
          constraints: { maxLength: constraints.maxLength }
        }));
      }
      if (constraints.itemType) {
        value.forEach((item, index) => {
          if (!Validator.checkType(item, constraints.itemType)) {
            errors.push(new THREE.ValidationError(`${fieldName  }[${  index  }] has invalid type`, {
              field: `${fieldName  }[${  index  }]`,
              value: item,
              constraints: { expectedType: constraints.itemType, actualType: Validator.getTypeName(item) }
            }));
          }
        });
      }
    }

    // Object constraints
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      if (constraints.shape) {
        const shapeErrors = Validator.validateObject(value, constraints.shape);
        errors.push.apply(errors, shapeErrors);
      }
      if (constraints.keys) {
        const keys = Object.keys(value);
        const allowedKeys = constraints.keys;
        keys.forEach((key) => {
          if (allowedKeys.indexOf(key) === -1) {
            errors.push(new THREE.ValidationError(`Unexpected key: ${  key}`, {
              field: `${fieldName  }.${  key}`,
              constraints: { allowedKeys: allowedKeys }
            }));
          }
        });
      }
    }

    // Custom validator
    if (constraints.custom && typeof constraints.custom === 'function') {
      const customResult = constraints.custom(value, fieldName);
      if (customResult !== true) {
        errors.push(new THREE.ValidationError(`${fieldName  } failed custom validation`, {
          field: fieldName,
          value: value,
          constraints: { custom: true, message: customResult }
        }));
      }
    }

    return errors;
  };

  // Validate an object against a schema
  Validator.validateObject = function (obj, schema) {
    const errors = [];

    if (!obj || typeof obj !== 'object') {
      errors.push(new THREE.ValidationError(`Expected object, got ${  Validator.getTypeName(obj)}`, {
        constraints: { expectedType: 'object', actualType: Validator.getTypeName(obj) }
      }));
      return errors;
    }

    // Check each field in schema
    for (const fieldName in schema) {
      if (Object.prototype.hasOwnProperty.call(schema, fieldName)) {
        const fieldErrors = Validator.validateValue(obj[fieldName], schema[fieldName], fieldName);
        errors.push.apply(errors, fieldErrors);
      }
    }

    // Check for unexpected fields if strict mode
    if (schema._strict) {
      const allowedKeys = Object.keys(schema).filter((k) => { return k !== '_strict'; });
      const actualKeys = Object.keys(obj);
      actualKeys.forEach((key) => {
        if (allowedKeys.indexOf(key) === -1) {
          errors.push(new THREE.ValidationError(`Unexpected field: ${  key}`, {
            field: key,
            constraints: { allowedKeys: allowedKeys }
          }));
        }
      });
    }

    return errors;
  };

  // Validate and throw on first error
  Validator.assert = function (value, constraints, fieldName) {
    const errors = Validator.validateValue(value, constraints, fieldName);
    if (errors.length > 0) {
      throw errors[0];
    }
    return value;
  };

  // Validate object and throw on first error
  Validator.assertObject = function (obj, schema) {
    const errors = Validator.validateObject(obj, schema);
    if (errors.length > 0) {
      throw errors[0];
    }
    return obj;
  };

  // Validate multiple values at once
  Validator.validateAll = function (validations) {
    const allErrors = [];
    validations.forEach((validation) => {
      const errors = Validator.validateValue(validation.value, validation.constraints, validation.fieldName);
      allErrors.push.apply(allErrors, errors);
    });
    return allErrors;
  };

  // Convenience methods for common validations
  Validator.validateNumber = function (value, fieldName, options) {
    options = options || {};
    return Validator.validateValue(value, {
      type: 'number',
      required: options.required !== false,
      min: options.min,
      max: options.max,
      integer: options.integer,
      positive: options.positive,
      nonNegative: options.nonNegative
    }, fieldName);
  };

  Validator.validateVector3 = function (value, fieldName) {
    const errors = Validator.validateValue(value, {
      type: 'object',
      required: true,
      shape: {
        x: { type: 'number', required: true },
        y: { type: 'number', required: true },
        z: { type: 'number', required: true }
      }
    }, fieldName);

    // Also accept THREE.Vector3 instances
    if (errors.length > 0 && value instanceof THREE.Vector3) {
      return [];
    }

    return errors;
  };

  Validator.validateColor = function (value, fieldName) {
    const errors = [];

    if (value instanceof THREE.Color) {
      return errors;
    }

    if (typeof value === 'number') {
      // Hex color
      if (value < 0 || value > 0xFFFFFF) {
        errors.push(new THREE.ValidationError(`${fieldName  } hex color out of range`, {
          field: fieldName,
          value: value,
          constraints: { min: 0, max: 0xFFFFFF }
        }));
      }
      return errors;
    }

    if (typeof value === 'string') {
      // CSS color string
      const cssColorRegex = /^(#([0-9a-f]{3}|[0-9a-f]{6})|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)|rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)|hsl\(\s*\d+\s*,\s*[\d.]+%\s*,\s*[\d.]+%\s*\)|hsla\(\s*\d+\s*,\s*[\d.]+%\s*,\s*[\d.]+%\s*,\s*[\d.]+\s*\))$/i;
      if (!cssColorRegex.test(value)) {
        errors.push(new THREE.ValidationError(`${fieldName  } invalid CSS color`, {
          field: fieldName,
          value: value,
          constraints: { pattern: 'CSS color format' }
        }));
      }
      return errors;
    }

    errors.push(new THREE.ValidationError(`${fieldName  } must be Color, hex number, or CSS color string`, {
      field: fieldName,
      value: value,
      constraints: { expectedType: 'Color|number|string' }
    }));
    return errors;
  };

  Validator.validateTexture = function (value, fieldName) {
    if (value instanceof THREE.Texture) {
      return [];
    }
    return [new THREE.ValidationError(`${fieldName  } must be a THREE.Texture instance`, {
      field: fieldName,
      value: value,
      constraints: { expectedType: 'THREE.Texture' }
    })];
  };

  Validator.validateMaterial = function (value, fieldName) {
    if (value instanceof THREE.Material) {
      return [];
    }
    return [new THREE.ValidationError(`${fieldName  } must be a THREE.Material instance`, {
      field: fieldName,
      value: value,
      constraints: { expectedType: 'THREE.Material' }
    })];
  };

  Validator.validateGeometry = function (value, fieldName) {
    if (value instanceof THREE.BufferGeometry || value instanceof THREE.Geometry) {
      return [];
    }
    return [new THREE.ValidationError(`${fieldName  } must be a THREE.BufferGeometry or THREE.Geometry instance`, {
      field: fieldName,
      value: value,
      constraints: { expectedType: 'THREE.BufferGeometry|THREE.Geometry' }
    })];
  };

  // Sanitize input - remove unexpected properties
  Validator.sanitize = function (obj, schema) {
    if (!obj || typeof obj !== 'object') {return obj;}

    const sanitized = {};
    for (const key in schema) {
      if (Object.prototype.hasOwnProperty.call(schema, key) && Object.prototype.hasOwnProperty.call(obj, key)) {
        sanitized[key] = obj[key];
      }
    }
    return sanitized;
  };

  // Coerce value to expected type
  Validator.coerce = function (value, type) {
    switch (type) {
    case 'number': {
      const num = Number(value);
      return isNaN(num) ? value : num;
    }
    case 'integer': {
      const int = parseInt(value, 10);
      return isNaN(int) ? value : int;
    }
    case 'boolean':
      if (typeof value === 'string') {
        return value.toLowerCase() === 'true' || value === '1';
      }
      return Boolean(value);
    case 'string':
      return String(value);
    default:
      return value;
    }
  };

  return Validator;
})();