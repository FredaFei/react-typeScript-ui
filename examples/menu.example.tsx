import * as React from 'react'
import {Menu, MenuItem, SubMenu} from '../packages/index'

import content1 from "./markdown/menu-demo-1.md";
import content2 from "./markdown/menu-demo-2.md";
import content3 from "./markdown/menu-demo-3.md";
import doc from "./markdown/menu-doc.md";
import Markdown from './markdown'
import CodeBox from "./codeBox";

export default function (props: any) {
  const style = {overflow: 'initial'}
  return (
    <div className="exp-box">
      <div className="exp-section" style={style}>
        <h3>基础应用</h3>
        <Menu selected="menu1">
          <SubMenu title="sub1" name="sub1">
            <MenuItem name="menu3-1">menu 3--1</MenuItem>
            <MenuItem name="menu3-2">menu 3--2</MenuItem>
            <MenuItem name="menu3-3">menu 3--3</MenuItem>
            <SubMenu title="submenu 2" name="sub2">
              <MenuItem name="menu3-2-1">menu 3-2-1</MenuItem>
              <MenuItem name="menu3-2-2">menu 3-2-2</MenuItem>
              <MenuItem name="menu3-3-3">menu 3-2-3</MenuItem>
            </SubMenu>
          </SubMenu>
          <MenuItem name="menu1">menu 1</MenuItem>
          <MenuItem name="menu2">menu 2</MenuItem>
        </Menu>
        <CodeBox content={content1}/>
      </div>
      <div className="exp-section" style={style}>
        <h3>垂直排列</h3>
        <Menu layout="vertical" selected="menu3-2-2">
          <MenuItem name="menu1">menu 1</MenuItem>
          <MenuItem name="menu2">menu 2</MenuItem>
          <SubMenu title="submenu 1" name="submenu1">
            <MenuItem name="menu3-1">menu 3--1</MenuItem>
            <MenuItem name="menu3-2">menu 3--2</MenuItem>
            <MenuItem name="menu3-3">menu 3--3</MenuItem>
            <SubMenu title="submenu 2" name="submenu2">
              <MenuItem name="menu3-2-1">menu 3-2-1</MenuItem>
              <MenuItem name="menu3-2-2">menu 3-2-2</MenuItem>
              <MenuItem name="menu3-3-3">menu 3-2-3</MenuItem>
            </SubMenu>
          </SubMenu>
          <MenuItem name="menu4">menu 4</MenuItem>
        </Menu>
        <CodeBox content={content2}/>
      </div>
      <div className="exp-section" style={style}>
        <h3>不可用状态</h3>
        <Menu selected="menu1">
          <MenuItem name="menu1">menu 1</MenuItem>
          <MenuItem name="menu2" disabled>menu 2</MenuItem>
          <MenuItem name="menu3">menu 3</MenuItem>
          <SubMenu title="menu mixin 4" name="menu4" disabled>
            <MenuItem name="menu3-1">menu 3--1</MenuItem>
            <MenuItem name="menu3-2">menu 3--2</MenuItem>
            <MenuItem name="menu3-3">menu 3--3</MenuItem>
          </SubMenu>
        </Menu>
        <CodeBox content={content3}/>
      </div>
      <CodeBox content={content2}/>
      <Markdown source={doc}/>
    </div>
  )
}