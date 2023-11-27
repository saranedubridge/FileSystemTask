
// postman documentation link: https://documenter.getpostman.com/view/25035029/2s9YeEcXpm

// Define express server
const express=require('express');
const app=express();
const fs=require('fs');
const path=require('path')
const cors=require('cors')

// my local file folder
 //const foldername= 'D:/guvi/Nodejs-Tasks';

//  need to replace the / instead of \ in windows machine
const foldername = path.join(__dirname).replace(/\\/g, '/');
// console.log(foldername)

if(!fs.existsSync(foldername)){
    fs.mkdirSync(foldername);
}

// middleware
app.use(cors());
app.use(express.json());

/*
1. Write API endpoint which will create a text file in a particular folder
     *content of the file shout be the current timestamp.
     *The filename should be current date-time.txt
*/ 

// creating file with current timestamp




app.post('/FileSystem',(request,response)=>{
    const timestamp=new Date().toISOString();

    // Replace characters that are not allowed in filenames in windows machine

    const sanitizedTimestamp = timestamp.replace(/:/g, '-').replace(/\./g, '_');

    const filename=`${sanitizedTimestamp}.txt`;
    const filepath= path.join(foldername,filename)


    fs.writeFile(filepath,timestamp,(err)=>{
        if(err){
            console.error(err);
            response.status(500).send('Internal Server Error');
        }else{
             console.log(`File created successfully: ${filepath}`);
            response.status(201).json({message:'File created successfully'});
            
        }
    })
});

/*2.Write API endpoint to retrieve all the text files in the particular folder */


// Endpoints to retrieve all text files in the folder
app.get('/FileSystem', (request, response) => {
    fs.readdir(foldername, (err, files) => {
        if (err) {
            console.error(err);
            response.status(500).send('Internal Server Error');
        } else {
            // Filter only text files
            const textFiles = files.filter(file => path.extname(file) === '.txt');
            response.status(200).json({ files: textFiles });
            console.log("Text file retrived sucessfully")
        }
    });
});

// server running on 3001 port
const PORT = 3001;
app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
});