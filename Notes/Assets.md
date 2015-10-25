- Weapon
  - Can produce a projectile
  - Can produce a beam?
    - This is more difficult than it sounds when it comes to
    box2d.
    - Requires a starter projectile, a memory of the path and a hit detection on the path
  - Can be attached by Joints
- Armor
  - Watches for 'on impact' mostly
- Aura
  - Is a sensor around the player
  - When the sensor gets something that matches its query, will apply an effect
  to the player, the matched or something to do with the ground
- Buff
  - Enables another effect on a trigger
  - Does something every timestep


- Projectiles
  - Is Instant?
    - Important for guns
  - Has Trail?
    - Important for Shockwaves
  - Has Maximum range?
    - Important for Shockwaves/Grenades
  - Has Maximum time?
    - Important for grenades
  - Death Trigger
    - Important for Grenades - It does not watch for Impacts
  - Impact Death Threshhold
    - Important for almost all projectiles

Sample projectiles
  - Kameameha
    - Player becomes stationary
    - Kameameha leaves a trail
      - If trail has impact
      - If impact is its own body
        - Destroy old trail, and make new trail
    - Player can change the Kameameha's direction
      - Done by Pushing a new projectile that follows the originals trail
      - Once the new projectile reaches the original's trail
        - it changes direction
        - it gets bigger
        - it gets faster
  - Grenade
    - Player throws a grenade
      - On impact
        - if it was a large impact
          - If the normal velocity was large enough
            - will be destroyed
        - else it will result in normal physics
      - After 10 seconds, it becomes destroyed
      - On destroy
        - Create explosion with a radius
          - Explosions produce heat (damaging effect)
          - Explosions produce Push back (liquid fun?)

Heres a question...
  - Explosions and trails could be liquid based off pressure
    - For trails each time step, we create water around the target
    - The