import axios from "axios";
import {observable, computed, action} from "mobx";
import {sprintf} from "sprintf-js";

import {RingBuffer} from "./ringbuf";

export const createState = () => observable({
    apiUrl: "http://127.0.0.1:8025",
    eventSource: null,
    sigPower: -Infinity,
    curFreq: null,
    control: createSite(),
    talkgroup: null,
    error: 0,
    units: new RingBuffer(8),
    altControl: observable.map(),
    adjacentSites: observable.map(),

    setError: action(function(e) {
        self.error = e;
    }),

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

    updateCtlFreq: action(function(freq) {
        if (freq !== this.control.freq) {
            this.altControl.clear();
            this.adjacentSites.clear();
            this.control = createSite({freq});
        }

        // TODO: verify number
        this.control.freq = freq;
    }),

    updateSite: action(function(params) {
        for (let field of Object.keys(this.control)) {
            if (params[field] !== undefined) {
                // TODO: verify numbers
                this.control[field] = params[field];
            }
        }
    }),

    updateCurUnit: action(function(u) {
        if (u === 0) {
            return;
        }

        if (this.units.top() !== u) {
            this.units.push(u);
        }
    }),

    addAltControl: action(function({rfss, site, freq}) {
        this.altControl.set(freq, {rfss, site, freq});
    }),

    addAdjacentSite: action(function({rfss, system, site, freq}) {
        let info = createSite(Object.assign({rfss, system, site, freq}, {
            wacn: this.control.wacn,
        }));

        this.adjacentSites.set(freq, info);
    }),

    fetchCtlFreq: action(function() {
        return axios.get(`${this.apiUrl}/ctlfreq`)
                    .then(({data}) => this.updateCtlFreq(data.ctlfreq))
                    .catch(e => this.setError(e));
    }),

    commitCtlFreq: action(function(ctlfreq) {
        return axios.put(`${this.apiUrl}/ctlfreq`, {ctlfreq})
            .catch(e => this.setError(e));
    }),

    startEventSource: action(function() {
        this.eventSource = new EventSource(`${this.apiUrl}/subscribe`);
        return this.eventSource;
    }),
});

const createSite = (params = {}) => Object.assign({}, {
    freq: null,
    wacn: null,
    area: null,
    rfss: null,
    system: null,
    site: null,
}, params);
