import h from "inferno-hyperscript";
import {observer} from "inferno-mobx";

const App = observer(({s}) => h("div",
    h("main", [
        h("h1", "Talkgroup"),
        h("#talkgroup", s.talkgroup),
        h("h1", "Signal strength"),
        h("#sigPower", {title: `${s.sigPower} dBm`}, s.sMeterReading),
        h("h1", "Current frequency"),
        h("#curFreq", s.curFreq),
        h("h1", "Control channel"),
        h("#ctlFreq", s.ctlFreq),
        h("h1", "Current unit"),
        h("#curUnit", s.curUnit),
        h("h1", "Recent units"),
        h("ul", s.units.map(u => h("li", u))),
    ])
));

export const Main = (s) => h(App, {s});
