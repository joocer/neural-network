

class brain {
    constructor(inputNeuronCount, outputNeuronCount) {
        //loadWeights()
        //saveWeights()
        //Train(inputs, expectedOutput)
        //Execute(inputs) // returns top output
        //FullExecute(inputs) // returns all outputs
        
        this.Layers = new [];
        this.Layers[0] = new nueronlayer(inputNeuronCount);
        this.Layers[1] = new nueronlayer(outputNeuronCount);

        this.addHiddenLayer = function(neuronCount) {
            var size = this.Layers.length;
            this.Layers.push(this.Layers[size - 1]);
            this.Layers[size - 1] = new nueronlayer(neuronCount);
        }

        this.calculateError = function(calculatedResult, desiredResult) {
            return 0.5 * Math.Square(desiredResult - calculatedResult);
        }
        
        this.calculateTotalError = function(outputArray, desiredResults) {
            var error = 0;
            for (var i = 0; i < outputArray.length; i++) {
                error += calculateError(outputArray[i], desiredResults[i]);
            }
            return error;
        }
    }
}

class nueronlayer {
    constructor(nueronCount) {
        this.Nuerons = [];
        this.size = nueronCount;

        this.execute = function() { 
            // 
        }
    }
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