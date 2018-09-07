var finder = require('congressional-district-finder');
var fetch = require('node-fetch');
var User       = require('../app/models/user');


const APIKEY = `AIzaSyDnjF_rS5ujP9qBRHEvwGLrruPQ2g3EVDA`;
const PROPUBKEY = `xKkfjJ7GGJhrI9cqvaQBPZRgXcuTrxopTj8KvMg`;
let urls = [];
let billUrls = [];
// =============================================

const getListOfMembers =  (state) => {
    urls = [];
    billUrls = [];
  return fetch(`https://api.propublica.org/congress/v1/members/senate/${state}/current.json`,
  {
    headers: {'X-API-Key': PROPUBKEY}
  })
  .then(function(response) {
    return response.json();
  })
  .then(async function(myJson) {
    myJson.results.forEach(senator => {
       urls.push(`https://api.propublica.org/congress/v1/members/${senator.id}/bills/introduced.json`);
     });
    //let all =  await getMemberBills(urls);
    let all = await getMemberBills(urls)
    return all;

  })

}

/***/
const getMemberBills =  async function(urls) {
  return  Promise.all(urls.map(url =>
      fetch(url, {
        headers: {'X-API-Key': PROPUBKEY}
      })
        .then(resp => resp.json())))
        .then(res => {
          res[0].results[0].bills.forEach(bill => {
            billUrls.push(bill.bill_uri);
          });

        }).then(()=>{
          console.log("got all member bills")
          return getAllBills(billUrls)
        })
}

const getAllBills = (urls) => {
  return Promise.all(urls.map(url =>
      fetch(url, {
        headers: {'X-API-Key': PROPUBKEY}
      })
        .then(resp => resp.json())))
        .then(res => {
          console.log('got every bill final!!')
          //console.log(res)
          return res
        })
}







/**/

function matchPercent(votes = [], body){
   // Rounded(# of bills user voted yes to/# of bills voted) = Match %
   // req.user.votes == Array
   console.log('votes: ', votes, body);
   let yay = 0;
   let nay = 0;
   let sponsors = {};
   for(let i=0;i<votes.length;i++){
    let vote = votes[i];
    console.log('vote', vote, vote.decision);
    if(vote.decision === 'yay') yay++;
    if(vote.decision === 'nay') nay++;
    
    if (!(vote.sponsor in sponsors)){
        sponsors[vote.sponsor] = {yay:0, nay:0}
        sponsors[vote.sponsor][vote.decision] = 1   
      } else {
       sponsors[vote.sponsor][vote.decision]++
      }

   }
   console.log(yay, votes.length);
   console.log('users yay percentage is ', yay/(votes.length));
   console.log(sponsors);
   return sponsors;
}

// ============================================

module.exports = function(app, passport) {


// normal routes ===============================================================

    app.post('/save-bills', isLoggedIn, function(req, res){
    //   console.log(req.body, req.user);
      User.findOneAndUpdate( { _id: req.user._id }, { $push: { votes: req.body  } }, {new: true} ).then(user => {
        console.log(user, 'kiwi')
         // user.votes.push(req.body)
         // user.save()
         let sponsors = matchPercent(user.votes, req.body);
         res.json({success: true, sponsors: sponsors})
       }).catch(err => {throw err})
    });

    app.post('/state-select', isLoggedIn, function(req, res){
        console.log('state select');
        console.log(req.body);
        User.update( { _id: req.user._id }, { $set: { state: req.body.states  } } ).then(user => {
            //  res.json({success: true})
            res.redirect("/profile");
           }).catch(err => {throw err})
    });

    // SETTINGS SECTION =================

    app.get('/settings', isLoggedIn, function(req, res){
        res.render('settings.hbs', {
            user: req.user
        });
    });

    // show the home page (will also have our login links)
    app.get('/', async function(req, res) {
        //    let bills = await getListOfMembers('TX');
        //    console.log('bills',bills)
        //    console.log(bills[0].results[0])
        //    console.log(bills[1].results[0].votes)
           res.render('index.hbs', {})
        });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, async function(req, res) {
        // console.log(req.user, 'distinguished USER');
        // let bills = [];
        // if(req.user.state){
        //     bills = await getListOfMembers(req.user.state);
        // }

        let senators = [];
        req.user.votes.forEach(vote => {
            for(let i=0;i<senators.length;i++){
                if(senators[i].sponsor === vote.sponsor){
                    senators[i].match++;
                    return;
                }
            }
            senators.push({
                "sponsor": vote.sponsor,
                "match": 1 
            });
        });
        let sponsors = matchPercent(req.user.votes, req.body);
        console.log("senators", senators, sponsors);
        res.render('profile.hbs', {
            user : req.user,
            senators: senators, 
            sponsor: sponsors
        });
    });

    app.get('/bills', isLoggedIn, async function(req, res) {
        
        let bills = [];
        
        if(req.user.state){
            bills = await getListOfMembers(req.user.state);
        }
        
        // Use map to get a simple array of "val" values. Ex: [1,4]
        let yFilter = req.user.votes.map(itemY => { return itemY.suggest;});
        // Useful comment goes here
        let filteredX = bills.filter( (itemX) => {
             return !yFilter.includes(itemX.results[0].bill_uri);
        });
        
        res.render('bills.hbs', {
            user : req.user,
            bills: filteredX
        });
    });

    app.post('/test', isLoggedIn, async function(req, res) {
        console.log("TEST", req.body);
        let bills = [];
        
        if(req.body.state){
            bills = await getListOfMembers(req.body.state);
        }
        
        // Use map to get a simple array of "val" values. Ex: [1,4]
        let yFilter = req.user.votes.map(itemY => { return itemY.suggest;});
        // Useful comment goes here
        let filteredX = bills.filter( (itemX) => {
             return !yFilter.includes(itemX.results[0].bill_uri);
        });
        console.log('filterX', filteredX);
        res.render('profile.hbs', {
            user : req.user,
            bills: filteredX
        });
    });


    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.hbs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.hbs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // facebook -------------------------------

        // send to facebook to do the authentication
        app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['public_profile', 'email'] }));

        // handle the callback after facebook has authenticated the user
        app.get('/auth/facebook/callback',
            passport.authenticate('facebook', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

    // twitter --------------------------------

        // send to twitter to do the authentication
        app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

        // handle the callback after twitter has authenticated the user
        app.get('/auth/twitter/callback',
            passport.authenticate('twitter', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));


    // google ---------------------------------

        // send to google to do the authentication
        app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

        // the callback after google has authenticated the user
        app.get('/auth/google/callback',
            passport.authenticate('google', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------
        app.get('/connect/local', function(req, res) {
            res.render('connect-local.hbs', { message: req.flash('loginMessage') });
        });
        app.post('/connect/local', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // facebook -------------------------------

        // send to facebook to do the authentication
        app.get('/connect/facebook', passport.authorize('facebook', { scope : ['public_profile', 'email'] }));

        // handle the callback after facebook has authorized the user
        app.get('/connect/facebook/callback',
            passport.authorize('facebook', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

    // twitter --------------------------------

        // send to twitter to do the authentication
        app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

        // handle the callback after twitter has authorized the user
        app.get('/connect/twitter/callback',
            passport.authorize('twitter', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));


    // google ---------------------------------

        // send to google to do the authentication
        app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

        // the callback after google has authorized the user
        app.get('/connect/google/callback',
            passport.authorize('google', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // facebook -------------------------------
    app.get('/unlink/facebook', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.facebook.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // twitter --------------------------------
    app.get('/unlink/twitter', isLoggedIn, function(req, res) {
        var user           = req.user;
        user.twitter.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // google ---------------------------------
    app.get('/unlink/google', isLoggedIn, function(req, res) {
        var user          = req.user;
        user.google.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });


};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
