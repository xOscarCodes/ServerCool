**Git clone the entire repository**

```bash
git clone https://github.com/xOscarCodes/ServerCool.git
```

**Change directory**

```bash
cd /website/api/config
```

**Make changes in 'keys.js' file**

```javascript
module.exports = {
    MongoURI:"mongodb://<USERNAME>:<PASSWORD>@<IP>:<PORT-Default-port:27017>/serverCool",
    user: '<USERNAME>',
    pass: '<PASSWORD>',
}
```

Replace `USERNAME`  and `PASSWORD` with authentication details of MongoDB database. Also change `IP` and `PORT` number. Mostly, `27017` is default port number.  
