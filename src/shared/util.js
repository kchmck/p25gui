export function calcSReading(dbm) {
    const SCALE_START = -93.0;
    const SCALE_END = -147.0;
    const SCALE_STEP = 6.0;

    if (dbm < SCALE_END) {
        return "S0";
    }

    if (dbm > SCALE_START) {
        return "S9+";
    }

    let level = Math.ceil((dbm - SCALE_END) / SCALE_STEP);

    return `S${level}`;
}

if (process.env.NODE_ENV === "test") {
    let {assert} = require("chai");

    test("calcSReading", function() {
        assert.equal(calcSReading(-153.0), "S0");
        assert.equal(calcSReading(-148.0), "S0");
        assert.equal(calcSReading(-147.0), "S0");
        assert.equal(calcSReading(-144.0), "S1");
        assert.equal(calcSReading(-141.0), "S1");
        assert.equal(calcSReading(-135.0), "S2");
        assert.equal(calcSReading(-129.0), "S3");
        assert.equal(calcSReading(-123.0), "S4");
        assert.equal(calcSReading(-117.0), "S5");
        assert.equal(calcSReading(-111.0), "S6");
        assert.equal(calcSReading(-105.0), "S7");
        assert.equal(calcSReading(-99.0), "S8");
        assert.equal(calcSReading(-95.0), "S9");
        assert.equal(calcSReading(-93.0), "S9");
        assert.equal(calcSReading(-92.0), "S9+");
        assert.equal(calcSReading(-91.0), "S9+");
        assert.equal(calcSReading(-83.0), "S9+");
        assert.equal(calcSReading(-73.0), "S9+");
    });
}
