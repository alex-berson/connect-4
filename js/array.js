Object.defineProperties(Array.prototype, {
    copy: {
        value: function() {
            return this.map(arr => arr.slice());
        }
    }
});

Object.defineProperties(Array.prototype, {
    count: {
        value: function(value) {
            return this.filter(x => x == value).length;
        }
    }
});

Object.defineProperties(Array.prototype, {
    row: {
        value: function(value) {
            return this[value];
        }
    }
});

Object.defineProperties(Array.prototype, {
    column: {
        value: function(value) {
            return this.map(x => x[value]);
        }
    }
});