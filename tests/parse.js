/**
 * Created by idoschachter on 04/04/2016.
 */

var chai = require('chai');
var sinon = require('sinon');


chai.should();
chai.use(require('sinon-chai'));

var largeJson = require('../lib');

describe('parse', function () {
    beforeEach(function () {
        sinon.spy(JSON, 'parse');
        sinon.spy(largeJson, 'parse');
    });
    afterEach(function () {
        JSON.parse.restore();
        largeJson.parse.restore();
    });

    it('should return null when called with no data', function () {
        largeJson.parse();

        largeJson.parse.should.have.returned(null);
        JSON.parse.should.not.have.been.called;
    });
    it('should return return one item', function () {
        var raw = '{"a":"b","b":2}';
        var parsedjson = largeJson.parse(raw);


        JSON.parse.should.have.been.calledOnce;
        parsedjson.should.be.an('Array').and.have.length(1);
        parsedjson.should.have.deep.property("[0].a", "b");
        parsedjson.should.have.deep.property("[0].b", 2);
    });
    it('should return return two items from \\n array', function () {
        var raw = '{"a":"b","b":2}\n{"a":"c","b":3}';
        var parsedjson = largeJson.parse(raw);

        JSON.parse.should.have.been.calledTwice;
        parsedjson.should.be.an('Array').and.have.length(2);
        parsedjson.should.have.deep.property("[0].a", "b");
        parsedjson.should.have.deep.property("[0].b", 2);
        parsedjson.should.have.deep.property("[1].a", "c");
        parsedjson.should.have.deep.property("[1].b", 3);
    });
    it('should return return two items from | array', function () {
        var raw = '{"a":"b","b":2}|{"a":"c","b":3}';
        var parsedjson = largeJson.parse(raw, '|');

        JSON.parse.should.have.been.calledTwice;
        parsedjson.should.be.an('Array').and.have.length(2);
        parsedjson.should.have.deep.property("[0].a", "b");
        parsedjson.should.have.deep.property("[0].b", 2);
        parsedjson.should.have.deep.property("[1].a", "c");
        parsedjson.should.have.deep.property("[1].b", 3);
    });
    it('should throw error on invalid delimiter', function () {
        try {
            largeJson.parse("{}", ',');
        } catch (err) {
            err.should.have.property('message').that.equals('Invalid Delimiter')
        }
    });
});