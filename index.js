import React from 'react';
import { Animated, Easing, View } from "react-native";

import KeyboardView from './libs/parts/KeyboardView'
import InputView from './libs/parts/InputView'
import Styles from './libs/parts/styles'
import PropTypes from 'prop-types'

class PinView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInput: [],
      animatedInputIndex: Object.assign([]),
      animatedDeleteButton: new Animated.Value(0),
      pinViewAnim: new Animated.Value(0),
      animatedDeleteButtonOnPress: true
    };
    this.keyboardOnPress = this.keyboardOnPress.bind(this);
    this.setDeleteButton = this.setDeleteButton.bind(this);
  }

  /**
   * @todo Update README.md for new features
   * @body Write a doc for returnType and onComplete. Also add an info text for removed features
   */

  userInput = [];
  setDeleteButton = (status) => {
    Animated.timing(
        // Animate value over time
        this.state.animatedDeleteButton, // The value to drive
        {
          toValue: status ? 1 : 0, // Animate to final value of 1
          duration: 100
        }
    ).start(); // Start the animation
    this.setState({
      animatedDeleteButtonOnPress: !status,
    })
  };

  keyboardOnPress = (val, returnType, passwordLength, onComplete, onFail) => {
    if (val === this.props.deleteText) {
      this.userInput = this.userInput.slice(0, -1);
      this.setState({
        animatedInputIndex: this.state.animatedInputIndex.slice(0, -1)
      });
      if (this.userInput.length === 0) {
        this.setDeleteButton(false);
      }
    } else {
      if (passwordLength === this.userInput.length + 1) {
        this.userInput = this.userInput.concat(parseInt(val));
        this.setDeleteButton(true);
        this.setState({
          animatedInputIndex: this.state.animatedInputIndex.concat(this.userInput.indexOf(parseInt(val)))
        }, () => {
          if (returnType === "string") {
            return onComplete(this.userInput.join(""))
          } else if (returnType === "array") {
            return onComplete(this.userInput)
          } else {
            console.log("Unkown return type!")
          }
        });
      } else {
        this.userInput = this.userInput.concat(parseInt(val));
        this.setDeleteButton(true);
        this.setState({
          animatedInputIndex: this.state.animatedInputIndex.concat(this.userInput.indexOf(parseInt(val)))
        });
      }
    }
  };

  render() {
    const { passwordLength, buttonTextColor, returnType, buttonBgColor, inputBgColor, onComplete, disabled, inputActiveBgColor, inputBgOpacity, deleteText } = this.props;
    return (
        <View pointerEvents={disabled ? "none" : undefined}>
          <InputView
              bgOpacity={inputBgOpacity}
              passwordLength={passwordLength}
              activeBgColor={inputActiveBgColor}
              animatedInputIndex={this.state.animatedInputIndex}
              pinViewAnim={this.state.pinViewAnim}
              bgColor={inputBgColor}
              styles={[Styles.passwordInputView, Styles.passwordInputViewItem, Styles.passwordInputViewItemActive]}
          />
          <View style={Styles.keyboardView}>
            <KeyboardView
                styles={[Styles.keyboardViewItem, Styles.keyboardViewItemText]}
                bgColor={buttonBgColor}
                textColor={buttonTextColor}
                animatedDeleteButton={this.state.animatedDeleteButton}
                passwordLength={passwordLength}
                deleteText={deleteText}
                onComplete={onComplete}
                animatedDeleteButtonOnPress={this.state.animatedDeleteButtonOnPress}
                keyboardOnPress={this.keyboardOnPress}
                returnType={returnType}
            />
          </View>
        </View>
    )
  }
}

PinView.defaultProps = {
  deleteText: "DEL",
  buttonBgColor: '#FFF',
  buttonTextColor: '#333',
  inputBgColor: '#333',
  inputActiveBgColor: '#333',
  returnType: 'string',
  inputBgOpacity: 0.1,
  disabled: false
};
PinView.propTypes = {
  disabled: PropTypes.bool,
  deleteText: PropTypes.string,
  returnType: PropTypes.string,
  buttonBgColor: PropTypes.string,
  buttonTextColor: PropTypes.string,
  inputBgColor: PropTypes.string,
  inputActiveBgColor: PropTypes.string,
  inputBgOpacity: PropTypes.number,
  onComplete: PropTypes.func.isRequired,
  passwordLength: PropTypes.number.isRequired
};

Array.prototype.equals = function (array) {
  return this.length === array.length &&
      this.every(function (this_i, i) {
        return this_i === array[i]
      })
};

export default PinView
