import axios from "axios";
import {observable, computed, action} from "mobx";
import {sprintf} from "sprintf-js";

import {RingBuffer} from "./ringbuf";
import {calcSReading} from "./util";

export const createState = () => observable({
    apiUrl: "http://127.0.0.1:8025",
    events: null,
    sigPower: -Infinity,
    curFreq: null,
    ctlFreq: null,
    talkgroup: null,
    error: 0,
    curUnit: 0,
    units: new RingBuffer(8),

    updateTalkGroup: action(function(tg) {
        if (tg.Other) {
            // TODO: verify number
            this.talkgroup = sprintf("0x%03X", tg.Other);
        } else {
            this.talkgroup = tg;
        }
    }),

    updateSigPower: action(function(p) {
        // TODO: verify number
        this.sigPower = p;
    }),

    updateCurFreq: action(function(f) {
        // TODO: verify number
        this.curFreq = f;
    }),

    updateCtlFreq: action(function(f) {
        // TODO: verify number
        this.ctlFreq = f;
    }),

    updateCurUnit: action(function(u) {
        if (u === 0) {
            return;
        }

        this.curUnit = sprintf("0x%06X", u);

        if (this.units.top() !== this.curUnit) {
            this.units.push(this.curUnit);
        }
    }),

    fetchCtlFreq: action(function() {
        return axios.get(`${this.apiUrl}/ctlfreq`)
                    .then(({data}) => this.updateCtlFreq(data.ctlfreq));
    }),

    startEventStream: action(function() {
        this.events = new EventSource(`${this.apiUrl}/subscribe`);
        return this.events;
    }),

    sMeterReading: computed(function() {
        return calcSReading(this.sigPower);
    }),
});
