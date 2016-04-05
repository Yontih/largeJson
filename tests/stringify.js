/**
 * Created by idoschachter on 04/04/2016.
 */

var chai = require('chai');
var sinon = require('sinon');

var expect = chai.expect;

chai.should();
chai.use(require('sinon-chai'));

var largeJson = require('../lib');

describe('stringify', function () {
    beforeEach(function () {
        sinon.spy(JSON, 'stringify');
        sinon.spy(largeJson, 'stringify');
    });
    afterEach(function () {
        JSON.stringify.restore();
        largeJson.stringify.restore();
    });

    it('should return empty string when called with no data', function () {
        largeJson.stringify();

        largeJson.stringify.should.have.returned("");
        JSON.stringify.should.not.have.been.called;
    });
    it('should parse one item', function () {
        var obj = {
            a: "1",
            b: "2"
        };
        largeJson.stringify(obj);

        largeJson.stringify.should.have.returned('{"a":"1","b":"2"}');
        JSON.stringify.should.have.been.calledOnce;
    });
    it('should parse two items, seperated by \\n', function () {
        var obj = [
            {a: 1, b: 2, c: 3, d: 4},
            {a: 5, b: 6, c: 7, d: 8}
        ];

        largeJson.stringify(obj);

        largeJson.stringify.should.have.returned('{"a":1,"b":2,"c":3,"d":4}\n{"a":5,"b":6,"c":7,"d":8}');
        JSON.stringify.should.have.been.calledTwice;
    });
    it('should parse two items, seperated by \\n using 4 spaces', function () {
        var obj = [
            {a: 1, b: 2, c: 3, d: 4},
            {a: 5, b: 6, c: 7, d: 8}
        ];

        largeJson.stringify(obj, null, null, 4);

        largeJson.stringify.should.have.returned('{\n    "a": 1,\n    "b": 2,\n    "c": 3,\n    "d": 4\n}\n{\n    "a": 5,\n    "b": 6,\n    "c": 7,\n    "d": 8\n}');
        JSON.stringify.should.have.been.calledTwice;
    });
    it('should parse two items, separated by ||', function () {
        var obj = [
            {a: 1, b: 2, c: 3, d: 4},
            {a: 5, b: 6, c: 7, d: 8}
        ];

        largeJson.stringify(obj, "||");

        largeJson.stringify.should.have.returned('{"a":1,"b":2,"c":3,"d":4}||{"a":5,"b":6,"c":7,"d":8}');
        JSON.stringify.should.have.been.calledTwice;
    });
    it('should throw error on invalid delimiter', function () {
        try {
            largeJson.stringify({}, ',');
        } catch (err) {
            expect(err).to.have.property('message').that.equals('Invalid Delimiter')
        }
    });
    it('should throw error on invalid JSON', function () {
        try {
            largeJson.stringify(1);
        } catch (err) {
            expect(err).to.have.property('message').that.equals('Invalid JSON')
        }
    });
});