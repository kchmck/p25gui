import {observable, action} from "mobx";

export function RingBuffer(size) {
    Object.assign(this, {
        size: size,
        state: observable({
            idx: size - 1,
            items: Array(size),
            length: 0,
        }),
    });
}

RingBuffer.prototype = {
    push: action(function(item) {
        this.state.items[this.state.idx] = item;

        this.state.idx += this.size - 1;
        this.state.idx %= this.size;

        if (this.state.length < this.size) {
            this.state.length += 1;
        }
    }),

    top: function() {
        return this.state.items[(this.state.idx + 1) % this.size];
    },

    map: function(fn, context) {
        let mapped = [];

        if (this.state.length === 0) {
            return mapped;
        }

        let pivot = (this.state.idx + 1) % this.size;

        for (let i = pivot; i < this.size; i += 1) {
            mapped.push(fn(this.state.items[i], context));
        }

        if (this.state.length < this.size) {
            return mapped;
        }

        for (let i = 0; i < pivot; i += 1) {
            mapped.push(fn(this.state.items[i], context));
        }

        return mapped;
    },
};

if (process.env.NODE_ENV === "test") {
    let {assert} = require("chai");

    test("RingBuffer", function() {
        let r = new RingBuffer(4);
        assert.equal(r.state.length, 0);
        assert.deepEqual(r.map(x => x), []);

        r.push(0);
        assert.equal(r.state.length, 1);
        assert.deepEqual(r.map(x => x), [0]);

        r.push(1);
        assert.equal(r.state.length, 2);
        assert.deepEqual(r.map(x => x), [1, 0]);

        r.push(2);
        assert.equal(r.state.length, 3);
        assert.deepEqual(r.map(x => x), [2, 1, 0]);

        r.push(3);
        assert.equal(r.state.length, 4);
        assert.deepEqual(r.map(x => x), [3, 2, 1, 0]);

        r.push(4);
        assert.equal(r.state.length, 4);
        assert.deepEqual(r.map(x => x), [4, 3, 2, 1]);

        r.push(5);
        assert.equal(r.state.length, 4);
        assert.deepEqual(r.map(x => x), [5, 4, 3, 2]);

        r.push(6);
        assert.equal(r.state.length, 4);
        assert.deepEqual(r.map(x => x), [6, 5, 4, 3]);

        r.push(7);
        assert.equal(r.state.length, 4);
        assert.deepEqual(r.map(x => x), [7, 6, 5, 4]);

        r.push(8);
        assert.equal(r.state.length, 4);
        assert.deepEqual(r.map(x => x), [8, 7, 6, 5]);
    });
}
