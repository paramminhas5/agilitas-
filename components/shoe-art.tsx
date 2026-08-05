import type { Product } from "@/data/products";

type ShoeArtProps = {
  product: Product;
  mode?: number;
  hero?: boolean;
};

const upperPaths: Record<Product["art"], string> = {
  court:
    "M104 333 C130 286 177 264 244 250 L270 134 C274 111 297 91 325 96 L403 119 C433 128 449 158 456 204 L473 237 C538 247 610 270 690 308 C713 319 724 339 715 357 C706 375 678 380 641 380 L153 380 C113 380 91 360 104 333 Z",
  weather:
    "M99 334 C118 293 160 271 231 257 L293 197 C321 170 373 163 413 184 L469 232 C539 240 614 270 692 310 C720 324 727 347 710 365 C697 379 673 382 634 382 L149 382 C109 382 87 360 99 334 Z",
  threshold:
    "M97 336 C114 300 159 273 227 260 L286 205 C316 177 365 168 408 186 L468 230 C533 240 611 268 694 307 C724 321 731 344 716 363 C702 380 674 384 635 384 L147 384 C107 384 85 362 97 336 Z",
  cricket:
    "M95 337 C115 298 164 275 229 263 L278 218 C309 190 353 176 399 192 L467 232 C539 242 614 269 696 309 C727 325 733 348 714 366 C700 380 675 384 634 384 L145 384 C105 384 83 362 95 337 Z",
  train:
    "M92 333 C116 292 165 270 232 257 L281 203 C313 171 365 164 411 182 L471 228 C544 238 619 265 700 304 C731 319 739 343 720 362 C704 380 678 385 636 385 L141 385 C102 385 79 359 92 333 Z",
  after:
    "M100 334 C125 289 174 266 237 255 L286 198 C318 164 366 158 410 180 L466 228 C536 238 612 267 694 309 C723 324 731 348 714 365 C699 381 674 384 634 384 L148 384 C108 384 87 360 100 334 Z",
};

const collars: Record<Product["art"], string> = {
  court: "M270 137 C276 107 298 86 326 92 L395 111 C420 118 436 138 440 168 L446 218 L378 213 L347 164 L298 158 L285 239 L247 247 Z",
  weather: "M286 204 C302 164 330 139 370 142 C409 145 436 173 460 226 L416 225 L390 186 L338 184 L311 219 Z",
  threshold: "M285 210 C306 177 337 158 372 164 C410 170 433 189 462 232 L412 228 L381 194 L332 195 L307 225 Z",
  cricket: "M277 221 C299 190 327 177 359 181 C400 186 430 201 461 234 L410 231 L381 207 L329 207 L303 230 Z",
  train: "M281 205 C302 172 335 151 371 157 C414 163 441 188 468 229 L419 228 L387 190 L333 188 L307 221 Z",
  after: "M286 201 C305 164 338 146 373 154 C411 162 438 184 463 229 L417 225 L386 187 L333 183 L309 218 Z",
};

export function ShoeArt({ product, mode = 0, hero = false }: ShoeArtProps) {
  const [base, mid, highlight] = product.palette;
  const modeShift = mode * 13;
  const filterId = `grain-${product.id}`;
  const shadowId = `shadow-${product.id}`;
  const clipId = `clip-${product.id}`;
  const patternId = `pattern-${product.id}`;

  return (
    <div
      className={`shoe-art ${hero ? "shoe-art--hero" : ""}`}
      style={{ "--shoe-accent": product.accent } as React.CSSProperties}
      aria-hidden="true"
    >
      <svg viewBox="0 0 820 520" role="img">
        <defs>
          <filter id={filterId} x="-15%" y="-15%" width="130%" height="130%">
            <feTurbulence type="fractalNoise" baseFrequency=".72" numOctaves="3" seed={mode + 7} result="noise" />
            <feColorMatrix in="noise" type="saturate" values="0" result="greyNoise" />
            <feComponentTransfer in="greyNoise" result="fadedNoise">
              <feFuncA type="table" tableValues="0 .14" />
            </feComponentTransfer>
            <feBlend in="SourceGraphic" in2="fadedNoise" mode="multiply" />
          </filter>
          <filter id={shadowId} x="-30%" y="-80%" width="160%" height="260%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
          <clipPath id={clipId}>
            <path d={upperPaths[product.art]} />
          </clipPath>
          <pattern id={patternId} width="18" height="18" patternUnits="userSpaceOnUse" patternTransform={`rotate(${28 + modeShift})`}>
            <line x1="0" y1="0" x2="0" y2="18" stroke={highlight} strokeOpacity=".27" strokeWidth="3" />
          </pattern>
          <linearGradient id={`upper-${product.id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={highlight} />
            <stop offset=".42" stopColor={base} />
            <stop offset="1" stopColor={mid} />
          </linearGradient>
          <linearGradient id={`sole-${product.id}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={mid} />
            <stop offset=".52" stopColor={product.art === "after" ? "#eee3cb" : highlight} />
            <stop offset="1" stopColor={mid} />
          </linearGradient>
        </defs>

        <ellipse cx="413" cy="421" rx="302" ry="23" fill="#000" opacity=".28" filter={`url(#${shadowId})`} />

        <g className="shoe-art__object" filter={`url(#${filterId})`}>
          <path d={collars[product.art]} fill={base} stroke={highlight} strokeOpacity=".4" strokeWidth="3" />
          <path d={upperPaths[product.art]} fill={`url(#upper-${product.id})`} stroke="#fff" strokeOpacity=".18" strokeWidth="2" />
          <path
            d="M104 330 C179 310 236 285 291 246 C337 214 394 209 459 237 C521 265 581 288 694 326 L691 349 C601 336 537 321 474 297 C402 269 358 268 305 297 C240 333 176 352 102 355 Z"
            fill={`url(#${patternId})`}
            opacity=".66"
            clipPath={`url(#${clipId})`}
          />
          <path d="M112 355 C194 367 296 363 393 357 C498 350 604 355 710 340 L719 369 C712 393 678 405 629 406 L158 405 C119 405 91 388 94 367 Z" fill={`url(#sole-${product.id})`} stroke="#070707" strokeOpacity=".33" strokeWidth="3" />
          <path d="M106 388 C218 398 329 393 430 390 C534 386 623 392 704 374" fill="none" stroke={product.accent} strokeWidth="7" strokeLinecap="round" opacity={mode === 2 ? 1 : .62} />

          {product.art === "train" || product.art === "cricket" ? (
            <g fill={mid}>
              {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                <path key={n} d={`M${134 + n * 76} 402 l30 0 l-10 20 l-31 -2 Z`} />
              ))}
            </g>
          ) : null}

          {product.art === "after" ? (
            <g>
              <path d="M190 305 C278 278 347 244 442 246" fill="none" stroke="#a53525" strokeWidth="18" strokeLinecap="round" opacity=".88" />
              <path d="M250 266 L282 318 M291 246 L326 302 M337 229 L370 283 M382 224 L413 270" stroke="#f24c2e" strokeWidth="7" strokeLinecap="round" />
            </g>
          ) : (
            <g stroke={product.art === "court" ? "#f4d0aa" : "#161719"} strokeWidth="8" strokeLinecap="round">
              <path d="M272 236 L327 287" />
              <path d="M300 219 L355 277" />
              <path d="M331 207 L384 270" />
              <path d="M363 205 L414 267" />
            </g>
          )}

          <path d="M160 326 C191 287 239 265 291 254 L341 292 C292 316 246 342 184 354 Z" fill={base} opacity=".72" stroke={highlight} strokeOpacity=".5" strokeWidth="2" />
          <path d="M433 250 C493 244 562 272 646 313 L612 344 C546 318 494 299 438 291 Z" fill={mid} opacity=".88" />
          <path d="M490 266 L558 301 L528 328 L463 292 Z" fill="none" stroke={product.accent} strokeWidth="8" opacity=".9" />
          <path d="M504 281 L537 298 L521 312 L488 295 Z" fill={product.accent} opacity=".9" />

          {product.art === "weather" ? (
            <path d="M261 259 C303 236 355 221 425 233 L450 290 C386 274 330 282 280 316 Z" fill="#0c0d0e" opacity={mode === 0 ? .42 : .92} stroke={product.accent} strokeDasharray="8 8" strokeWidth="3" />
          ) : null}
          {product.art === "threshold" ? (
            <g>
              <path d="M582 273 L630 244 L667 317" fill="none" stroke={product.accent} strokeWidth="5" opacity={mode === 2 ? 1 : .35} />
              <circle cx="629" cy="246" r="9" fill={product.accent} />
            </g>
          ) : null}
          {product.art === "court" ? (
            <path d="M250 354 C300 336 354 317 421 319" fill="none" stroke={product.accent} strokeWidth="8" strokeDasharray="28 9" opacity=".8" />
          ) : null}

          <text x="486" y="286" fill="#fff" fillOpacity=".76" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="800" letterSpacing="3">
            {product.brand}
          </text>
          <text x="610" y="370" fill="#060606" fillOpacity=".62" fontFamily="monospace" fontSize="10" fontWeight="700" letterSpacing="2">
            {product.order} / {product.name}
          </text>
        </g>

        <g className="shoe-art__callouts" fill="none" stroke="currentColor" strokeOpacity=".42" strokeWidth="1">
          <path d="M148 273 H64" />
          <path d="M598 248 H760" />
          <path d="M401 406 V468" />
        </g>
        <g className="shoe-art__labels" fill="currentColor" fillOpacity=".6" fontFamily="monospace" fontSize="9" letterSpacing="1.6">
          <text x="18" y="269">UPPER / {product.order}</text>
          <text x="666" y="242">SYSTEM / 03</text>
          <text x="350" y="490">VISIBLE WEAR LINE</text>
        </g>
      </svg>
      <div className="shoe-art__index">{product.order}</div>
      <div className="shoe-art__surface">{product.surface}</div>
    </div>
  );
}