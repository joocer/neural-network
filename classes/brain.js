class brain {
    constructor(inputNeuronCount, outputNeuronCount) {

        this.createNeuronLayer = function(size, bias) {
console.log ("creating neuron layer with bias of ", bias)
            var layer = [];
            for (var l = 0; l < size; l++) {
                layer.push(new neuron(bias));
            }
            return layer;
        }

        this.addHiddenLayer = function(neuronCount) {
            var size = this.Layers.length;
            this.Layers.push(this.Layers[size - 1]);
            this.Layers[size - 1] = this.createNeuronLayer(neuronCount, size * neuronCount);
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
            // load the input layer (layer 0) with the inputValues
console.log('==firing input layer neurons');
            for (var i = 0; i < this.Layers[0].length; i++) {
                this.Layers[0][i].addInput(inputValues[i], 1);
                this.Layers[0][i].activate();
            }

            // trigger all the synapses
            for (var l = 0; l < (this.Layers.length - 1); l++) {            // source layer
                for (var t = 0; t < this.Layers[l + 1].length; t++) {       // target node
                    for (var s = 0; s < this.Layers[l].length; s++) {       // source node                       
console.log('add energy to [', l + 1, ',', t, '] from [', l, ',', s, ']');
                        this.Layers[l + 1][t].addInput(this.Layers[l][s].activationEnergy, this.Synapses[l][s][t]);
                    }
console.log('fire neuron [', l + 1, ',', t, ']');
                    this.Layers[l + 1][t].activate();
                }
            }

            // extract the output layer
            var result = [];
            for (var i = 0; i < this.Layers[this.Layers.length - 1].length; i++) {
                result.push(this.Layers[this.Layers.length - 1][i].activationEnergy);
            }
            return result;
        }

        // return the best match and the score
        this.execute = function(inputValues) { 
            var fullResults = this.executeFullResults(inputValues);
console.log(fullResults);
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
console.log('loss on final layer is: ', loss);

            // adjust last hidden layer
            var penLayer = this.Layers.length - 1; // penultimate layer
            for (var t = 0; t < this.Layers[penLayer].length; t++) {
                for (var s = 0; s < this.Layers[penLayer - 1].length; s++) {
                    // loss * derivative * energy
                    var adjustment = this.calculateLoss(this.Layers[penLayer][t].activationEnergy, desiredResults[t]) *
                        this.Layers[penLayer][t].derivative * this.Layers[penLayer - 1][s].activationEnergy;
                    var newWeight = this.Synapses[penLayer - 1][s][t] - (this.LearningRate * adjustment);
console.log('adjusting weight of ', adjustment, ' for [', this.Layers.length - 2, ',', s, ',', t, '] from ', this.Synapses[penLayer - 1][s][t], ' => ', newWeight);
                    this.Synapses[penLayer - 1][s][t] = newWeight;
                }
            }

            for (var l = penLayer - 1; l > 0; l--) {
                for (var t = 0; t < this.Layers[l].length; t++) {
                    var error = 0;
                    for (var s = 0; s < this.Layers[l - 1].length; s++) {
                        error += this.Synapses[l - 1][s][t] * this.Layers[l][t].derivative;
console.log('calculated error of ', error, 'for [', l, ',', t, '], looking at synapse [', l - 1, ',', s, ',', t, ']');
                    }
                    var adjustment = error * this.Layers[l][t].derivative * this.Layers[l][t].activationEnergy;
                    for (var s = 0; s < this.Layers[l - 1].length; s++) {
                        var newWeight = this.Synapses[l - 1][s][t] - (this.LearningRate * adjustment);
console.log('adjusting weight of ', adjustment, ' for [', l - 1, ',', s, ',', t, '] from ', this.Synapses[l - 1][s][t], ' => ', newWeight);
                        this.Synapses[l - 1][s][t] = newWeight;
                    }
                }
            }
            return loss;
        }

        this.initialize = function() {
            for (var l = 0; l < (this.Layers.length - 1); l++) {
                this.Synapses[l] = [];
                for (var s = 0; s < this.Layers[l].length; s++) {
                    this.Synapses[l][s] = [];
                    for (var t = 0; t < this.Layers[l + 1].length; t++) {
                        this.Synapses[l][s][t] = 1 - (Math.random() * 2);
console.log('initializing synapse: [', l , ',', s, ',', t, '] with', this.Synapses[l][s][t]);
                    }
                }
            }
        }

        this.Layers = [];
        this.Layers[0] = this.createNeuronLayer(inputNeuronCount, 15);
        this.Layers[1] = this.createNeuronLayer(outputNeuronCount, -7);

        this.Synapses = [];

        this.LearningRate = 0.5;
    }
}

class neuron {
    constructor(bias) {
        // the combined value of the inputs
        this.energy = 0;
        // bias
        this.bias = bias;
        // the result of the neuron being fired
        this.activationEnergy = 0;
        // the derivitive of the energy
        this.derivative = 0;
        // when neurons in previous layer fire, call this
        this.addInput = function(value, strength) {
console.log ('adding energy ', { 'value': value, 'strength': strength, 'previous': this.energy, 'new': this.energy + (value * strength) });
            this.energy += this.energy + (value * strength);
        }
        // when all previous neurons have fired and this neuron's energy calculated, fire this neuron
        this.activate = function() {
            var activation = 1 / (1 + Math.exp(this.energy + this.bias));
            this.derivative = activation * (1.0 - activation);
            this.activationEnergy = activation;
console.log ('firing ', { 'energy': (this.energy + this.bias), 'activation': activation, 'derivative': this.derivative });
        }
    }
}

var myBrain = new brain(2,2);
myBrain.addHiddenLayer(2);
myBrain.initialize();
for (var c = 0; c < 50; c++) {
    console.log ('======================training round');
    myBrain.train([0,0], [1,0]);    // 0
//    myBrain.train([0,1], [0,1]);    // 1
//    myBrain.train([1,0], [0,1]);    // 1
}
//console.log ('======================execution round 1');
console.log(myBrain.execute([0,0]));  // 0