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
  clipboard: {
    matchVisual: false, // If it doesn't make a different remove it
  },
};

const TextEditor = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [highlightedContent, setHighlightedContent] = useState("");
  const [modalData, setModalData] = useState(null);

  const handleContentChange = (value) => {
    setContent(value);
    setHighlightedContent(value);
  };

  const processAndValidateArticle = () => {
    const sentencesList = content.split(/(?<=\.)/).filter(sentence => sentence.trim().length > 0);
    console.log(sentencesList)
    const biasedSentences = sentencesList.map(() => Math.random() > 0.7 ? 1 : 0);
    console.log(biasedSentences)

    const highlighted = sentencesList.map((sentence, index) => {
      if (biasedSentences[index] === 1) {
        return `<span class='highlighted' data-index='${index}' style='background-color: lightpink;'>${sentence}</span>`;
      }
      return sentence;
    }).join(' ');

    setHighlightedContent(highlighted);
  };

  const handleRightClick = (event) => {
    event.preventDefault();
    console.log("Okay smth")
    const target = event.target;
    console.log("Okay good")
    console.log(target)
    if (target.classList.contains('highlighted')) {
      console.log("Yes I'm here")
      const sentenceIndex = parseInt(target.getAttribute('data-index'), 10);
      const sentencesList = content.split(/(?<=\.)/);
      const sentence = sentencesList[sentenceIndex];
      setModalData({ sentence, index: sentenceIndex });
    }
    console.log("UHM")
  };

  const acceptSuggestion = () => {
    const sentencesList = content.split(/(?<=\.)/);
    const { index } = modalData;
    sentencesList[index] = modalData.sentence; // Replace with the debiased version (same as original for now)
    setContent(sentencesList.join(''));
    setModalData(null);
    processAndValidateArticle();
  };

  const rejectSuggestion = () => {
    setModalData(null);
  };

  const closeModal = () => {
    setModalData(null);
  };


  return (
    <div className="w-screen flex flex-col pt-20 p-8 bg-white min-h-screen overflow-x-hidden" onContextMenu={handleRightClick}>
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
        value={highlightedContent}
        onChange={handleContentChange}
        modules={modules}
        className="mt-4 h-full text-black text-1xl"
      />
      <button
        onClick={processAndValidateArticle}
        className="mt-4 px-4 py-2 bg-blue-500 text-white font-bold rounded self-start"
      >
        Process and Validate Article
      </button>
      {modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-md w-1/3">
            <h2 className="text-lg font-bold mb-4">Debiased Version</h2>
            <p className="mb-4">{modalData.sentence}</p>
            <div className="flex justify-end space-x-4">
              <button onClick={acceptSuggestion} className="px-4 py-2 bg-green-500 text-white rounded">Accept</button>
              <button onClick={rejectSuggestion} className="px-4 py-2 bg-red-500 text-white rounded">Reject</button>
              <button onClick={closeModal} className="px-4 py-2 bg-gray-300 text-black rounded">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextEditor;
