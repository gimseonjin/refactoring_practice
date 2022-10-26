var statment = (invoice) =>{

    let result = `청구 내역 (고객명 : ${invoice.customer})\n`

    for (let perf of invoice.performances){
        result += ` ${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석) \n`
    }

    result += `총액 : ${usd(totalAmount(invoice.performances))}\n`
    result += `적립 포인트: ${totalVolumeCredits(invoice.performances)}점\n`

    return result
}

var totalAmount = (aPerformance) => {

    let result = 0

    for (let perf of aPerformance){
        result += amountFor(perf)
    }
    
    return result
}

var totalVolumeCredits = (aPerformance) => {

    let result = 0

    for (let perf of aPerformance){
        result  += volumeCreditsFor(perf) 
    }

    return result
}

var usd = (aPerformance) =>{
    return new Intl.NumberFormat("en-US", { style : "currency", currency : "USD", minimumFractionDigits: 2})
                    .format(aPerformance/100)
}

var volumeCreditsFor = (aPerformance) =>{

    let volumeCredits = 0

    volumeCredits += Math.max(aPerformance.audience - 30, 0)

    if("comedy" == playFor(aPerformance).type) 
        volumeCredits += Math.floor(aPerformance.audience / 5)
    
    return volumeCredits

}

var playFor = (aPerformance) =>{
    return playsJson[aPerformance.playID]
}


var amountFor = (aPerformance) => {

    let result = 0;

    switch (playFor(aPerformance).type){
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
            throw new Error(`알 수 없는 장르: ${playFor(aPerformance).type}`)
    }

    return result
}


//================== main ==================

import fs from "fs";

const plays = fs.readFileSync('ch1/data/plays.json', 'utf8');
const invoices = fs.readFileSync('ch1/data/invoices.json', 'utf8');

const playsJson = JSON.parse(plays);
const invoicesJson = JSON.parse(invoices);

for (let invoice of invoicesJson){
    const result = statment(invoice, playsJson)
    console.log(result)
}
