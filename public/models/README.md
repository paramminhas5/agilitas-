# 3D models

Drop `.glb` files here named after the shoe id, then flip that id to `true` in
`lib/assets.ts` → `HAS_MODEL`.

```
/public/models/alleys.glb
/public/models/traktor.glb
...
```

**Export guidance**

| Setting | Value |
|---|---|
| Format | glTF binary (`.glb`) |
| Up axis | Y-up |
| Scale | roughly 1 unit toe-to-heel |
| Origin | centred on the shoe |
| Materials | PBR; the accent colour is driven from code, so keep base colour neutral |
| Budget | under 120k triangles, textures ≤ 2k |

Until a model exists, the scene renders a procedural extruded sole form in its
place. Nothing breaks if this folder stays empty.

Shoe ids: `alleys`, `traktor`, `doorway`, `nightshift`, `beta`, `session`,
`reverse`, `train`, `recover`, `everyday-mid`, `1973`
