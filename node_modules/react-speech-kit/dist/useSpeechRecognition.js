'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require('react');

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

var useSpeechRecognition = function useSpeechRecognition() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _props$onEnd = props.onEnd,
      onEnd = _props$onEnd === undefined ? function () {} : _props$onEnd,
      _props$onResult = props.onResult,
      onResult = _props$onResult === undefined ? function () {} : _props$onResult,
      _props$onError = props.onError,
      onError = _props$onError === undefined ? function () {} : _props$onError;

  var recognition = (0, _react.useRef)(null);

  var _useState = (0, _react.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      listening = _useState2[0],
      setListening = _useState2[1];

  var supported = !!window.SpeechRecognition;

  var processResult = function processResult(event) {
    var transcript = Array.from(event.results).map(function (result) {
      return result[0];
    }).map(function (result) {
      return result.transcript;
    }).join('');

    onResult(transcript);
  };

  var handleError = function handleError(event) {
    if (event.error === 'not-allowed') {
      recognition.current.onend = function () {};
      setListening(false);
    }
    onError(event);
  };

  var listen = function listen() {
    var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (listening) return;
    var _args$lang = args.lang,
        lang = _args$lang === undefined ? '' : _args$lang,
        _args$interimResults = args.interimResults,
        interimResults = _args$interimResults === undefined ? true : _args$interimResults,
        _args$continuous = args.continuous,
        continuous = _args$continuous === undefined ? false : _args$continuous,
        _args$maxAlternatives = args.maxAlternatives,
        maxAlternatives = _args$maxAlternatives === undefined ? 1 : _args$maxAlternatives,
        grammars = args.grammars;

    setListening(true);
    recognition.current.lang = lang;
    recognition.current.interimResults = interimResults;
    recognition.current.onresult = processResult;
    recognition.current.onerror = handleError;
    recognition.current.continuous = continuous;
    recognition.current.maxAlternatives = maxAlternatives;
    if (grammars) {
      recognition.current.grammars = grammars;
    }
    // SpeechRecognition stops automatically after inactivity
    // We want it to keep going until we tell it to stop
    recognition.current.onend = function () {
      return recognition.current.start();
    };
    recognition.current.start();
  };

  var stop = function stop() {
    if (!listening) return;
    recognition.current.onresult = function () {};
    recognition.current.onend = function () {};
    recognition.current.onerror = function () {};
    setListening(false);
    recognition.current.stop();
    onEnd();
  };

  (0, _react.useEffect)(function () {
    if (!supported) return;
    recognition.current = new window.SpeechRecognition();
  }, []);

  return {
    listen: listen,
    listening: listening,
    stop: stop,
    supported: supported
  };
};

exports.default = useSpeechRecognition;