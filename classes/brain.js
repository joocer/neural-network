class brain {
    constructor(inputNeuronCount, outputNeuronCount) {
        //todo: loadWeights()
        //todo: saveWeights()
        
        this.createNeuronLayer = function(size) {
            var layer = [];
            for (var l = 0; l < size; l++) {
                layer.push(new neuron);
            }
            return layer;
        }

        this.addHiddenLayer = function(neuronCount) {
            var size = this.Layers.length;
            this.Layers.push(this.Layers[size - 1]);
            this.Layers[size - 1] = this.createNeuronLayer(neuronCount);
        }

        this.calculateLoss = function(calculatedResult, desiredResult) {
            return 0.5 * Math.pow(desiredResult - calculatedResult, 2);
        }

        this.calculateTotalLoss = function(outputArray, desiredResults) {
            var error = 0;
            for (var i = 0; i < outputArray.length; i++) {
                error += this.calculateLoss(outputArray[i], desiredResults[i]);
            }
            return error;
        }

        // execute the model and return all of the values
        this.executeFullResults = function(inputValues) {
            for (var l = 0; l < (this.Layers.length - 1); l++) {            // source layer
                for (var t = 0; t < this.Layers[l + 1].length; t++) {
                for (var s = 0; s < this.Layers[l].length; s++) {           // source node
                       // target node
console.log('add energy to [', l + 1, ',', t, '] from [', l, ',', s, ']');
                        this.Layers[l + 1][t].addInput(this.Layers[l][s], this.Synapses[l][s][t]);
                    }
//console.log('#', l, s, t);
                    //this.Layers[l + 1][t].fire();
                }
            }

            var result = [];
            for (var i = 0; i < this.Layers[this.Layers.length - 1].length; i++) {
                result.push(this.Layers[this.Layers.length - 1][i].fire());
            }
            return result;
        }

        // return the best match and the score
        this.execute = function(inputValues) { 
            var fullResults = this.executeFullResults(inputValues);
            var maxScore = -1;
            var maxIndex = -1;
            for (var i = 0; i < fullResults.length; i++) {
                if (fullResults[i] > maxScore) {
                    maxScore = fullResults[i];
                    maxIndex = i;
                }
            }
            return { index: maxIndex, score: maxScore };
        }

        this.train = function(inputValues, desiredResults) {
            var fullResults = this.executeFullResults(inputValues);
            var loss = this.calculateTotalLoss(fullResults, desiredResults);
            // todo: backprop
//console.log(loss);
            return loss;
        }

        this.initialize = function() {
            for (var l = 0; l < (this.Layers.length - 1); l++) {
                this.Synapses[l] = [];
                for (var s = 0; s < this.Layers[l].length; s++) {
                    this.Synapses[l][s] = [];
                    for (var t = 0; t < this.Layers[l + 1].length; t++) {
                        this.Synapses[l][s][t] = Math.random();  // todo: look to replace or add another 'factor'
                    }
                }
            }
        }

        this.Layers = [];
        this.Layers[0] = this.createNeuronLayer(inputNeuronCount);
        this.Layers[1] = this.createNeuronLayer(outputNeuronCount);

        this.Synapses = [];
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

//a b c rslt
//0 0 0  0
//0 0 1  1
//0 1 0  1
//0 1 1  0
//1 0 0  1
//1 0 1  0
//1 1 0  0
//1 1 1  0

var myBrain = new brain(3,2);
myBrain.addHiddenLayer(4);
myBrain.initialize();
myBrain.train([0,0,0], [0,1]);
myBrain.train([0,0,1], [1,0]);
myBrain.train([0,1,0], [1,0]);

console.log(myBrain.execute([1,1,1]));