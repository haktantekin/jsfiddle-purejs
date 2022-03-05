// History butonu oluşturuluyor

const createHistorySection = () => {
    const historyBox = document.querySelector('.history-box');

    const localStoregeItems = JSON.parse(localStorage.getItem('codeEditor'));
    const localStoregeItemsArr = [];
    for (const localStoregeItem in localStoregeItems) {
        localStoregeItemsArr.push(localStoregeItem);
    }
    if(localStoregeItemsArr.length == 0){
        historyBox.style.display ="none";

    }
    else{
        historyBox.style.display ="block";
        historyBox.innerHTML = `
        <button type="button" class="history-box-dropdown dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">History</button>
        <ul class="dropdown-menu history-box-dropdown-menu">
            ${localStoregeItemsArr.map((item) => {
            return `
                <li><button type="button" onclick="savedHistory('${item}')" class="dropdown-item">${item}</></li>
                        `
        }).join('')}
        </ul>
    `;

    }
}

//Data Localstroge'a aktarılıyor

const keepCode = () => {
    const editorName = document.querySelector('#editor-title').value;
    const keepHTMLCodes = htmlEditor.getValue();
    const keepCssCodes = cssEditor.getValue();
    const keepJSCodes = jsEditor.getValue();

    const takeItems = JSON.parse(localStorage.getItem('codeEditor'));

    const jsonStorage = {
        [editorName]: {
            'date': new Date().getTime(),
            'js': keepJSCodes,
            'css': keepCssCodes,
            'html': keepHTMLCodes,
        },
        ...takeItems
    };

    localStorage.setItem('codeEditor', JSON.stringify(jsonStorage));
    createHistorySection();
}


// Local Storage'dan html, css ve js alanlarına data aktarımı
const savedHistory = (key) => {
    let jsonStorage = localStorage.getItem('codeEditor');
    const savedData = JSON.parse(jsonStorage)[key];

    renderContent(savedData.html, savedData.css, savedData.js);
}

// Content oluşturma
const renderContent = (htmlData, cssData, jsData) => {
    const content = htmlData +
        "<style>" + cssData + "</style>" +
        "<script>" + jsData + "</script>";

    jsEditor.setValue(jsData);
    htmlEditor.setValue(htmlData);
    cssEditor.setValue(cssData);

    const resultIframe = document.querySelector('#result-iframe');
    let renderContent = resultIframe.contentWindow.document;

    renderContent.open();
    renderContent.write(content);
    renderContent.close();
}

// Local storage kaydı
const autoSave = () => {
    if (sessionStorage.getItem("autoSaveHtmlEditor")) htmlEditor.setValue(sessionStorage.getItem("autoSaveHtmlEditor"));
    if (sessionStorage.getItem("autoSaveCssEditor")) cssEditor.setValue(sessionStorage.getItem("autoSaveCssEditor"));
    if (sessionStorage.getItem("autoSaveJsEditor")) jsEditor.setValue(sessionStorage.getItem("autoSaveJsEditor"));

    CodeMirror.on(htmlEditor, 'change', () => {
        sessionStorage.setItem("autoSaveHtmlEditor", htmlEditor.getValue());
    });
    CodeMirror.on(cssEditor, 'change', () => {
        sessionStorage.setItem("autoSaveCssEditor", cssEditor.getValue());
    });
    CodeMirror.on(jsEditor, 'change', () => {
        sessionStorage.setItem("autoSaveJsEditor", jsEditor.getValue());
    });
}

// minimize button
const minimize = (check) => {
    let height;
    if (check === 0) 
    {
        height = 100;
    }
    if (check === 1) 
    {
        height = 300;
    }

    htmlEditor.setSize(null, height);
    cssEditor.setSize(null, height);
    jsEditor.setSize(null, height);


    return check ? 0 : 1;
}

const htmlEditorDiv = document.querySelector('.col-html-editor');
const htmlEditorTextarea = htmlEditorDiv.querySelector('#htmlEditor');

const cssEditorDiv = document.querySelector('.col-css-editor');
const cssEditorTextrea = cssEditorDiv.querySelector('#cssEditor');

const jsEditorDiv = document.querySelector('.col-js-editor');
const jsEditorTextarea = jsEditorDiv.querySelector('#javascriptEditor');

//Declare button variables
const runButton = document.querySelector('#run');
const minimizeButton = document.querySelector('#minimize');

const codeMirrorOptions = {
    autoCloseBrackets: true,
    autoCloseTags: true,
    gutters: ['CodeMirror-lint-markers'],
    matchBrackets: true,
    lineNumbers: false,
    lint: true,
    theme: 'material-darker',
    extraKeys: {
        "Ctrl-Space": "autocomplete",
    },
}

const jsEditor = CodeMirror.fromTextArea(jsEditorTextarea, {
    mode: 'javascript',
    ...codeMirrorOptions
});

const htmlEditor = CodeMirror.fromTextArea(htmlEditorTextarea, {
    mode: 'xml',
    ...codeMirrorOptions
});

const cssEditor = CodeMirror.fromTextArea(cssEditorTextrea, {
    mode: 'css',
    ...codeMirrorOptions
});

//History butonuna click'lenince kaydetme
createHistorySection();

//Otomatik kayıt etme
autoSave();

// mini function
let mini = 0;
minimizeButton.addEventListener('click', () => {
    mini = minimize(mini);
});

// run butonu tıklandığında
runButton.addEventListener('click', () => {
    renderContent(htmlEditor.getValue(), cssEditor.getValue(), jsEditor.getValue());
});

// CTRL + S yapıldığında kaydetme
document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        renderContent(htmlEditor.getValue(), cssEditor.getValue(), jsEditor.getValue());
    }
});