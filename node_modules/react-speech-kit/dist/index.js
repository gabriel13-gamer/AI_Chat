'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _SpeechRecognition = require('./SpeechRecognition');

Object.defineProperty(exports, 'SpeechRecognition', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_SpeechRecognition).default;
  }
});

var _SpeechSynthesis = require('./SpeechSynthesis');

Object.defineProperty(exports, 'SpeechSynthesis', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_SpeechSynthesis).default;
  }
});

var _useSpeechRecognition = require('./useSpeechRecognition');

Object.defineProperty(exports, 'useSpeechRecognition', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_useSpeechRecognition).default;
  }
});

var _useSpeechSynthesis = require('./useSpeechSynthesis');

Object.defineProperty(exports, 'useSpeechSynthesis', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_useSpeechSynthesis).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }