import React, { Component } from 'react';
import { Group } from 'react-konva';


const Rect = require('./RectC').default;
const Filter = require('./FilterC').default;
const Image = require('./ImageC').default;
const Text = require('./TextC').default;
// const Outline = require('./OutlineC').default;
const Line = require('./LineC').default;

export const CanvasRect = Rect;
export const CanvasFilter = Filter;
export const CanvasImage = Image;
export const CanvasText = Text;
// export const CanvasOutline = Outline;
export const CanvasLine = Line;
export const CanvasGroup = Group;
