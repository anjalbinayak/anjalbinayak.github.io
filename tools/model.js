window.onload = function(){

    $('[data-toggle="tooltip"]').tooltip();

    let generateModelBtn = document.querySelector("#generate-model");
    let modelTextCopyBtn = document.querySelector('#copy-model-text');
    let mapperTextCopyBtn = document.querySelector('#copy-mapper-text');
    let generateMapperBtn = document.querySelector('#generate-mapper');

    let modelOutput = document.querySelector('#output');
    let mapperOutput = document.querySelector('#mapper-output');

    generateModelBtn.addEventListener('click', function(){
        let moduleName = document.querySelector('#module');
        let tableName = document.querySelector('#table');
        let columnNames = document.querySelector('#columns');
        let putGetterSetters = document.querySelector('#getter_setter');

        generateModel(moduleName.value , tableName.value , columnNames.value , putGetterSetters.checked);
        $("#myModal").modal('show');

        hljs.configure({useBR: false});

        document.querySelectorAll('code.php').forEach((block) => {
        hljs.highlightBlock(block);
        });

    });


    generateMapperBtn.addEventListener('click', function(){
        let moduleName = document.querySelector('#module');
        let tableName = document.querySelector('#table');
        let columnNames = document.querySelector('#columns');

        generateMapper(moduleName.value , tableName.value , columnNames.value );
        $("#myMapper").modal('show');

        hljs.configure({useBR: false});

        document.querySelectorAll('code.php').forEach((block) => {
        hljs.highlightBlock(block);
        });


    });



    
function generateModel(moduleName , tableName , columnNames , isGetterSetters)
{
    let model = getModel();

    model = model.replace('$className', getClassName(moduleName, tableName));
    model = model.replace('$tableName', capitalizeFirstLetter(tableName));
    model = model.replace('$namespace', capitalizeFirstLetter(moduleName));
    model = model.replace('$columnNames' , getClassAttributes(columnNames));

    if(isGetterSetters){
        model = model.replace('$getter_setter' , createGettersAndSetters(columnNames));
    }else{
        model = model.replace('$getter_setter' , '');
    }
    
    
    modelOutput.innerHTML = model;
    return model;

}





function generateMapper(moduleName , tableName, columnNames)
{
    let mapper = getMapper();
    mapper = mapper.replace('className', getClassName(moduleName, tableName ,  false));
    mapper = mapper.replace('modelName', getClassName(moduleName, tableName));
    mapper = mapper.replace('tableName',tableName);
    mapper = mapper.replace('saveFunction', createSaveFunction(moduleName,  tableName,columnNames));
    
    mapperOutput.innerHTML = mapper;
    return mapper;

}


modelTextCopyBtn.addEventListener('click',function(){
    copyModelCode();
    $("#myModal").modal('hide');
    

});

mapperTextCopyBtn.addEventListener('click',function(){
    copyMapperCode();
    $("#myMapper").modal('hide');
    

});



}




function getClassName(moduleName , tableName, isModel=true)
{
    let tableNameArr = tableName.split('_');
    arrLength = tableNameArr.length;
    moduleName = capitalizeFirstLetter(moduleName);
    let className = moduleName+"_Model_";

    if(arrLength > 1){
        
        for (let i = 0; i < arrLength; i++ ){
            className += capitalizeFirstLetter(tableNameArr[i])
        }

    }
    else{
        className += capitalizeFirstLetter(tableNameArr[0]);
    }

    if(!isModel) className+="Mapper";
    return className;

}


function capitalizeFirstLetter(string)
{
    return string[0].toUpperCase() +  string.slice(1); 
}

function getModel()
{
    let modelStruct = document.querySelector('#model-code');
    return modelStruct.innerHTML;

}

function getMapper()
{
    let mapperStruct = document.querySelector('#mapper-code');
    return mapperStruct.innerHTML;

}


function createGettersAndSetters(columnNames){
    let columnsArr = columnNames.split(',');
    let getterSetters = '';
    for( let i = 0 ; i < columnsArr.length; i++)
    {
        columnsArr[i] = columnsArr[i].trim();
    }

    for( let i = 0 ; i < columnsArr.length; i++)
    {
        let functionName = '';
       text = columnsArr[i].split('_');
       if(text.length > 1)
       {
            for (let j = 0; j< text.length; j++){
                functionName += capitalizeFirstLetter(text[j]);
            } 

       }


       getter = `public function get${functionName}()\n{\n  return $this->${columnsArr[i]};\n}\n`;
       setter = `public function set${functionName}($${columnsArr[i]})\n{\n  $this->${columnsArr[i]} = ${columnsArr[i]};\n  return $this;\n}\n`;
       getterSetters += getter+setter;
    }

    return getterSetters;
}

function getClassAttributes(columnNames)
{
    let columnsArr = columnNames.split(',');
    let attributes = '';

    for( let i = 0 ; i < columnsArr.length; i++)
    {
        columnsArr[i] = columnsArr[i].trim();
    }

    
    for( let i = 0 ; i < columnsArr.length; i++)
    {
        attributes += `protected $${columnsArr[i]} = null;\n    `;
    }

    return attributes;

}

function createSaveFunction(moduleName , tableName , columnNames){
    // public function save(modelName camelCaseTableName, $removeCache = true)
    // {
    //     $data = [
    //         'batch_id' => camelCaseTableName->getBatchId(),
    //         'student_id' => camelCaseTableName->getStudentId()
    //     ];
    //     $id= camelCaseTableName->getId();
    //     if (null==$id) {
    //         $id=$this->getDbTable()->insert($data);
    //         camelCaseTableName->setId($id);
    //     } else {
    //         unset($data['id']);
    //         $this->getDbTable()->update($data, array('id = ?' => $id));
    //     }
    // }
    columnNames = columnNames.split(',');
    camelCaseTableName = camelCase(tableName);
    className = getClassName(moduleName, tableName);

    text = `public function save(${className} $${camelCaseTableName}, $removeCache=true){\n          `;
    text+= `$data = [`;
    for (i = 1; i< columnNames.length-1; i++){
        text+= `'${columnNames[i].trim()}' => $${camelCaseTableName}->get${capitalizeFirstLetter(camelCase(columnNames[i].trim()))}(),\n                 `;
    }

    lastColumn = columnNames[columnNames.length-1].trim();
    firstColumn = columnNames[0].trim();
    text+= `'${lastColumn}' => $${camelCaseTableName}->get${capitalizeFirstLetter(camelCase(lastColumn))}() \n       `;
    text+= `    ];\n               `
    text+= `$${camelCase(firstColumn)} = ${camelCaseTableName}->get${capitalizeFirstLetter(firstColumn)}();`;
    text+= `\n        if (null==$id) {
                $id=$this->getDbTable()->insert($data);
                ${camelCaseTableName}->set${capitalizeFirstLetter(firstColumn)}($${firstColumn});
            }else{
                unset($data['${firstColumn}']);
                $this->getDbTable()->update($data, array('${firstColumn} = ?' => $${firstColumn}));
            }
        }`;


        return text;

}

function camelCase(str) {
    str = str.split('_');
    newStr = '';
    newStr = str[0].toLowerCase();
    if(str.length > 1){  
        for (i = 1; i<str.length; i++)
        {
            newStr+= newStr[i];
        }
    }

    return newStr;

  }


function copyModelCode() {
    
    var copyText = document.querySelector("#output");
  
    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); 
  
    
    document.execCommand("copy");
  }


  function copyMapperCode() {
    
    var copyText = document.querySelector("#mapper-output");
  
    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); 
  
    
    document.execCommand("copy");
  }







