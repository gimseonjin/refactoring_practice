class statement{
    constructor(invoice, plays){
        this.plays = plays
        this.customer = invoice.customer
        this.performances = invoice.performances.map(this.enrichPerformance)
        this.totalAmountResult = this.totalAmount(this.performances)
        this.totalVolumeCreditsResult = this.totalVolumeCredits(this.performances)
    }

    run = () => {
        return this.renderHtml()
    }

    renderPlainText = () => {
        let result = `청구 내역 (고객명 : ${this.customer})\n`

        for (let perf of this.performances){
            result += ` ${perf.play.name}: ${this.usd(perf.amount)} (${perf.audience}석) \n`
        }
    
        result += `총액 : ${this.usd(this.totalAmountResult)}\n`
        result += `적립 포인트: ${this.totalVolumeCreditsResult}점\n`
    
        return result
    }

    renderHtml = () => {
        let result = `<h1>청구 내역 (고객명 : ${this.customer})</h1>\n`
        result += `<table>\n`
        result += `<tr><th>연극</th><th>좌석 수</th><th>금액</th></tr>`
        for (let perf of this.performances){
            result += ` <tr><td>${perf.play.name}</td><td>${perf.audience}석</td><td>${this.usd(perf.amount)}</td>\n`
        }
        result += `</table>\n`
        result += `<p>총액 : <em>${this.usd(this.totalAmountResult)}</em></p>\n`
        result += `<p>적립 포인트: <em>${this.totalVolumeCreditsResult}</em>점</p>\n`
    
        return result
    }

    enrichPerformance = (aPerformance) => {
        const result = Object.assign({}, aPerformance)
        result.play = this.playFor(result)
        result.amount = this.amountFor(result)
        result.volumeCredits = this.volumeCreditsFor(result)
        return result
    }

    totalAmount = () => this.performances.reduce((total, p) => total + p.amount, 0)
    
    totalVolumeCredits = () => this.performances.reduce((total, p) => total + p.volumeCredits, 0)

    usd = (aPerformance) =>{
        return new Intl.NumberFormat("en-US", { style : "currency", currency : "USD", minimumFractionDigits: 2})
                        .format(aPerformance/100)
    }

    volumeCreditsFor = (aPerformance) =>{

        let volumeCredits = 0
    
        volumeCredits += Math.max(aPerformance.audience - 30, 0)
    
        if("comedy" == aPerformance.play.type) 
            volumeCredits += Math.floor(aPerformance.audience / 5)
        
        return volumeCredits
    
    }

    playFor = (aPerformance) =>{
        return this.plays[aPerformance.playID]
    }

    amountFor = (aPerformance) => {

        let result = 0;

        switch (aPerformance.play.type){

            case "tragedy":
                result = 40000
                if (aPerformance.audience > 30){
                    result += 1000 * (aPerformance.audience - 30)
                }
                break;
            
            case "comedy":
                result = 30000
                if (aPerformance.audience > 20){
                    result += 10000 + 500 * (aPerformance.audience - 20)
                }
                result += 300 * aPerformance.audience
                break;
    
            default :
                throw new Error(`알 수 없는 장르: ${aPerformance.play.type}`)
        }
    
        return result
    }
}

//================== main ==================

import fs from "fs";

const plays = fs.readFileSync('ch1/data/plays.json', 'utf8');
const invoices = fs.readFileSync('ch1/data/invoices.json', 'utf8');

const playsJson = JSON.parse(plays);
const invoicesJson = JSON.parse(invoices);

for(let invoice of invoicesJson){
    const s = new statement(invoice, playsJson)
    const result = s.run()
    console.log(result)
}
