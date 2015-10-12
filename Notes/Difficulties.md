1. Choosing an appropriate Box2d implementation
   - currently I'm using box2d by kripken, however since its a emscripten port it
  has wonkey API and I commonly have to go through the source to figure out what
  is happening
  - I first attempted to use node-box2d however its severely out of Date
  - The Flash -> JS implementations are not ideal in my opinion as the flash API
  may be different from the c++ and then the javascript api may be different
  from the Flash. On top of that we are also looking at different
  innefficiencies though emscripten itself seems to be pretty innefficient

2. Perfecting the dungeon generation
  - I want random, but true random isn't always so clean
  - I don't want a long path and short path to the same place, the longer it is
  - I don't want to have a series of 4
    - Though I can find them and combine them if I please
  - I don't want to have long hallways, I'd prefer everything to be desirably
  centerd

3. Implementing Collisions without calling every single function
  - As it is, when a collision happens, every emitter gets called
  - This is bad as when collision logic may become more common

4. Speed, memory leaks
  - Not sure whats slowing me down but I'll have to go through it to find out
  what
  - Also I need to start mem testing to ensure when things are created and
  destroyed all things are destroyed.

