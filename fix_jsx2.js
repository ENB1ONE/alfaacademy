const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');

let start = code.indexOf('<style>{`');
let end = code.indexOf('</div>\n</div>\n                          </div>\n                      ) : null}');

if (start !== -1 && end !== -1) {
    let before = code.substring(0, start);
    // Find the end of the newly inserted block
    // It's just before `</div>\n                          </div>\n                      ) : null}`
    // Wait, the original code had:
    // <div style={{ width: '100%', overflowX: 'auto', display: 'flex', justifyContent: 'center' }}>
    //      <div id="history-a4-preview"...
    //      </div>
    // </div>
    // ) : null
    
    // Let's just replace `<style>{`...` with `<><style>{`...
    code = code.substring(0, start) + "<>" + code.substring(start);
    
    // Now we need to find the end of the hidden div we added.
    // Our hidden div ends with `</div>\n</div>`
    // Let's find `<div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>`
    let hiddenStart = code.indexOf("<div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>");
    let hiddenEnd = code.indexOf("</div>", code.indexOf("A4 Footer", hiddenStart));
    // The A4 Footer ends, then the history-a4-preview div ends, then our absolute div ends.
    // Let's just find `Documento de uso interno`...
    let docStr = 'coordenaÃ§Ã£o esportiva.';
    if(code.indexOf(docStr) === -1) docStr = 'coordenaçã';
    if(code.indexOf(docStr) === -1) docStr = 'esportiva.';
    
    let docIdx = code.indexOf(docStr, hiddenStart);
    let firstDivClose = code.indexOf('</div>', docIdx);
    let secondDivClose = code.indexOf('</div>', firstDivClose + 6);
    let thirdDivClose = code.indexOf('</div>', secondDivClose + 6);
    // secondDivClose closes history-a4-preview. thirdDivClose closes the absolute div.
    
    code = code.substring(0, thirdDivClose + 6) + "</>" + code.substring(thirdDivClose + 6);
    fs.writeFileSync('crm/src/pages/Athletes.jsx', code, 'utf8');
    console.log("Fixed JSX!");
} else {
    console.log("Could not find boundaries");
}
