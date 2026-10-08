# three.js

#### JavaScript 3D Library ####

The aim of the project is to create a lightweight 3D library with a very low level of complexity — in other words, for dummies. The library provides `<canvas>`, `<svg>`, CSS3D and WebGL renderers.

[Examples](http://threejs.org/examples/) — [Documentation](http://threejs.org/docs/) — [Migrating](https://github.com/mrdoob/three.js/wiki/Migration) — [Help](http://stackoverflow.com/questions/tagged/three.js)

---

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Architecture](#architecture)
- [Core Modules](#core-modules)
- [Development](#development)
- [Testing](#testing)
- [Code Quality](#code-quality)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

---

## Installation

### Via npm (Recommended)

```bash
npm install three
```

### Via CDN

```html
<script src="https://cdn.jsdelivr.net/npm/three@latest/build/three.min.js"></script>
```

### Local Build

Download the [minified library](http://threejs.org/build/three.min.js) and include it in your HTML:

```html
<script src="js/three.min.js"></script>
```

Alternatively, see [how to build the library yourself](https://github.com/mrdoob/three.js/wiki/build.py,-or-how-to-generate-a-compressed-Three.js-file).

---

## Usage

This code creates a scene, a camera, and a geometric cube, and it adds the cube to the scene. It then creates a `WebGL` renderer for the scene and camera, and it adds that viewport to the document.body element. Finally it animates the cube within the scene for the camera.

```html
<script>
  var scene, camera, renderer;
  var geometry, material, mesh;

  init();
  animate();

  function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1000;

    geometry = new THREE.BoxGeometry(200, 200, 200);
    material = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true});

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);
  }

  function animate() {
    requestAnimationFrame(animate);

    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;

    renderer.render(scene, camera);
  }
</script>
```

If everything went well you should see [this](http://jsfiddle.net/f17Lz5ux/).

---

## Architecture

three.js follows a modular architecture with clear separation of concerns:

```
src/
├── Three.js                 # Entry point, namespace, constants, polyfills
├── core/                    # Core foundation classes
│   ├── Object3D.js          # Base class for all scene objects
│   ├── BufferGeometry.js    # GPU-optimized geometry representation
│   ├── Geometry.js          # Legacy geometry representation
│   ├── BufferAttribute.js   # Typed array attribute buffers
│   ├── Raycaster.js         # Ray casting for intersection testing
│   ├── EventDispatcher.js   # Event system
│   └── ...
├── math/                    # Mathematics utilities
│   ├── Vector2.js, Vector3.js, Vector4.js
│   ├── Matrix3.js, Matrix4.js
│   ├── Quaternion.js, Euler.js
│   ├── Box2.js, Box3.js, Sphere.js
│   ├── Plane.js, Ray.js, Triangle.js
│   ├── Frustum.js
│   └── Math.js              # Math utilities
├── renderers/               # Rendering backends
│   ├── WebGLRenderer.js     # Primary WebGL renderer (~89KB)
│   ├── WebGLRenderTarget.js
│   ├── WebGLRenderTargetCube.js
│   └── webgl/               # WebGL internals
│       ├── WebGLProgram.js
│       ├── WebGLShader.js
│       ├── WebGLState.js
│       ├── WebGLCapabilities.js
│       ├── WebGLObjects.js
│       ├── WebGLGeometries.js
│       ├── WebGLShadowMap.js
│       └── plugins/         # Renderer plugins
├── cameras/                 # Camera types
│   ├── Camera.js
│   ├── PerspectiveCamera.js
│   ├── OrthographicCamera.js
│   └── CubeCamera.js
├── lights/                  # Light types
│   ├── Light.js
│   ├── AmbientLight.js
│   ├── DirectionalLight.js
│   ├── PointLight.js
│   ├── SpotLight.js
│   └── HemisphereLight.js
├── materials/               # Material types
│   ├── Material.js
│   ├── MeshBasicMaterial.js
│   ├── MeshLambertMaterial.js
│   ├── MeshPhongMaterial.js
│   ├── ShaderMaterial.js
│   ├── RawShaderMaterial.js
│   └── ...
├── objects/                 # 3D object types
│   ├── Mesh.js
│   ├── Line.js, LineSegments.js
│   ├── Points.js
│   ├── Sprite.js
│   ├── Group.js
│   ├── Skeleton.js, SkinnedMesh.js, Bone.js
│   └── LOD.js
├── scenes/                  # Scene management
│   ├── Scene.js
│   └── Fog.js, FogExp2.js
├── textures/                # Texture types
│   ├── Texture.js
│   ├── DataTexture.js
│   ├── CubeTexture.js
│   ├── VideoTexture.js
│   └── CanvasTexture.js
├── loaders/                 # Asset loading
│   ├── Loader.js
│   ├── LoadingManager.js
│   ├── TextureLoader.js
│   ├── JSONLoader.js
│   ├── ObjectLoader.js
│   ├── BufferGeometryLoader.js
│   └── ...
├── animation/               # Animation system
│   ├── AnimationClip.js
│   ├── AnimationMixer.js
│   ├── AnimationAction.js
│   ├── KeyframeTrack.js
│   └── PropertyBinding.js
├── extras/                  # Additional utilities
│   ├── ImageUtils.js        # Deprecated, use TextureLoader
│   ├── ShapeUtils.js
│   ├── Curve.js, Path.js, Shape.js
│   └── geometries/          # Additional geometry generators
├── audio/                   # Web Audio API integration
│   ├── Audio.js
│   └── AudioListener.js
└── shaders/                 # Shader chunks and library
    ├── ShaderChunk/
    ├── ShaderLib.js
    ├── UniformsLib.js
    └── UniformsUtils.js
```

### Key Design Patterns

1. **Prototype-based Inheritance**: Classes use `THREE.ClassName.prototype` for methods
2. **Event-Driven**: `EventDispatcher` provides pub/sub for object lifecycle events
3. **Immutable-by-Default**: Math objects (Vector3, Matrix4, etc.) are mutable for performance but provide `.clone()` and `.copy()` methods
4. **Scene Graph**: `Object3D` forms a tree structure with parent/child relationships
5. **Renderer Abstraction**: `WebGLRenderer` delegates to specialized internal classes (`WebGLState`, `WebGLPrograms`, `WebGLObjects`, etc.)
6. **Shader Chunks**: Reusable GLSL snippets composed into full shader programs

---

## Core Modules

### Math (`src/math/`)
High-performance math library optimized for 3D graphics:
- **Vector2/3/4**: Points, directions, colors
- **Matrix3/4**: Transformations, projections
- **Quaternion**: Rotation representation (avoids gimbal lock)
- **Euler**: Human-readable rotation angles
- **Box2/3, Sphere**: Bounding volumes for frustum culling
- **Ray**: Ray casting for picking and intersection
- **Plane, Triangle**: Geometric primitives

### Core (`src/core/`)
Foundation classes:
- **Object3D**: Base class for Mesh, Camera, Light, Group, etc.
- **BufferGeometry**: GPU-friendly geometry with typed arrays
- **BufferAttribute**: Vertex attribute data (position, normal, uv, etc.)
- **Raycaster**: Scene intersection testing
- **EventDispatcher**: Event system (added, removed, change events)

### Renderers (`src/renderers/`)
- **WebGLRenderer**: Main renderer with state management, program caching, shadow mapping
- **WebGLRenderTarget**: Off-screen rendering (post-processing, shadows)
- **WebGLRenderer internals**: Modular design for maintainability

### Loaders (`src/loaders/`)
Asynchronous asset loading with `LoadingManager` for progress tracking:
- **TextureLoader**: Images with cross-origin support
- **JSONLoader/ObjectLoader**: three.js JSON format
- **BufferGeometryLoader**: Binary geometry format
- **GLTFLoader** (examples): Modern glTF 2.0 format

---

## Development

### Prerequisites

- Node.js >= 18.0.0 (see `.nvmrc` for exact version)
- npm >= 9.0.0

### Setup

```bash
# Clone the repository
git clone https://github.com/mrdoob/three.js.git
cd three.js

# Install dependencies (generates package-lock.json)
npm install

# Verify Node version
node --version  # Should match .nvmrc
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm test` | Run unit tests in headless browsers (CI mode) |
| `npm run test:watch` | Run tests with auto-reload for development |
| `npm run lint` | Check code style with ESLint |
| `npm run lint:fix` | Auto-fix linting issues |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check formatting without changes |

### Project Structure

```
three.js/
├── .github/workflows/       # CI/CD pipelines
├── build/                   # Built distribution files
├── docs/                    # Documentation source
├── editor/                  # Three.js editor application
├── examples/                # Live examples and demos
├── src/                     # Source code (ES5, modular)
├── test/                    # Unit tests (QUnit + Karma)
├── utils/                   # Build and utility scripts
├── .eslintrc.json           # ESLint configuration
├── .prettierrc.json         # Prettier configuration
├── karma.conf.js            # Karma test runner config
├── package.json             # Package manifest
├── package-lock.json        # Locked dependencies
├── .nvmrc                   # Node version pinning
├── .env.example             # Environment config template
├── audit-ci.json            # Dependency audit config
├── CHANGELOG.md             # Version history
└── CONTRIBUTING.md          # Contribution guidelines
```

---

## Testing

### Test Framework

- **QUnit**: Unit testing framework
- **Karma**: Test runner for real browsers
- **ChromeHeadless/FirefoxHeadless**: CI browsers

### Running Tests

```bash
# CI mode (single run, headless)
npm test

# Development mode (watch, with UI)
npm run test:watch
```

### Test Structure

```
test/unit/
├── cameras/                 # Camera tests
├── core/                    # Core class tests
├── extras/                  # Extras tests
│   ├── ImageUtils.test.js   # Texture loading tests
│   └── geometries/          # Geometry generator tests
├── geometry/                # Geometry tests
├── lights/                  # Light tests
├── math/                    # Math library tests (comprehensive)
└── unittests_*.html         # Test entry points
```

### Writing Tests

Create test files in `test/unit/<module>/` following the pattern `<ClassName>.test.js`:

```javascript
QUnit.module("Vector3", {
  beforeEach: function() {
    // Setup
  }
});

QUnit.test("clone", function(assert) {
  var a = new THREE.Vector3(1, 2, 3);
  var b = a.clone();
  assert.deepEqual(b, new THREE.Vector3(1, 2, 3), "Clone creates equal vector");
  assert.notEqual(a, b, "Clone creates new instance");
});
```

---

## Code Quality

### Linting (ESLint)

Configuration in `.eslintrc.json` enforces:
- 2-space indentation, Unix line endings
- Single quotes, semicolons required
- No unused variables, no implicit globals
- No `eval`, `Function` constructor, `javascript:` URLs
- Prefer `const`/`let` over `var`
- Arrow functions, template literals

```bash
npm run lint        # Check
npm run lint:fix    # Auto-fix
```

### Formatting (Prettier)

Configuration in `.prettierrc.json`:
- 100 char line width, 2-space tabs
- Single quotes, trailing commas (ES5)
- LF line endings

```bash
npm run format        # Format all files
npm run format:check  # Verify formatting
```

### Pre-commit Hooks (Recommended)

Install Husky for automated checks:

```bash
npm install --save-dev husky lint-staged
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

Add to `package.json`:
```json
"lint-staged": {
  "*.js": ["eslint --fix", "prettier --write"]
}
```

---

## Security

### Dependency Management

- **Lockfile**: `package-lock.json` ensures reproducible installs
- **Audit**: `npm audit` runs in CI on every PR
- **Audit-CI**: Blocks merges on high/critical vulnerabilities
- **Dependabot**: Automated dependency update PRs (see `.github/dependabot.yml`)

### Vulnerability Scanning

- **Trivy**: Filesystem vulnerability scanner in CI
- **SARIF Upload**: Results integrated into GitHub Security tab

### Input Validation

The library includes `THREE.Validator` for runtime type checking:

```javascript
// Validate required parameters
THREE.Validator.validateObject(params, {
  canvas: { type: 'HTMLCanvasElement', required: true },
  antialias: { type: 'boolean', required: false, default: false }
});

// Validate numeric ranges
THREE.Validator.validateNumber(fov, 'fov', { min: 1, max: 179 });
```

### Error Handling

Structured error classes replace string-based errors:

```javascript
// Instead of: throw 'Error creating WebGL context.'
// Use:
throw new THREE.WebGLError('Failed to create WebGL context', {
  code: 'WEBGL_CONTEXT_CREATION_FAILED',
  recoverable: false
});
```

Error classes:
- `THREE.Error` - Base error class
- `THREE.ValidationError` - Input validation failures
- `THREE.WebGLError` - WebGL-specific errors
- `THREE.LoaderError` - Asset loading failures

---

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### Quick Checklist

- [ ] Run `npm run lint` and `npm run format:check`
- [ ] Run `npm test` - all tests must pass
- [ ] Add tests for new functionality
- [ ] Update documentation (README, JSDoc comments)
- [ ] Update CHANGELOG.md under "Unreleased"
- [ ] Follow semantic versioning for version bumps

### Branch Strategy

- `main` / `master`: Stable releases
- `dev`: Active development
- Feature branches: `feature/<description>`
- Bugfix branches: `fix/<description>`

---

## Change Log

See [CHANGELOG.md](CHANGELOG.md) for version history.

---

## License

MIT License - see [LICENSE](LICENSE) for details.

Copyright (c) 2010-2024 three.js authors