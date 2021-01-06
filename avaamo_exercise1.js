//const fetch=require("node-fetch");

//Main function to fetch the text file data
getData().then(response=>{
  console.log("first")
  var data=wordCount(response)
  var topWordArray=getTopWords(data)
  console.log("topWordArray",topWordArray)
  var finalOutput=[]
  topWordArray.forEach(word=>{
    var apiResult=APICall(word).then(response=>{
        //console.log(response)
        finalOutput.push(response)
    })
  })
  console.log("***The Final Output:***\n", finalOutput)
})

//to fetch the data from the URL
async function getData(){
    let response=await fetch("http://norvig.com/big.txt")
    let data=await response.text()
    return data
}


function wordCount(str){
    var output={}
    //var strArr=str.split("")
    str=str.toLowerCase();
    //str=str.replace(/\s+/g,"")
    str=str.replace(/["""(\[{}\]|\b["]([^"]+)["]/g," ")
    str=str.replace(/[----...]|-|\./g," ");
    str=str.replace(/[!?;::,]\b/g," ");

    str.split(/\s+/g).map(word=>output[word]?output[word]++:output[word]=1)
    return output
}

//sort for top 10 words
function getTopWords(word){
    var wordArray=[];
    wordArray=Object.keys(word).map(function(key){
        return{
            name: key,
            total: word[key]
        }
    }) 

    wordArray.sort(function(a,b){
        return b.total-a.total
    })

    var arrLength=wordArray.length;

    if(arrLength>10){
        wordArray.splice(10);

    }
    //console.log(wordArray)

    return wordArray
}

//API Call
 async function APICall(word){
     var url='https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20170610T055246Z.0f'+
     '11bdc42e7b693a.eefbde961e10106a4efa7d852287caa49ecc68cf&lang=en-ru&text='  +
     word.name
     try {
         let response=await fetch(url)
         let data=await response.json()
         //let data=JSON.parse(JSON.stringfy(rdata))
         var output={}
         try{
             var syn=[]
             var means=[]
             if (data.def){
                 let tr1=data.def[0].tr[0]

                 if (tr1){
                 for (i=0;i<2;i++){

                    syn.push(tr1.syn[i][text])
                    //means.push(tr1['mean'][i]['text'])
                      }
                 }
            }
      
            output ={
                "word":word.name,
                "output":{
                    "count":word.total,
                    "synonyms":syn,

                    "pos":data.def[0]['pos']}
    
           }
                
        }catch (err) {
         console.log("Error while fetching the data")
        }
     console.log(output)
     return output
    }catch (err){
        console.log('error-',err)
    }
}    

         
     
 
