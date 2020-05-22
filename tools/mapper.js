window.onload = function(){

    $('[data-toggle="tooltip"]').tooltip();

    let generateBtn = document.querySelector("#generate-model");
    let modelTextCopyBtn = document.querySelector('#copy-model-text');

    generateBtn.addEventListener('click', function(){
        let moduleName = document.querySelector('#module');
        let tableName = document.querySelector('#table');
        let columnNames = document.querySelector('#columns');
        let putGetterSetters = document.querySelector('#getter_setter');
        let output = document.querySelector('#output');
        
       

        // console.log(moduleName.value , tableName.value, columnsName.value , putGetterSetters.checked);

        generateModel(moduleName.value , tableName.value , columnNames.value , putGetterSetters.checked);
        $("#myModal").modal('show');

    });

    modelTextCopyBtn.addEventListener('click',function(){
        copyModelCode();
        $("#myModal").modal('hide');
        

    });
}

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
    
    
    output.innerHTML = model;
    return model;

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

    if(!isModel) className+"Mapper";
    return className;

}


function capitalizeFirstLetter(string)
{
    return string[0].toUpperCase() +  string.slice(1); 
}

function getMapper()
{
    let mapperStruct = document.querySelector('#mapper-code');
    return mapperStruct.innerHTML;

}





function copyMapperCode() {
    
    var copyText = document.querySelector("#output");
  
    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); 
  
    
    document.execCommand("copy");
  }







