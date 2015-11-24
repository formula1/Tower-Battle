- User Choice (Constants essentially)
  - movement force - type doesn't matter

- Constants
  - unreceptiveness

- Counters
  - Activity
  - Adrenaline
  - Energy

- Activity Aura
  - internal counters
    - Activity
  - on contact start
    - if contact is enemy - Activity++
  - on contacted team change
    - if contact was enemy
      - if contact not enemy
        - Activity--
    - if contact was not enemy
      - if contact is enemy
        - Activity++
  - on contact end
    - if contact is enemy - Activity--
  - before time
    - adrenaline += Activity

- Adrenaline
  - requires - unreceptiveness
  - on use modifier - movement force
     - movement *=	(unreceptiveness + Math.max(adrenaline, 0)) /
                  (unreceptiveness - Math.min(adrenaline, 0))

- Energy
  - on use before modify - movement force
    - energy += 1 - movement force
  - after time
    - adrenaline += Math.min(energy/unreceptiveness, 0);


