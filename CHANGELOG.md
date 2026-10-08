# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- ESLint configuration for code quality enforcement
- Prettier configuration for consistent code formatting
- Karma test runner configuration with QUnit
- GitHub Actions CI workflow for automated testing, linting, and security scanning
- Dependency audit configuration (audit-ci)
- Node.js version pinning via .nvmrc and engines field
- Environment configuration example (.env.example)
- Structured error handling classes (THREE.Error, THREE.ValidationError, etc.)
- Input validation utilities (THREE.Validator)

### Changed
- Updated package.json with proper test, lint, and format scripts
- Updated lodash from ^3.10.0 to ^4.17.21 (security update)
- Replaced deprecated jscs with ESLint

### Security
- Added npm audit in CI pipeline
- Added Trivy vulnerability scanning in CI
- Added dependabot configuration for automated dependency updates

## [0.73.0] - 2015-11-19

### Added
- Initial release of three.js r73
- WebGLRenderer with full WebGL support
- CanvasRenderer fallback
- SVGRenderer support
- CSS3DRenderer support
- Comprehensive math library (Vector2, Vector3, Vector4, Matrix3, Matrix4, Quaternion, Euler)
- Geometry system (BufferGeometry, Geometry, various primitives)
- Material system (Basic, Lambert, Phong, Shader, etc.)
- Lighting system (Ambient, Directional, Point, Spot, Hemisphere)
- Camera system (Perspective, Orthographic, Cube)
- Animation system (Keyframe tracks, mixer, actions)
- Loader system (JSON, OBJ, MTL, Collada, etc.)
- Post-processing effects
- Shadow mapping support
- Raycasting and intersection testing

---

## Release Notes Format

### Types of Changes
- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** for vulnerability fixes

### Version Numbering
- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality
- **PATCH** version for backwards-compatible bug fixes

### Release Process
1. Update version in package.json
2. Update this CHANGELOG.md
3. Create git tag: `git tag -a v<version> -m "Release v<version>"`
4. Push tag: `git push origin v<version>`
5. GitHub Actions will build and publish release artifacts