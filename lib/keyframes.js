"use strict";

const postcss = require('postcss');

const unprefixed = postcss.vendor.unprefixed;

const _require = require('./decls'),
      rtlifyDecl = _require.rtlifyDecl;

const _require2 = require('./rules'),
      rtlifyRule = _require2.rtlifyRule;

const isKeyframeRule = rule => rule.type === 'atrule' && unprefixed(rule.name) === 'keyframes';

const isKeyframeAlreadyProcessed = rule => !!rule.params.match(/-ltr$|-rtl$/);

const isKeyframeSymmetric = rule => !rtlifyRule(rule);

const rtlifyKeyframe = (rule, options) => {
  const ruleName = rule.params;
  rule.params = `${ruleName}-ltr`;

  if (!options.onlyDirection || options.onlyDirection === 'rtl') {
    const rtlRule = rule.cloneAfter({
      params: `${ruleName}-rtl`
    });
    rtlRule.walkDecls(decl => {
      const rtl = rtlifyDecl(decl);
      decl.value = rtl ? rtl.value : decl.value;
    });
  }

  if (options.onlyDirection && options.onlyDirection === 'rtl') {
    rule.remove();
  }
};

module.exports = {
  isKeyframeRule,
  isKeyframeAlreadyProcessed,
  isKeyframeSymmetric,
  rtlifyKeyframe
};