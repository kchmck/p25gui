import "babel-polyfill";

import Inferno from "inferno";

import {Main} from "../shared/components/main";
import {createState} from "../shared/state";

function initClient() {
    let state = createState();

    Inferno.render(Main(state), document.getElementById("app"));

    state.fetchCtlFreq();

    let events = state.startEventSource();
    let handlers = createEventHandlers(state);

    events.onerror = e => {
        e.preventDefault();
        console.log("error", e);
        state.setError(e);
    };

    events.onmessage = e => {
        let data = JSON.parse(e.data);

        if (!data.event) {
            throw new Error("invalid event received");
        }

        let handler = handlers[data.event];

        if (!handler) {
            throw new Error(`no handler for event ${data.event}`);
        }

        handler(data.payload);
    };
}

const createEventHandlers = state => ({
    talkGroup(tg) {
        state.updateTalkGroup(tg);
    },
    sigPower(pow) {
        state.updateSigPower(pow - 106.0);
    },
    curFreq(freq) {
        state.updateCurFreq(freq);
    },
    ctlFreq(freq) {
        state.updateCtlFreq(freq);
    },
    rfssStatus(s) {
        state.updateSite(s);
    },
    networkStatus(s) {
        state.updateSite(s);
    },
    altControl(a) {
        state.addAltControl(a);
    },
    adjacentSite(s) {
        state.addAdjacentSite(s);
    },
    srcUnit(u) {
        state.updateCurUnit(u);
    },
});

if (process.env.NODE_ENV !== "test") {
    initClient();
}
