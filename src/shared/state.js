import axios from "axios";
import {observable, computed, action, autorun} from "mobx";
import {sprintf} from "sprintf-js";

import {RingBuffer} from "./ringbuf";

export const createState = () => observable({
    apiUrl: "http://127.0.0.1:8025",
    eventSource: null,
    sigPower: -Infinity,
    sigPlot: null,
    curFreq: null,
    control: createSite(),
    talkgroups: new RingBuffer(10),
    error: 0,
    docTitle: "P25 - Idle",
    units: new RingBuffer(8),
    altControl: observable.map(),
    adjacentSites: observable.map(),

    setError: action(function(e) {
        this.error = e;
    }),

    updateTalkGroup: action(function(tg) {
        // TODO: verify number
        tg = tg.Other ? sprintf("%03X", tg.Other) : tg;

        if (tg == this.talkgroups.top()) {
            return;
        }

        this.talkgroups.push(tg);
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
            this.control = createSite();
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
        if (u === 0 || this.units.top() === u) {
            return;
        }

        this.units.push(u);
    }),

    addAltControl: action(function({rfss, site, freq}) {
        this.altControl.set(freq, {rfss, site, freq});
    }),

    addAdjacentSite: action(function({rfss, system, site, freq}) {
        let info = createSite({rfss, system, site, freq,
            wacn: this.control.wacn,
        });

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

    initSigPlot: action(function(el) {
        let data = Array.from(Array(100).keys()).map(x => ({x, y: NaN}));

        autorun(() => {
            for (let i = data.length - 1; i > 0; i -= 1) {
                data[i].y = data[i - 1].y;
            }

            data[0].y = this.sigPower;

            this.sigPlot.update();
        });

        let Chart = require("chart.js");

        this.sigPlot = new Chart(el, {
            type: "line",
            data: {
                datasets: [{
                    data: data,
                    fill: false,
                    borderColor: "#FF0000",
                    spanGaps: true,
                    pointRadius: 0,
                }]
            },
            options: {
                animation: {duration: 0},
                scales: {
                    xAxes: [{
                        type: "linear",
                        position: "bottom",
                        display: false,
                        ticks: {
                            min: 0,
                            max: data.length,
                        },
                    }],
                    yAxes: [{
                        display: false,
                        ticks: {
                            min: -140,
                            max: -70,
                        },
                    }],
                },
                legend: {display: false},
                responsive: false,
            },
        });

        return this.sigPlot;
    }),
});

const createSite = (params = {}) => Object.assign({
    freq: null,
    wacn: null,
    area: null,
    rfss: null,
    system: null,
    site: null,
}, params);
