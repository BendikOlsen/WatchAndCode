// case 1: In a regular function(or if you're not in a function at all), this points to window. This is the default case. 

function logThis() {
    console.log(this);
}

logThis(); 

// case 2: When a function is called as a method, this points to the object that's on the left side of the dot

var myObject = {
    myMethod: function () {
        console.log(this);
    }
};

myObject.myMethod();

// case 3: In a function that's being called as a constructor, this points to the object that the constructor is creating.

function Person(name) {
    this.name = name;
}

var bendik = new Person('bendik');
console.log(bendik); 