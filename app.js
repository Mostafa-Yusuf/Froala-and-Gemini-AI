var express = require('express');
require('dotenv').config();
const marked = require('marked');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// For text-only input, use the gemini-pro model
const model = genAI.getGenerativeModel({ model: "gemini-pro"});

var app = express();



// Set EJS as the view engine
app.set('view engine','ejs');

//Froala editor CSS & JS files
app.use('/froalacss',express.static(__dirname+'/node_modules/froala-editor/css/froala_editor.pkgd.min.css'));
app.use('/froalajs',express.static(__dirname+'/node_modules/froala-editor/js/froala_editor.pkgd.min.js'));


// Define routes 
app.get('/',(req,res)=>{
 res.render('editor');
});

// Middleware to parse JSON bodies
app.use(express.json());

// Define the /gemini POST route
app.post('/gemini', async (req, res) => {
    // Extract the text variable from the request body
    const { prompt } = req.body;
    
    try {
    
        const result = await model.generateContent(prompt);
        
        const response = await result.response;
        
        const responseText = marked.parse(response.text());
    

        // Send the response back to the client
        res.json({ response: responseText });

    } catch (error) {
        // Handle any errors that occur during the API call
        res.status(500).json({ error: error.message });
    }
});
    




var port = process.env.PORT || 3000;
app.listen(port,()=>console.log('server run at port '+port));