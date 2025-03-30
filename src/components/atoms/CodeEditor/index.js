import React from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-kotlin";
import "ace-builds/src-noconflict/mode-dart"; // For Flutter (Dart)
import "ace-builds/src-noconflict/ext-language_tools";
import ace from "ace-builds";

// Define the custom theme
ace.define(
  "ace/theme/custom",
  ["require", "exports", "module", "ace/lib/dom"],
  function (require, exports, module) {
    exports.isDark = true;
    exports.cssClass = "ace-custom";
    exports.cssText = `
    .ace-custom .ace_gutter {
      background: transparent;
      color: #cbd5e1;
    }
    .ace-custom {
      background-color: #334155;
      color: #f8fafc;
    }
    .ace-custom .ace_cursor {
      color: #cbd5e1;
    }
    .ace-custom .ace_marker-layer .ace_selection {
      background: #4b5563;
    }
    .ace-custom.ace_multiselect .ace_selection.ace_start {
      box-shadow: 0 0 3px 0px #000000;
    }
    .ace-custom .ace_marker-layer .ace_step {
      background: #3b82f6;
    }
    .ace-custom .ace_marker-layer .ace_active-line {
      background: #475569;
    }
    .ace-custom .ace_gutter-active-line {
      background-color: #475569;
    }
    .ace-custom .ace_marker-layer .ace_selected-word {
      border: 1px solid #cbd5e1;
    }
    .ace-custom .ace_fold {
      background-color: #3b82f6;
      border-color: #f8fafc;
    }
    .ace_comment {
     color: #F97316 !important; /* Change this to your desired color */
     font-style: italic; /* Optional: make comments italic */
    }
  `;

    var dom = require("ace/lib/dom");
    dom.importCssString(exports.cssText, exports.cssClass);
  }
);

const CodeEditor = ({ code, setCode, onBlur, onChange, language, setLanguage }) => {



  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        backgroundColor:'#272C33'
      }}
    >

      <div className="flex justify-end">
        <label className=" text-white rounded-md px-2 text-xs py-1 capitalize">{language}</label>
      </div>

      {/* Code Editor */}
      <AceEditor
        onBlur={onBlur}
        className="rounded-lg"
        mode={language} // Mode changes based on selected language
        theme="custom" // Apply custom theme
        value={code} // Editor content
        onChange={onChange} // Handler for code changes
        name="code-editor" // Unique ID for the editor
        editorProps={{ $blockScrolling: true }}
        width="100%" // Editor width
        height="100%" // Editor height
        style={{backgroundColor:'#272C33'}}
        fontSize={14} // Font size
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 2,
        }}
      />
    </div>
  );
};

export default CodeEditor;
