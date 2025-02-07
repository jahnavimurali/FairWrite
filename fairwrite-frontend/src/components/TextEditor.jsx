import React, { useState } from 'react';
import CustomToolbar from './CustomToolbar';
import ReactQuill from "react-quill";
import biased from "../assets/biased.png"
import unbiased from "../assets/unbiased.png"
import "react-quill/dist/quill.snow.css";
import nlp from "compromise"

const modules = {
  toolbar: {
    container: "#toolbar",
  },
  clipboard: {
    matchVisual: false, 
  },
};

const TextEditor = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // const [showModal, setShowModal] = useState(false)
  const [modalData, setModalData] = useState(null);

  const [sentences, setSentences] = useState([])
  const [sentencesWithHighlightSpans, setSentencesWithHighlightSpans] = useState([])


  const handleContentChange = (value) => {
    setContent(value);
  };

  // onChange expects a function with these 4 arguments - get JSON
  function handleChange(content, delta, source, editor) {
    setContent(content);
    // editor.getContents().ops[0]['insert']: Get only text content
 }

  const processAndValidateArticle = () => {
    // Get raw HTML from ReactQuill
    let htmlContent = content; 

    // Use DOMParser to safely parse the HTML and extract text
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    // Extract all text nodes while keeping their HTML parent elements
    let textNodes = [];
    let walker = document.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, null, false);

    while (walker.nextNode()) {
        textNodes.push(walker.currentNode);
    }

    // Process each text node separately while preserving its surrounding HTML structure
    textNodes.forEach(node => {
        let text = node.nodeValue.trim();
        if (text) {
            // Tokenize text into sentences using NLP
            let sentencesList = nlp(text).sentences().out('array');

            // Assign random bias flags (for demo purposes)
            const biasedSentences = sentencesList.map(() => Math.random() > 0.7 ? 1 : 0);

            // Wrap biased sentences in <span> for highlighting
            let processedText = sentencesList.map((sentence, index) => {
                return biasedSentences[index] === 1
                    ? `<span style="background-color: lightpink;">${sentence}</span>`
                    : sentence;
            }).join(' ');

            // Replace text in the DOM without affecting surrounding HTML structure
            node.nodeValue = ""; // Clear original text
            let tempDiv = document.createElement("div");
            tempDiv.innerHTML = processedText;
            while (tempDiv.firstChild) {
                node.parentNode.insertBefore(tempDiv.firstChild, node);
            }
        }
    });

    // Convert back to HTML string
    let updatedHTML = doc.body.innerHTML;

    // Update ReactQuill content without losing formatting
    setContent(updatedHTML);
};


  const handleRightClick = (event) => {
    event.preventDefault();
    const target = event.target;
    if (target.style['0']=='background-color') {
    const sentence = target.innerHTML
    // for now set both biased_sentence and debiased_sentence to be the original sentence
    setModalData({biased_sentence: sentence, debiased_sentence: sentence});
    }
  };

  const acceptSuggestion = () => {
    if(!modalData) return;

    let parser =  new DOMParser();
    let doc = parser.parseFromString(content, "text/html")

    let spans = doc.querySelectorAll("span")
    spans.forEach(span => {
      if(span.textContent === modalData.biased_sentence){
        span.outerHTML = modalData.debiased_sentence;
      }
    })

    setContent(doc.body.innerHTML)
    setModalData(null)
  };

  const rejectSuggestion = () => {
      if (!modalData) return;
  
      let parser = new DOMParser();
      let doc = parser.parseFromString(content, "text/html");
  
      let spans = doc.querySelectorAll("span");
      spans.forEach(span => {
          if (span.textContent === modalData.biased_sentence) {
              span.outerHTML = span.textContent; // Remove <span> but keep original text
          }
      });
  
      setContent(doc.body.innerHTML);
      setModalData(null);
  
  };

  const closeModal = () => {
    setModalData(null);
  };


  return (
    <div className="w-full flex flex-col pt-20 p-8 bg-white min-h-screen overflow-x-hidden" onContextMenu={handleRightClick}>
      <div className="mb-4">
        <textarea
          type="text"
          placeholder="Title of the Article"
          // add resize-none to disable dynamic resizing by user
          className="text-3xl h-auto w-full font-bold border-none focus:outline-none mb-2 bg-white text-black word-wrap-break-word white-space-pre-wrap overflow-y-hidden"
          value={title} 
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="w-full flex flex-row text-gray-600">
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
        placeholder='Article content here!'
        value={content}
        onChange={handleContentChange}
        modules={modules}
        className="mt-4 h-full text-black"
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
