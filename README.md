# Passport-HeaderAPIKey-with-req

Origin: [Passport-HeaderAPIKey](https://github.com/hydra-newmedia/passport-headerapikey)
Pass req object(Not optional) to be the first parameter in verify function, to support nestjs passport module implementation

## Installation

    $ npm install @willieee802/passport-headerapikey

## Usage

#### Configure Strategy

The api key authentication strategy authenticates users using a apikey.
The strategy requires a `verify` callback, which accepts these
credentials and calls `done` providing a user.

```javascipt
    const HeaderAPIKeyStrategy = require('passport-headerapikey').HeaderAPIKeyStrategy

    passport.use(new HeaderAPIKeyStrategy(
      { header: 'Authorization', prefix: 'Api-Key ' },
      function(apikey, done) {
        User.findOne({ apikey: apikey }, function (err, user) {
          if (err) { return done(err); }
          if (!user) { return done(null, false); }
          return done(null, user);
        });
      }
    ));
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'headerapikey'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.post('/api/authenticate',
      passport.authenticate('headerapikey', { session: false, failureRedirect: '/api/unauthorized' }),
      function(req, res) {
        res.json({ message: "Authenticated" })
      });

#### API

##### Constructor

    new HeaderAPIKeyStrategy(header, passReqToCallback, verify);

Arguments:

- `headerConfig` (Object):
  - `header` (String): name of the header field to be used for api keys, default: _X-Api-Key_.
  - `prefix` (String): prefix to be used in content of the header, eg. `Bearer adsfadsfa`, default: empty. Attention: give it with blank if needed, eg. `'Bearer '`.
- `verify` (Function):
  - `req` (express.Request, optional): _express_ Request object if `passReqToCallback` is set to true.
  - `apiKey` (String): parsed API key from from the request. Use it to determine, which user is using your endpoint.
  - `verified` (Function): Callback to be called when you have done the API key handling. Signature: `verify(err, user, info) => void`.
    - `err` (Error): return an Error if user is not verified, otherwise yield `null` here
    - `user` (Object, optional): only return user object if he is verified.
    - `info`(Object, optional): yield additional information to success or failure of user verification.

## Examples

    curl -v --header "Authorization: Api-Key asdasjsdgfjkjhg" http://127.0.0.1:3000/api/authenticate
