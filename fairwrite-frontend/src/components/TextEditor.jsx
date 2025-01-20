// 

import React, { useState } from 'react';
import CustomToolbar from './CustomToolbar';
import ReactQuill from "react-quill";
import biased from "../assets/biased.png"
import unbiased from "../assets/unbiased.png"
import "react-quill/dist/quill.snow.css";

const modules = {
  toolbar: {
    container: "#toolbar",
  },
};

const TextEditor = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

 

  const handleContentChange = (value) => {
    setContent(value);
  };


  return (
    <div className="w-screen flex flex-col pt-20 p-8 bg-white min-h-screen overflow-x-hidden">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Title of the Article"
          className="text-3xl w-full font-bold border-none focus:outline-none mb-2 h-auto bg-white text-black"
          style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="w-screen flex flex-row text-gray-600">
        <pre style={{fontFamily: "sans-serif"}}>
          Written by Jahnavi Murali  |  {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </pre>
        <div className="flex space-x-4 ml-80">
          <img src={biased} width={"5%"} className='mb--1'/>
          <span className="text-gray-600 ml-10">marked biased</span>
          <img src={unbiased} width={"5%"}/>
          <span className="text-gray-600">marked not biased</span>
        </div>
      </div>
      <CustomToolbar />
      <ReactQuill
        theme="snow"
        value={content}
        onChange={handleContentChange}
        modules={modules}
        className="mt-4 h-full text-black"
      />
    </div>
  );
};

export default TextEditor;
