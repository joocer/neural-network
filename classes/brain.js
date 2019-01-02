
// must be able to remember the weights so trained brains can be saved

var myNetwork = new Network({
    input: inputLayer,
    hidden: [],
    output: outputLayer
   });


// handles the set of layers
function createNetwork(numInputs, numOutputs) {
    // initializes with random values
    // if you have a trained data set, initialize it with them
}

// call this to add the number of neurons
function addLayer(neurons) {

}

// use this to execute the network
function executeNetworkFullResults(data) {

    // returns a dictionary of values, just take the top one
    return [];
}

function executeNetwork(data) {
    var results = executeNetworkFullResults(data);
    return results[0];
}


var inputs = [];
var layer = [[]];
var outputs = [];

var layerSize = 16;

function load (weights) {
    // load the weights
}

function fire() {
    // instantiate the for this layer
    var neurons = [];
    for (i = 0; i < layerSize; i++) {
        var n = new neuron();
    }

    // for all of the inputs from the previous layer
    // input to the neurons on this layer

    // fire each neuron and passforward the activation levels
}

class neuron {
    constructor() {
        // the combined value of the inputs
        this.energy = 0;
        // only when this is met does the neuron 'fire'
        this.threshold = 0.01;
        // this is the 'compression' algorithm - default to sigmoid
        this.nonlinearityfunction = sigmoid;
        // when neurons in previous layer fire, call this
        this.addInput = function(value, strength) {
            this.energy += this.energy + (value * strength);
        }
        // when all previous neurons have fired and this neuron's energy calculated, fire this neuron
        // returns the power to forward on
        this.fire = function() {
            var activation = this.nonlinearityfunction(this.energy);
            if (activation < this.threshold) { activation = null } 
            return activation 
        }
    }
}

// http://www.zacwitte.com/javascript-sigmoid-function
// compresses values to range [0,1]
function sigmoid(t) {
    return 1 / (1 + Math.exp(-t));
}
// compresses values to range [-1,1]
function tanh(t) {
    return Math.tanh(t);
}