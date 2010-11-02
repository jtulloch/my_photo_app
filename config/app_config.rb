COUCHHOST = "http://127.0.0.1:5984"
APPDB    = 'photos-dev'
COUCH_SERVER    = CouchRest.new COUCHHOST
COUCH_SERVER.default_database = APPDB
DB = COUCH_SERVER.database(APPDB)
