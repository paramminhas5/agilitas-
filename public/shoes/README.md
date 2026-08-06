# Product art

**Drop a file in. That's the whole process.** No code to edit.

```
/public/shoes/alleys.png
```

The scanner runs before every `dev` and `build`, finds the file, and the shoe
switches from the 3D stand-in to your photograph automatically.

**Priority per shoe:** a `.glb` in `/public/models` wins → then an image here →
then a labelled placeholder frame. So a shoe with both a model and a photo
shows the model, and the photo waits in reserve.

**Prefer `.webp`.** The three shots currently here started as PNGs totalling
4.7 MB; as WebP they are 196 KB with no visible difference. On an Indian
mobile connection that gap is the whole first impression.

| Setting | Value |
|---|---|
| Filename | `<shoe-id>.png` (also accepts `.jpg`, `.webp`, `.avif`) |
| Size | square, 1200×1200 or larger |
| Background | transparent |
| Framing | shoe centred, roughly 8% padding |
| Angle | keep one consistent angle across all eleven |

The eleven files currently here are **1×1 pixel placeholders**. The scanner
detects that and treats them as absent, so they never masquerade as real
artwork — overwrite one and it starts working immediately.

When art exists for a shoe, the 3D object steps aside for that section so the
photograph is the hero rather than competing with it.

**Shoe ids**

`alleys` · `traktor` · `doorway` · `nightshift` · `beta` · `session` ·
`reverse` · `train` · `recover` · `everyday-mid` · `1973`
