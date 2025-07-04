'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require('react');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  children: _propTypes2.default.func.isRequired,
  onEnd: _propTypes2.default.func,
  onResult: _propTypes2.default.func,
  onError: _propTypes2.default.func
};

var defaultProps = {
  onEnd: function onEnd() {},
  onResult: function onResult() {},
  onError: function onError() {}
};

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

var SpeechRekognition = function SpeechRekognition(props) {
  var recognition = (0, _react.useRef)(null);

  var _useState = (0, _react.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      listening = _useState2[0],
      setListening = _useState2[1];

  var supported = !!window.SpeechRecognition;
  var children = props.children,
      onEnd = props.onEnd,
      onResult = props.onResult,
      onError = props.onError;


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
        interimResults = _args$interimResults === undefined ? true : _args$interimResults;

    setListening(true);
    recognition.current.lang = lang;
    recognition.current.interimResults = interimResults;
    recognition.current.onresult = processResult;
    recognition.current.onerror = handleError;
    // SpeechRecognition stops automatically after inactivity
    // We want it to keep going until we tell it to stop
    recognition.current.onend = function () {
      return recognition.current.start();
    };
    recognition.current.start();
  };

  var stop = function stop() {
    if (!listening) return;
    setListening(false);
    recognition.current.onend = function () {};
    recognition.current.stop();
    onEnd();
  };

  (0, _react.useEffect)(function () {
    if (!supported) return;
    recognition.current = new window.SpeechRecognition();
  }, []);

  return children({
    listen: listen,
    listening: listening,
    stop: stop,
    supported: supported
  });
};

SpeechRekognition.propTypes = propTypes;
SpeechRekognition.defaultProps = defaultProps;

exports.default = (0, _react.memo)(SpeechRekognition);