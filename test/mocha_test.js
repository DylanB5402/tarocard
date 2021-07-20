const assert = require('assert');

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.strictEqual([1, 2, 3].indexOf(4), -1);
    });
    it('should be 5', ()=> {
        assert.strictEqual(5, 5);
    })
  });
});

describe('test', ()=> {
    it('should pass', () => {
      assert.strictEqual(5 + 5, 10);
        
    })
})