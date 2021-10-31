
# Pre requisites
- Node

# To Run
1. clone project
2. run npm i
3. buid project with npm run build
4. serve project with npm run start

# Notes
- All assets need to go into the public folder to be accesable
- The initial build was done using [THIS](https://doc.babylonjs.com/guidedLearning/createAGame/gettingSetUp) tutorial

# Problems
- When loading a mesh from an obj file (its the only type ive tested) I cannot aloter the state of the mesh unless I am inside the on success function in the mesh task
