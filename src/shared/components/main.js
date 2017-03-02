import h from "inferno-hyperscript";
import {observer} from "inferno-mobx";
import {sprintf} from "sprintf-js";

import {calcSReading} from "../util";
import {createChart} from "./chart";

const App = observer(({s}) => h("main", [
    h("h1", "Talkgroup"),
    h("#talkgroup", s.talkgroup),
    h("h1", "Signal strength"),
    h("#sigPower", {title: `${s.sigPower} dBm`}, calcSReading(s.sigPower)),
    createChart(el => s.initSigPlot(el), {width: 400, height: 200}),
    h("h1", "Current frequency"),
    h("#curFreq", dispFreq(s.curFreq)),
    h("h1", "Control channel"),
    h("#ctlFreq", dispFreq(s.control.freq)),
    h("dl", [
        h("dt", "WACN"),
        h("dd", dispWacn(s.control.wacn)),
        h("dt", "RFSS"),
        h("dd", dispRfss(s.control.rfss)),
        h("dt", "SYSTEM"),
        h("dd", dispSys(s.control.system)),
        h("dt", "SITE"),
        h("dd", dispSite(s.control.site)),
    ]),
    h("h1", "Alternate Control Channels"),
    h("ul", s.altControl.values().map(alt => h("li", {
        onClick: _ => s.commitCtlFreq(alt.freq),
    }, dispFreq(alt.freq)))),
    h("h1", "Adjacent Sites"),
    h("ul", s.adjacentSites.values().map(site => h("li", {
        onClick: _ => s.commitCtlFreq(site.freq),
    }, dispFreq(site.freq)))),
    h("h1", "Current unit"),
    h("#curUnit", dispUnit(s.units.top())),
    h("h1", "Recent units"),
    h("ul", s.units.map(u => h("li", dispUnit(u)))),
]));

export const Main = s => h(App, {s});

const tmpNul = fn => x => x && fn(x) || "--";

const dispFreq = tmpNul(freq => `${sprintf("%.6f", freq / 1.0e6)} MHz`);
const dispUnit = tmpNul(unit => sprintf("0x%06X", unit));
const dispWacn = tmpNul(wacn => sprintf("0x%06X", wacn));
const dispRfss = tmpNul(rfss => sprintf("0x%02X", rfss));
const dispSys = tmpNul(sys => sprintf("0x%04X", sys));
const dispSite = tmpNul(site => sprintf("0x%02X", site));
