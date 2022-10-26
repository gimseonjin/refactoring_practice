export default class PerformanceCalculatorFactory{
    static createPerformanceCalculator = (performance, play) => {
        switch(play.type){
            case "tragedy" : return new TragedyCalculator(performance, play)
            case "comedy" : return new ComedyCalculatorCalculator(performance, play)
        }
    }
}

class PerformanceCalculator{
    constructor(performance, play){
        this.aPerformance = performance
        this.play = play
    }

    get volumeCredits() {
        return Math.max(this.aPerformance.audience - 30, 0)
    }

}


class TragedyCalculator extends PerformanceCalculator{
    get amount() {
        let result = 40000
        if (this.aPerformance.audience > 30){
            result += 1000 * (this.aPerformance.audience - 30)
        }
        return result
    }
}


class ComedyCalculatorCalculator extends PerformanceCalculator{
    get amount() {
        let result = 30000
        if (this.aPerformance.audience > 20){
            result += 10000 + 500 * (this.aPerformance.audience - 20)
        }
        result += 300 * this.aPerformance.audience
        return result
    }

    get volumeCredits() {
        return super.volumeCredits + Math.floor(this.aPerformance.audience / 5)
    }
}