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

    let data = Array.from(Array(100).keys()).map(x => ({x, y: NaN}));

    var Chart = require("chart.js");
    var myChart = new Chart(document.getElementById("myChart"), {
        type: "line",
        data: {
            datasets: [{
                data: data,
                // lineTension: 0,
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
                        min: 0.0,
                        max: 1.0,
                    },
                }],
            },
            legend: {display: false},
            // responsive: false,
        }
    });

    setInterval(function() {
        for (let i = data.length - 1; i > 0; i -= 1) {
            data[i].y = data[i - 1].y;
        }

        data[0].y = Math.random();

        myChart.update();
    }, 500);
}

const createEventHandlers = (state) => ({
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
