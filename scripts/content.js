var str = "";
var record = false;
var cnt = 0;
document.addEventListener("keydown", function(event){
    const targetElement = event.target;
    const canEdit = hasNthParentEditable(targetElement, 1000);
    if(
           targetElement.tagName === 'INPUT' 
        || targetElement.tagName === 'TEXTAREA'
        || canEdit
      ){
        //remove the last char from str or from the cnt
        if(event.key === 'Backspace'){
            if(cnt > 0){
                let cntStr = cnt.toString();
                let newCntStr = cntStr.slice(0, -1);
                cnt  = newCntStr.length > 0 ? parseInt(newCntStr) : 0;
            }
            else if(str.length > 0){
                str = str.slice(0, -1);
            }
            return;
        }

        //begin recording the string
        if(event.key === ':'){
            record = true;
            str = "";
        }else if(record && event.key === ' '){                
            //stop recording and process str
            var match = true;
            if(match){
                //match is found and the srting has to be replaced
                const originalStr = str;
                getMappedString(str, cnt)
                    .then(function(res){
                        const userStr = targetElement.value?targetElement.value : targetElement.textContent;
                        const colonIdx = userStr.lastIndexOf(':');
                        if(canEdit){
                            //targetElement.textContent = userStr.slice(0, colonIdx);
                            let curStr = ":" + originalStr;
                            let newStr = "";
                            for(var i=0;i<Math.max(1, res.count);i++){
                                newStr += res.str;
                            }
                            newStr += " ";
                            console.log(curStr + " " + newStr);
                            
                            let stroke = new Event("input", {
                                bubbles: true,
                                cancelable: true
                            });
                            const userStr = targetElement.textContent;
                            targetElement.textContent = userStr.slice(0, colonIdx);
                            targetElement.textContent += newStr;
                            //targetElement.innerHTML = targetElement.innerHTML.replace(curStr, newStr);
                            //targetElement.innerHTML = targetElement.innerHTML.replace(count.toString(), '');
                            //console.log(targetElement);
                            
                            console.log("content" + targetElement.textContent);
                        }
                        else{
                            targetElement.value = userStr.slice(0, colonIdx);
                            for(var i=0;i<Math.max(1, res.count);i++){
                                targetElement.value += res.str;
                            }
                            targetElement.value += " ";
                        }
                        
                        
                        
                    })
                    .catch(function(error){
                        //console.log(error);
                    });
                //console.log(str);
               
            }
            record = false;
            str = "";
            cnt = 0;
        }else if(record && event.key >= '0' && event.key <= '9'){
            //if numeric check how many times it should appear
            cnt *= 10;
            cnt += parseInt(event.key);
            
        }else{
            //otherwise fill the str 
            if(record){
                str += event.key;
            }
        }
        //console.log(record);
    }
});

//gets mapped value from chrome local storage and returns promise
function getMappedString(key, cnt) {
    return new Promise(function(resolve, reject) {
        chrome.storage.local.get(key, function(res) {
            if (res[key] !== undefined) {
                resolve({str:res[key], count:cnt});
            } else {
                reject("Value not found in storage.");
            }
        });
    });
}

//has any parent editable 
function hasNthParentEditable(element, n) {
    let currentElement = element;
    
    for (let i = 0; i < n; i++) {
        //console.log(currentElement);
      if (!currentElement) {
        return false; // Reached the root element without finding an editable ancestor
      }
      
      const contentEditableValue = currentElement.getAttribute("contenteditable");
      console.log(contentEditableValue);
      if (contentEditableValue === "true") {
        return true; // Found an editable ancestor
      }
      
      currentElement = currentElement.parentElement; // Move to the next ancestor
    }
    
    return false; // Did not find an editable ancestor after n iterations
  }