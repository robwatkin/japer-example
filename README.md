# Japer Example

To play with japer just run
```
$ yarn dev
```
### Now you can...
Try to get a non existent document
```
$ curl -H "Content-Type: application/json" -X GET http://localhost:3000/japer/foo/document
document foo not found
```
Create and get a new document
```
$ curl -d '{"document": { "a": "A.1"}}' -H "Content-Type: application/json" -X POST http://localhost:3000/japer/foo/document
{"id":"4","version":0}%
$ curl -X GET http://localhost:3000/japer/foo/document
{"version":0,"document":{"a":"A.1"},"id":"4"}
```

Update an existing document reference it's id and version
```
$ curl -d '{"document": { "a": "A.1", "b": "B.1"}, "version": 0}' -H "Content-Type: application/json" -X POST http://localhost:3000/japer/foo/4/document
{"id":"4","version":1}%
$ curl -X GET http://localhost:3000/japer/foo/4/document
{"version":1,"document":{"a":"A.1","b":"B.1"},"id":"4"}
```

Create and update multiple documents
```
$ curl -d '{"document": { "p": "P.1"}}' -H "Content-Type: application/json" -X POST http://localhost:3000/japer/foo/document
{"id":"8","version":0}

$ curl -d '{"document": { "q": "P.1"}}' -H "Content-Type: application/json" -X POST http://localhost:3000/japer/foo/document
{"id":"9","version":0}

# If the version is missing or wrong !!!
$ curl -d '{"document": { "q": "Q.1"}}' -H "Content-Type: application/json" -X POST http://localhost:3000/japer/foo/9/document
Version undefined differs from stored version 0

$ curl -d '{"document": { "q": "Q.1"}, "version": 0}' -H "Content-Type: application/json" -X POST http://localhost:3000/japer/foo/9/document
{"id":"9","version":1}

$ curl -d '{"document": { "r": "R.1"}}' -H "Content-Type: application/json" -X POST http://localhost:3000/japer/foo/9/document
Version undefined differs from stored version 1

➜  japer-example git:(main) ✗ curl -d '{"document": { "r": "R.1"}}' -H "Content-Type: application/json" -X POST http://localhost:3000/japer/foo/document
{"id":"1","version":0}

➜  japer-example git:(main) ✗ curl -d '{"document": { "q": "Q.2"}, "version": 1}' -H "Content-Type: application/json" -X POST http://localhost:3000/japer/foo/9/document
{"id":"9","version":2}

# Get everything
$ curl -X GET http://localhost:3000/japer/foo/document
[
  {"version":1,"document":{"a":"A.1","b":"B.1"},"id":"4"},
  {"version":0,"document":{"p":"P.1"},"id":"8"},
  {"version":2,"document":{"q":"Q.2"},"id":"9"},
  {"version":0,"document":{"r":"R.1"},"id":"1"}
]
```
Delete a document
```
$ curl -d '{}' -H "Content-Type: application/json" -X DELETE http://localhost:3000/japer/foo/1/document
{"id":"1"}%
$ curl -X GET http://localhost:3000/japer/foo/document
[{"version":1,"document":{"a":"A.1","b":"B.1"},"id":"4"},{"version":0,"document":{"p":"P.1"},"id":"8"},{"version":2,"document":{"q":"Q.2"},"id":"9"}]
# {"r":"R.1"} has gone
```

Get a documents patches from and including a specified version
```
$ curl -X GET http://localhost:3000/japer/foo/9/patch/0
[
  {
    "version":0,
    "operations":[
      {"op":"replace","path":"/q","value":"Q.1"}
    ]
  },
  {
    "version":1,
    "operations":[
      {"op":"replace","path":"/q","value":"Q.2"}
    ]
  }
]

$ curl -X GET http://localhost:3000/japer/foo/9/patch/1
[
  {
    "version":1,
    "operations":[
      {"op":"replace","path":"/q","value":"Q.2"}
    ]
  }
]
```