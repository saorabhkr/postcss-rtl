"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

const rtlcss = require('rtlcss');

const getProcessedKeyframeValue = (decl, keyframes = [], dir) => {
  let value = decl.value;
  keyframes.forEach(keyframe => {
    const nameRegex = new RegExp(`(^|\\s)${keyframe}($|\\s)`, 'g');
    if (!value.match(nameRegex)) return;
    value = value.replace(nameRegex, ` ${keyframe}-${dir} `);
  });
  return value;
};

const rtlifyDecl = (decl, keyframes) => {
  let prop = decl.prop,
      value = decl.value;

  if (decl.prop.match(/animation/)) {
    value = getProcessedKeyframeValue(decl, keyframes, 'rtl');
  } else {
    const rtlResult = rtlcss.process(decl, null, null);

    if (rtlResult === decl.toString()) {
      return null;
    }

    const cleanRtlResult = rtlResult.replace(/([^:]*)\s*\/\*.*?\*\/\s*/, '$1');

    var _ref = cleanRtlResult.match(/([^:]*):\s*([\s\S]*)/) || [];

    var _ref2 = _slicedToArray(_ref, 3);

    prop = _ref2[1];
    value = _ref2[2];
    value = value.replace(/\s*!important/, '');
  }

  return {
    prop,
    value
  };
};

const ltrifyDecl = (decl, keyframes) => {
  if (decl.prop.match(/animation/)) {
    decl.value = getProcessedKeyframeValue(decl, keyframes, 'ltr');
  }

  return decl;
};

module.exports = {
  ltrifyDecl,
  rtlifyDecl
};