1) Each room can be custom made
2) Technically we can set X, Y coordinates for each of the enemies
3) Additionally we can choose a few enemies

Something such as

0001112110
0000111100
0000011010
0000001010

Etc would result in...
  -	enemy being spawned at location 2
   -	rocks to be spawned at location 1
   - Or a map can be generated

Its also visually easy to understand rather than something like an XML document

A json document can also be created such as

```
{
  entities: [
    {
      entityType: "some entity type",
      location: {x:6, y:0}
    }
  ]
}
```

Below is much much uglier

```
{
  destructibles: [
    {
      destructableType: "some destructable type",
      location: [
        {x:3, y:0},
        {x:4, y:0},
        {x:5, y:0},
        {x:7, y:0},
        {x:8, y:0},
        {x:4, y:1},
        {x:5, y:1},
        {x:6, y:1},
        {x:7, y:1},
      ]
    }
  ]
}
```