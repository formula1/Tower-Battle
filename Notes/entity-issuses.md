Entity Problem

1) If a world gets unloaded, all entities need to be destroyed and saved
2) If an entity gets destroyed while the world still exists, there is two options
  a) The entity does not persist
    - It gets removed from entities that may be saved
  b) the entity does respawn
    - however this is logic based
    - If one should always exist, then that needs to be handled on the floor/room logic