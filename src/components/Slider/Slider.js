import PropTypes from 'prop-types';
import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import settings from '../../globals/js/settings';
import Input from '../Input';
import TextInput from '../TextInput';

const { prefix } = settings;

const defaultFormatLabel = (value, label) => {
  return typeof label === 'function' ? label(value) : `${value}${label}`;
};

function PropTypeEmptyString(props, propName, componentName) {
  componentName = componentName || 'ANONYMOUS';
  if (props[propName]) {
    let value = props[propName];
    if (typeof value === 'string' && value !== '') {
      return new Error(
        propName + ' in ' + componentName + ' is not an empty string'
      );
    }
  }
  return null;
}

/** Sliders provide a visual indication of adjustable content, where the user can move the handle along a horizontal track to increase or decrease the value. */

function Slider(props) {
  const {
    additional,
    ariaLabelInput,
    className,
    disabled,
    formatLabel = defaultFormatLabel,
    formItemClassName,
    fullWidth,
    id,
    inputType,
    hideLabel,
    hideControls,
    hideTextInput,
    labelText,
    min,
    minLabel,
    max,
    maxLabel,
    step = 1,
    invalid,
    invalidText,
    onChange = () => {},
    onClick = () => {},
    helperText,
    allowEmpty,
    inputRef,
    ...other
  } = props;

  const initialValue = props.value;
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const newInputRef = useRef(null);
  var _inputRef = inputRef ? inputRef : newInputRef;

  const handleChange = (evt) => {
    if (!disabled) {
      evt.persist();
      evt.imaginaryTarget = _inputRef;
      if (evt.target.value > max) {
        setValue(max);
        onChange(parseFloat(max), evt);
      } else {
        setValue(evt.target.value);
        onChange(parseFloat(evt.target.value), evt);
      }
      // setValue(evt.target.value);
      // onChange(parseFloat(evt.target.value), evt);
    }
  };

  const numberInputClasses = classNames(
    `${prefix}--slider--wrapper`,
    className,
    {
      [`${prefix}--slider--helpertext`]: helperText,
      [`${prefix}--slider--nolabel`]: hideLabel,
      [`${prefix}--slider--nocontrols`]: hideControls,
    }
  );

  const sliderContainerClasses = classNames('wfp--slider-container', {
    'wfp--slider-container--full-width': fullWidth,
  });

  const newProps = {
    disabled,
    id,
    max,
    min,
    step,
    onChange: handleChange,
    value: value,
  };

  const inputClasses = classNames('wfp--input', 'wfp--slider-text-input');

  const sliderClasses = classNames(
    'wfp--slider',
    { 'wfp--slider--disabled': disabled },
    className
  );

  return (
    <Input {...props} formItemClassName={numberInputClasses}>
      {() => {
        return (
          <div className={sliderContainerClasses}>
            <span className="wfp--slider__range-label">
              {formatLabel(min, minLabel)}
            </span>

            <div className="wfp--slider__range-wrapper">
              <div
                className="wfp--slider__range-before"
                style={{ width: `${(100 * value) / max}%` }}
              />
              <input
                className={sliderClasses}
                type="range"
                {...other}
                {...newProps}
                ref={_inputRef}
              />
            </div>
            <span className="wfp--slider__range-label">
              {formatLabel(max, maxLabel)}
            </span>
            {!hideTextInput && (
              <TextInput
                disabled={disabled}
                type={inputType}
                id="input-for-slider"
                className={inputClasses}
                value={value}
                onChange={handleChange}
                labelText=""
                aria-label={ariaLabelInput}
              />
            )}
          </div>
        );
      }}
    </Input>
  );
}

Slider.propTypes = {
  /**
   * Specify an optional className to be applied to the wrapper node
   */
  className: PropTypes.string,

  /**
   * `true` to hide the number input box.
   */
  hideTextInput: PropTypes.bool,

  /**
   * Specify an optional className to be applied to the form-item node
   */
  formItemClassName: PropTypes.string,

  /**
   * Specify if the control should be disabled, or not
   */
  disabled: PropTypes.bool,

  /**
   * Specify whether you want the underlying label to be visually hidden
   */
  hideLabel: PropTypes.bool,

  /**
   * Specify a custom `id` for the input
   */
  id: PropTypes.string.isRequired,

  /**
   * Generic `label` that will be used as the textual representation of what
   * this field is for
   */
  labelText: PropTypes.node,

  /**
   * The minimum value.
   */
  min: PropTypes.number.isRequired,

  /**
   * The label associated with the minimum value.
   */
  minLabel: PropTypes.string,

  /**
   * The maximum value.
   */
  max: PropTypes.number.isRequired,

  /**
   * The label associated with the maximum value.
   */
  maxLabel: PropTypes.string,

  /**
   * The callback to format the label associated with the minimum/maximum value.
   */
  formatLabel: PropTypes.func,

  /**
   * The new value is available in 'imaginaryTarget.value'
   * i.e. to get the value: evt.imaginaryTarget.value
   */
  onChange: PropTypes.func,

  /**
   * Provide an optional function to be called when the up/down button is clicked
   */
  onClick: PropTypes.func,

  /**
   * `true` to disable this slider.
   */
  disabled: PropTypes.bool,

  /**
   * The `name` attribute of the `<input>`.
   */
  name: PropTypes.string,

  /**
   * The `type` attribute of the `<input>`.
   */
  inputType: PropTypes.string,

  /**
   * The `ariaLabel` for the `<input>`.
   */
  ariaLabelInput: PropTypes.string,

  /**
   * A value determining how much the value should increase/decrease by moving the thumb by mouse.
   */
  step: PropTypes.number,

  /**
   * Specify the value of the input, if undefined or null the value is empty
   */
  value: PropTypes.oneOfType([PropTypeEmptyString, PropTypes.number]),

  /**
   * Specify whether the control is currently invalid.
   * Either a boolean in combination with `invalidText` or an `object`( eg. { message: "Message", …otherErrorProperties }) can be passed.
   */
  invalid: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),

  /**
   * Message which is displayed if the value is invalid.
   */
  invalidText: PropTypes.string,

  /**
   * Provide additional component that is used alongside the input for customization
   */
  additional: PropTypes.node,

  /**
   * Provide text that is used alongside the control label for additional help
   */
  helperText: PropTypes.node,

  /**
   * `true` to allow empty string.
   */
  allowEmpty: PropTypes.bool,
  /**
   * Use the width of the parent element
   */
  fullWidth: PropTypes.bool,
};

Slider.defaultProps = {
  fullWidth: false,
  hideTextInput: false,
  step: 1,
  disabled: false,
  minLabel: '',
  maxLabel: '',
  inputType: 'number',
  ariaLabelInput: 'Slider number input',
};

export default Slider;
