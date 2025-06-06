import React from 'react';

const CustomToolbar = () => (
  <div id="toolbar" className="fixed w-full top-0 left-0 bg-white p-2 z-50 flex mb-2">
    <div className="flex flex-wrap items-center justify-center gap-2 m-4">
      <select className="ql-font" />
      <select className="ql-size">
        <option value="small" />
        <option selected />
        <option value="large" />
        <option value="huge" />
      </select>
      <select className="ql-color" />
      <select className="ql-background" />
      <button className="ql-bold" />
      <button className="ql-italic" />
      <button className="ql-underline" />
      <button className="ql-strike" />
      <button className="ql-blockquote" />
      <button className="ql-code-block" />
      <button className="ql-list" value="ordered" />
      <button className="ql-list" value="bullet" />
      <button className="ql-script" value="sub" />
      <button className="ql-script" value="super" />
      <button className="ql-indent" value="-1" />
      <button className="ql-indent" value="+1" />
      <select className="ql-align" />
      {/* <select className="ql-header">
        <option value="1" />
        <option value="2" />
        <option value="3" />
        <option value="4" />
        <option value="5" />
        <option value="6" />
        <option selected />
      </select> */}
    </div>
  </div>
);

export default CustomToolbar;
