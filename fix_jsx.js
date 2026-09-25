const fs = require('fs');
let code = fs.readFileSync('crm/src/pages/Athletes.jsx', 'utf8');

// I need to wrap the <style>, responsive div, and absolute div in a React Fragment <> </>
let replacementStart = '<style>{`\n  .history-responsive-view';
let replacementEnd = `                                      </div>\n                                  </div>\n                              </div>\n</div>`;

let idxStart = code.indexOf(replacementStart);
if(idxStart !== -1) {
    let fix = code.substring(idxStart);
    // Find where the hidden div ends
    let hiddenEndStr = "Documento de uso interno e confidencial gerado automaticamente. Ã‰ vedado o compartilhamento com terceiros sem autorizaÃ§Ã£o prÃ©via da coordenaÃ§Ã£o esportiva.\n                                  </div>\n                              </div>\n</div>";
    let idxHiddenEnd = fix.indexOf(hiddenEndStr);
    
    // I am going to just write a script that wraps the whole replacement section.
}

