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

  // const [showModal, setShowModal] = useState(false)
  const [modalData, setModalData] = useState(null);

  const [sentences, setSentences] = useState([])
  const [sentencesWithHighlightSpans, setSentencesWithHighlightSpans] = useState([])

  const handleContentChange = (value) => {
    setContent(value);
    setHighlightedContent(value);
  };

  // onChange expects a function with these 4 arguments - get JSON
  function handleChange(content, delta, source, editor) {
    // console.log(content);
    setContent(content);
    setHighlightedContent(editor.getContents());

 }

  const processAndValidateArticle = () => {
    // console.log(content)
    // console.log(content.ops[0]['insert'])
    const sentencesList = content.split(/(?<=\.)/).filter(sentence => sentence.trim().length > 0);
    setSentences(sentencesList)
    // console.log(sentencesList)
    const biasedSentences = sentencesList.map(() => Math.random() > 0.7 ? 1 : 0);
    // console.log(biasedSentences)

    let highlighted = sentencesList.map((sentence, index) => {
      if (biasedSentences[index] === 1) {
        return `<span class='highlighted' data-index='${index}' style='background-color: lightpink;'>${sentence}</span>`;
      }
      return sentence;
    })
    // console.log(highlighted)
    highlighted = highlighted.join(' ');
    // console.log(highlighted)

    setHighlightedContent(highlighted);
  };

  const handleRightClick = (event) => {
    event.preventDefault();
    // console.log("Okay smth")
    const target = event.target;
    // console.log("Okay good")
    // console.log(target.innerHTML)
    if (target.style['0']=='background-color') {
    //   console.log("Yes I'm here")
    //   const sentenceIndex = parseInt(target.getAttribute('data-index'), 10);
    //   const sentencesList = content.split(/(?<=\.)/);
    //   const sentence = sentencesList[sentenceIndex];
      const sentence = target.innerHTML
    // for now set both biased_sentence and debiased_sentence to be the original sentence
      setModalData({biased_sentence: sentence, debiased_sentence: sentence});
    }
    // console.log("UHM")
  };

  const acceptSuggestion = () => {
    const sentencesList = content.split(/(?<=\.)/);
    const { index } = modalData;
    sentencesList[index] = modalData.sentence; // Replace with the debiased version (same as original for now)
    setContent(sentencesList.join(''));
    setModalData(null);
    processAndValidateArticle();

    // let sentencesList = sentences
    // console.log("1", sentencesList)
    // const index = sentencesList.indexOf(modalData.biased_sentencesentence);

    // sentencesList[index] = modalData.debiased_sentence; // Replace with the debiased version (same as original for now)
    
    // setSentences(sentencesList) 
    // setContent(sentencesList.join(''));

    // let sen_high = sentencesWithHighlightSpans
    // sen_high[index] = modalData.debiased_sentence;
    // setHighlightedContent(sen_high.join(''))
    // setModalData(null);
    // processAndValidateArticle();
  };

  const rejectSuggestion = () => {
    // const index = sentences.indexOf(modalData.biased_sentence);
    // let sen_high = sentencesWithHighlightSpans
    // sen_high[index] = modalData.biased_sentence;
    // setHighlightedContent(sen_high.join(''))
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
        onChange={handleChange}
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
            <h2 className="text-lg text-black font-bold mb-4">Debiased Version</h2>
            <p className="mb-4 text-black">{modalData.debiased_sentence}</p>
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
