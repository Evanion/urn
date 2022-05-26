import test from 'ava';

import { InvalidError } from './exceptions';
import { URN } from './urn';

test('stringify', (t) => {
  t.is(URN.stringify('foo'), 'urn:nid:foo');
});

test('stringify set nid', (t) => {
  t.is(URN.stringify('foo', 'bar'), 'urn:bar:foo');
});

test('stringify should throw error if URN parameter contains an invalid character', (t) => {
  const error = t.throws(() => URN.stringify('foo', 'bar', 'u!n'), {
    instanceOf: InvalidError,
  });
  t.is(error.message, 'URN contains invalid characters');
});

test('stringify should throw error if NID parameter contains an invalid character', (t) => {
  const error = t.throws(() => URN.stringify('foo', 'b?r'), {
    instanceOf: InvalidError,
  });
  t.is(error.message, 'NID contains invalid characters');
});

test('derive from urn class', (t) => {
  class TRN extends URN {
    static urn = 'trn';
  }
  t.is(TRN.stringify('foo', 'bar'), 'trn:bar:foo');
});

test('derive from urn class and set separator', (t) => {
  class TRN extends URN {
    static readonly urn = 'trn';
    static readonly separator = '-';
  }
  t.is(TRN.stringify('foo', 'bar'), 'trn-bar-foo');
});

test('derive from urn class and set nid', (t) => {
  class TRN extends URN {
    static urn = 'trn';
  }

  class BarTRN extends TRN {
    static readonly nid = 'bar';
  }
  t.is(BarTRN.stringify('foo'), 'trn:bar:foo');
});

test('Should parse URN and return all parts in object', (t) => {
  class BarTRN extends URN {
    static urn = 'trn';
    static readonly nid = 'bar';
  }

  t.deepEqual(BarTRN.parse('trn:bar:foo'), {
    urn: 'trn',
    nid: 'bar',
    nss: 'foo',
  });
});

test("Should parse URN and return all parts in object, but keep nid with nss if it's not the same generator", (t) => {
  class BarTRN extends URN {
    static urn = 'trn';
    static readonly nid = 'bar';
  }

  t.deepEqual(BarTRN.parse('trn:baz:foo'), {
    urn: 'trn',
    nid: 'baz',
    nss: 'baz:foo',
  });
});
