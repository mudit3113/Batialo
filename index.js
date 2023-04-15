// firing up the xpress server 
const express = require('express');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
//used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const MongoStore = require('connect-mongo')(session);
const saasMiddleware = require('node-sass-middleware');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const customMware = require('./config/middleware');



const app  = express();

const port = 8000;


app.use(saasMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}));


// app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.urlencoded());

app.use(cookieParser());

//for accessing static files 
app.use(express.static('./assets'));

//use express router 
app.use(expressLayouts);

//make the uploads path available to the browser 
app.use('/uploads', express.static(__dirname + '/uploads'));

//extract styles and scripts from the sub pages into layout 
app.set('layout extractStyles', true );
app.set('layout extractScripts', true );

//use express router 

app.set('view engine', 'ejs');
app.set('views', './views');

// mongo store is used to store the session cookie in the db 
app.use(session({
    name: 'codeial',
    //todo change the secret before deployment in production mode 
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000*60*100)
    },
    store: new MongoStore(
        {
            mongooseConnection : db,
            autoRemove: 'disabled'
        },
        function(err){
            console.log(err || 'connect-mongodb setup ok' );
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

//use express router
app.use('/', require('./routes'));



app.listen(port, function(err){
    if(err){
        console.log(`Error in running the server: ${err}`);
        return;
    }
    console.log(`Server is running on port: ${port}`);
})

