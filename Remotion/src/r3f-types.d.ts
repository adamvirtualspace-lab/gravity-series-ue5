// @react-three/fiber v8 augments the GLOBAL JSX namespace with the three.js
// intrinsic elements (<mesh>, <group>, <meshToonMaterial>, …). That augmentation
// only loads if the package is in the type graph, so this side-effect import
// makes it project-wide instead of per-file.
import '@react-three/fiber';
