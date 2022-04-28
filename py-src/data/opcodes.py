from enum import IntEnum, auto


# should equal opcodes.ts
class OPCode(IntEnum):
    getmouse = 1
    holdMouse = 2
    setKey = 3
    moveTo = 4
    drag = 4
    rightclick = 6
    doubleclick = 7
    click = 8
    scroll = 9
    centerMouse=10