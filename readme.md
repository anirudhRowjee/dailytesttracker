# Daily Test Tracker

A Simple HTML, CSS and Vanilla JS Computer-based test simulator. Does not
require internet to run.
This allows you to - 

* [x] choose the number of questions you solve
* [x] set a time limit
* [x] get marks instantly
* [ ] Store Test Data and get Statistics

(un-ticked checkboxes are features not yet implemented.)

Daily Test Tracker currently supports two marking schemes -
* JEE Mains (+4, -1)
* KCET (+1,0)

to get a proper evaulation of your score, an answerstring must be supplied in
the following format - 

```
<question number>-<correct option from (a,b,c,d)> <question number>-<correct
option from (a,b,c,d)> and so on
```

for example,

```
1-a 2-b 3-c 4-D 5-a 6-c 7-A 8-B 9-C 10-d 
```

your score will be evaulated based on this. ALL questions must be included and
must have **_only a single space_** between each.

## Usage Instructions

1. Download/clone the repository to your computer.
2. navigate to the folder you have downloaded the files to.
3. Double-click/open `index.html` and you're ready to go!

