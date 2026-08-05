"use client";

import { Split } from "@/components/ui/split";
import { goTo } from "@/lib/scroll";

export function Foot({ onPdf, busy }: { onPdf: () => void; busy: boolean }) {
  return (
    <footer className="foot vent" id="foot">
      <div className="foot__grid">
        <div>
          <div className="foot__mark chrome">AGILITAS</div>
          <p className="foot__claim">
            <Split
              mode="word"
              stagger={18}
              text="Made here for forty years. Designed here from now. The first line of shoes built for the ground they will actually be worn on."
            />
          </p>
        </div>

        <div>
          <div className="foot__col-k">Brands</div>
          <button className="foot__lnk" data-cur="Go" onClick={() => goTo("brands")}>Lotto</button>
          <button className="foot__lnk" data-cur="Go" onClick={() => goTo("brands")}>one8</button>
        </div>

        <div>
          <div className="foot__col-k">Explore</div>
          <button className="foot__lnk" data-cur="Go" onClick={() => goTo("lab")}>Technology</button>
          <button className="foot__lnk" data-cur="Go" onClick={() => goTo("journey")}>The eleven</button>
          <button className="foot__lnk" data-cur="Go" onClick={() => goTo("scenes")}>Campaigns</button>
        </div>

        <div>
          <div className="foot__col-k">Document</div>
          <button className="foot__lnk" data-cur="Save" onClick={onPdf} disabled={busy}>
            {busy ? "Generating…" : "Download PDF"}
          </button>
        </div>
      </div>

      <div className="foot__base">
        <span>© 2025 Agilitas Sports</span>
        <span>Prepared by Param Minhas</span>
      </div>
    </footer>
  );
}
