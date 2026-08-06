# Brand marks

**Drop a file in. That's the whole process.** No code to edit.

```
/public/brand/lotto.svg
/public/brand/one8.svg
```

Until they exist, each brand is set as a wordmark placeholder at the right
size and position, so the layout is already shaped for the real artwork.

| File | Used |
|---|---|
| `lotto.svg` | everywhere Lotto appears |
| `one8.svg` | everywhere one8 appears |
| `one8-light.svg` | *optional* — used instead of `one8.svg` on dark surfaces |
| `lotto-light.svg` | *optional* — used instead of `lotto.svg` on dark surfaces |

Lotto sections are **light**, so `lotto.svg` should be the dark-ink version of
the mark. one8 sections are **dark**, so if your primary `one8.svg` is dark
ink, add `one8-light.svg` as well and it will be picked up automatically.

| Setting | Value |
|---|---|
| Format | SVG preferred; PNG with alpha accepted |
| Sizing | height is set in code, so any viewBox works |
| Padding | trim tight — no built-in whitespace |
| Colour | flat, single colour |
