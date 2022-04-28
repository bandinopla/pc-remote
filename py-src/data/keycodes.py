import json
import pyautogui

 
#
# returns the string value of code: 
# @see https://pyautogui.readthedocs.io/en/latest/keyboard.html#keyboard-keys
#
def keycode2string( code:int ):
    return pyautogui.KEYBOARD_KEYS[code]